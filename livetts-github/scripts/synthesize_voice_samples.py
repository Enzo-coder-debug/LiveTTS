import argparse
import asyncio
import datetime
import hashlib
import importlib.util
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import time
import uuid
from urllib.parse import urlsplit

from synthesize_samples import inspect_audio


ROOT = pathlib.Path(__file__).resolve().parent.parent


def signature_for(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def load_protocol(filename):
    spec = importlib.util.spec_from_file_location('local_livetts_voice_protocol', filename.resolve())
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    endpoint = urlsplit(module.WS_URL)
    if endpoint.scheme != 'wss' or endpoint.hostname != 'open-live-api.jd.com' or endpoint.path != '/livetts-ws' or endpoint.username or endpoint.password:
        raise ValueError('Only the configured LiveTTS WSS endpoint is allowed')
    return module


def save_json(filename, content):
    temporary = filename.with_suffix('.tmp.json')
    temporary.write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(filename)


async def receive_audio(module, request, timeout, log_path):
    secret = os.environ.get('LIVETTS_API_KEY') or module.API_KEY
    if not secret:
        raise ValueError('A LiveTTS credential is required')
    headers = {'Request-Id': str(uuid.uuid4()), 'X-API-KEY': secret}
    audio = bytearray()
    finished = False
    with log_path.open('w') as log:
        async with asyncio.timeout(timeout):
            async with module.websockets.connect(module.WS_URL, additional_headers=headers, open_timeout=min(timeout, 30), max_size=16 * 1024 * 1024) as websocket:
                await module.full_client_request(websocket, request)
                while True:
                    message = await module.receive_message(websocket)
                    if message.type == module.MsgType.Error:
                        log.write(json.dumps({'error_code': message.error_code, 'payload': message.payload.decode('utf8', 'replace')}, ensure_ascii=False) + '\n')
                        raise ValueError('LiveTTS returned an error; inspect the private log')
                    if message.type == module.MsgType.AudioOnlyServer:
                        audio.extend(message.payload)
                        if len(audio) > 64 * 1024 * 1024:
                            raise ValueError('Audio exceeded the per-request size limit')
                    elif message.type == module.MsgType.FullServerResponse:
                        payload_text = message.payload.decode('utf8', 'replace')
                        log.write(json.dumps({'event': int(message.event), 'payload': payload_text}, ensure_ascii=False) + '\n')
                        try:
                            payload = json.loads(payload_text)
                        except json.JSONDecodeError:
                            payload = {}
                        if isinstance(payload, dict) and payload.get('status', 0) not in (0, '0', None):
                            raise ValueError('LiveTTS returned a nonzero status; inspect the private log')
                        if message.event == module.EventType.TTSEnd:
                            finished = True
                            break
    if not finished or not audio:
        raise ValueError('LiveTTS did not return a completed, nonempty audio stream')
    return bytes(audio)


def validate_jobs(profile):
    voice = profile['voice']
    if set(voice) != {'model', 'version', 'speaker'} or not all(isinstance(value, str) and value.strip() for value in voice.values()):
        raise ValueError('Specify model, version and speaker explicitly')
    seen_ids = set()
    seen_files = set()
    allowed_tags = set(profile.get('language_tags', {}).values()) | set(profile.get('dialect_tags', []))
    for job in profile['jobs']:
        if not job.get('text', '').strip() or not job.get('emotion', '').strip() or not job.get('lang', '').strip():
            raise ValueError('Each job requires text, emotion and an explicit language instruction')
        if job['lang'].lower() == 'auto' or (allowed_tags and job['lang'] not in allowed_tags):
            raise ValueError('Language must be an explicit approved language or dialect tag')
        filename = pathlib.Path(job['filename'])
        if filename.name != str(filename) or filename.suffix != '.wav':
            raise ValueError('Output filenames must be simple WAV basenames')
        if job['id'] in seen_ids or job['filename'] in seen_files:
            raise ValueError('Job IDs and filenames must be unique')
        seen_ids.add(job['id'])
        seen_files.add(job['filename'])


async def main():
    parser = argparse.ArgumentParser(description='Synthesize explicit model/version/speaker requests using the local LiveTTS WebSocket protocol script')
    parser.add_argument('--script', type=pathlib.Path, required=True)
    parser.add_argument('--jobs', type=pathlib.Path, required=True)
    parser.add_argument('--destination', type=pathlib.Path, required=True)
    parser.add_argument('--only', help='Run one exact job ID')
    parser.add_argument('--timeout', type=float, default=180)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    profile = json.loads(args.jobs.read_text())
    validate_jobs(profile)
    jobs = [job for job in profile['jobs'] if not args.only or job['id'] == args.only]
    if not jobs or args.timeout <= 0:
        parser.error('Select at least one job and a positive timeout')
    private_root = (ROOT / '.generation').resolve()
    destination = args.destination.resolve()
    if not destination.is_relative_to(private_root) or destination == private_root:
        parser.error('Use a dedicated subdirectory of .generation, never a public assets directory')
    if args.dry_run:
        print(json.dumps({'voice': profile['voice'], 'jobs': len(jobs), 'pending': profile.get('pending', [])}, ensure_ascii=False))
        return
    module = load_protocol(args.script)
    destination.mkdir(mode=0o700, parents=True, exist_ok=True)
    manifest_path = destination / 'manifest.json'
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {'voice': profile['voice'], 'results': {}}
    if manifest['voice'] != profile['voice']:
        parser.error('Voice differs from existing generation; choose a new directory')
    completed = 0
    for job in jobs:
        request = {**profile['voice'], 'text': job['text'], 'emotion': job['emotion'], 'lang': job['lang'], 'audio_format': 'mp3', 'sample_rate': '24000'}
        signature = signature_for(request)
        target = destination / job['filename']
        original_audio = target.with_suffix('.mp3')
        previous = manifest['results'].get(job['id'])
        if previous and previous.get('signature') == signature and target.exists() and original_audio.exists():
            if inspect_audio(target)['sha256'] != previous['audio']['sha256'] or hashlib.sha256(original_audio.read_bytes()).hexdigest() != previous['original_sha256']:
                raise ValueError('Existing audio checksum changed')
            print('SKIP', job['id'], flush=True)
            completed += 1
            continue
        if target.exists() or original_audio.exists():
            raise ValueError('Refusing to overwrite a nonmatching generated file')
        print('START', job['id'], 'emotion=' + job['emotion'], 'lang=' + job['lang'], flush=True)
        started = time.monotonic()
        log_path = destination / (job['filename'] + '.private.log')
        raw_audio = await receive_audio(module, request, args.timeout, log_path)
        with tempfile.TemporaryDirectory(prefix='clip-', dir=destination) as temporary:
            raw_path = pathlib.Path(temporary) / 'source.mp3'
            wav_path = pathlib.Path(temporary) / 'decoded.wav'
            raw_path.write_bytes(raw_audio)
            probe = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(raw_path)], capture_output=True, text=True, check=True)
            streams = json.loads(probe.stdout)['streams']
            if len(streams) != 1 or streams[0]['codec_name'] != 'mp3' or streams[0]['channels'] != 1 or streams[0]['sample_rate'] != '24000':
                raise ValueError('Expected mono 24 kHz MP3 from the API')
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(raw_path), '-c:a', 'pcm_s16le', str(wav_path)], capture_output=True, check=True)
            metadata = inspect_audio(wav_path)
            if metadata['clipped_sample_ratio'] > 0:
                raise ValueError('Decoded audio contains clipped samples')
            raw_path.replace(original_audio)
            wav_path.replace(target)
        manifest['results'][job['id']] = {
            'filename': job['filename'], 'request': request, 'signature': signature,
            'original_sha256': hashlib.sha256(raw_audio).hexdigest(), 'audio': metadata,
            'generated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'elapsed_seconds': round(time.monotonic() - started, 3),
            'processing': 'API MP3 decoded to PCM16 WAV; no trimming, resampling, denoising or normalization',
        }
        save_json(manifest_path, manifest)
        completed += 1
        print('OK', job['id'], json.dumps(metadata, ensure_ascii=False), flush=True)
    print('Generated or reused', completed, 'files; no public audio was replaced.', flush=True)


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except Exception as error:
        response = getattr(error, 'response', None)
        if response is not None:
            print('Generation stopped during handshake: HTTP', response.status_code, '— no audio was generated; check endpoint authorization.', file=sys.stderr)
        else:
            print('Generation stopped:', type(error).__name__, '— inspect local private logs; no automatic retries.', file=sys.stderr)
        sys.exit(1)

import argparse
import contextlib
import datetime
import importlib.util
import json
import os
import pathlib
import re
import sys
import tempfile
import time
import uuid
from urllib.parse import urlsplit

from synthesize_samples import inspect_audio, load_credential
from synthesize_voice_samples import save_json, signature_for, validate_jobs


ROOT = pathlib.Path(__file__).resolve().parent.parent


def validate_completion(log_path):
    responses = []
    for line in log_path.read_text().splitlines():
        matched = re.match(r'\[RESP\] seq=(\d+) (.*)', line)
        if matched:
            response = json.loads(matched.group(2))
            if response.get('status') != 0 or int(matched.group(1)) != len(responses) + 1:
                raise ValueError('Unsuccessful or out-of-order HTTP response')
            responses.append(response)
    if not responses or responses[-1].get('index', 0) >= 0:
        raise ValueError('No explicit final audio response; refusing to publish a partial result')
    return len(responses)


def main():
    parser = argparse.ArgumentParser(description='Generate a reviewed catalogue with an explicit HTTP timbre ID; never reuse a cloned fid')
    parser.add_argument('--script', type=pathlib.Path, required=True)
    parser.add_argument('--credential-script', type=pathlib.Path)
    parser.add_argument('--jobs', type=pathlib.Path, required=True)
    parser.add_argument('--destination', type=pathlib.Path, required=True)
    parser.add_argument('--timbre-id', required=True)
    parser.add_argument('--only', help='One exact job ID')
    parser.add_argument('--timeout', type=float, default=120)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    profile = json.loads(args.jobs.read_text())
    validate_jobs(profile)
    if not args.timbre_id.isdigit() or args.timeout <= 0:
        parser.error('Specify a numeric timbre ID and positive timeout')
    jobs = [job for job in profile['jobs'] if not args.only or job['id'] == args.only]
    if not jobs:
        parser.error('No matching job')
    destination = args.destination.resolve()
    private_root = (ROOT / '.generation').resolve()
    if not destination.is_relative_to(private_root) or destination == private_root:
        parser.error('Use a dedicated private generation subdirectory')
    identity = {'transport': 'https', 'timbre_id': args.timbre_id, 'model_version': profile['voice']['version']}
    if args.dry_run:
        print(json.dumps({'request_identity': identity, 'jobs': len(jobs)}, ensure_ascii=False))
        return
    secret = load_credential(args.credential_script)
    if not secret:
        parser.error('Configure LIVETTS_API_KEY or an explicit credential script')
    spec = importlib.util.spec_from_file_location('local_livetts_timbre_http', args.script.resolve())
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    endpoint = urlsplit(module.url)
    if endpoint.scheme != 'https' or endpoint.hostname != 'open-live-api.jd.com' or endpoint.path != '/livetts' or endpoint.username or endpoint.password:
        parser.error('Only the expected LiveTTS HTTPS endpoint is allowed')
    if module.pp['parameters'] is not module.parameters or module.pp['extparameters'] is not module.extparameters:
        parser.error('Unexpected property structure in local HTTP script')
    module.parameters.update({'tim': args.timbre_id, 'sr': '24000', 'aue': '1', 'sp': '1.0', 'vol': '4.0'})
    module.extparameters.pop('fid', None)
    module.extparameters['model_version'] = identity['model_version']
    module.headers['X-API-KEY'] = secret
    destination.mkdir(mode=0o700, parents=True, exist_ok=True)
    manifest_path = destination / 'manifest.json'
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {'request_identity': identity, 'results': {}}
    if manifest.get('request_identity') != identity:
        parser.error('Different voice or model version in destination; use a new generation directory')
    completed = 0
    for job in jobs:
        module.extparameters.update({'emotion': job['emotion'], 'lang': job['lang']})
        request = {'text': job['text'], 'parameters': dict(module.parameters), 'extparameters': dict(module.extparameters)}
        if request['parameters']['tim'] != args.timbre_id or 'fid' in request['extparameters']:
            raise ValueError('Timbre override is not isolated from the previous voice')
        signature = signature_for(request)
        target = destination / job['filename']
        previous = manifest['results'].get(job['id'])
        if previous and previous.get('signature') == signature and target.exists():
            if inspect_audio(target)['sha256'] != previous['audio']['sha256']:
                raise ValueError('Existing audio checksum changed')
            print('SKIP', job['id'], flush=True)
            completed += 1
            continue
        if target.exists():
            raise ValueError('Refusing to overwrite a nonmatching output')
        module.headers.update({'Request-Id': str(uuid.uuid4()), 'Sequence-Id': '1', 'Property': json.dumps(module.pp, ensure_ascii=True)})
        print('START', job['id'], 'tim=' + args.timbre_id, 'lang=' + job['lang'], 'emotion=' + job['emotion'], flush=True)
        started = time.monotonic()
        log_path = destination / (job['filename'] + '.private.log')
        current_directory = pathlib.Path.cwd()
        with tempfile.TemporaryDirectory(prefix='clip-', dir=destination) as temporary:
            try:
                os.chdir(temporary)
                with log_path.open('w') as log:
                    with contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
                        module.test_single(job['text'], timeout=args.timeout)
                chunks = validate_completion(log_path)
                generated = pathlib.Path(temporary) / 'test.wav'
                metadata = inspect_audio(generated)
                if metadata['clipped_sample_ratio'] > 0:
                    raise ValueError('Generated audio contains clipping')
                generated.replace(target)
            finally:
                os.chdir(current_directory)
        manifest['results'][job['id']] = {
            'filename': job['filename'], 'request': request, 'signature': signature,
            'audio': metadata, 'chunks': chunks,
            'generated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'elapsed_seconds': round(time.monotonic() - started, 3),
            'processing': 'Original API PCM16 wrapped in WAV; no resampling, trimming, denoising or normalization',
        }
        save_json(manifest_path, manifest)
        completed += 1
        print('OK', job['id'], json.dumps(metadata, ensure_ascii=False), flush=True)
    print('Generated or reused', completed, 'outputs; public audio is unchanged.', flush=True)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('Generation stopped:', type(error).__name__, '— inspect private logs; no automatic retries.', file=sys.stderr)
        sys.exit(1)

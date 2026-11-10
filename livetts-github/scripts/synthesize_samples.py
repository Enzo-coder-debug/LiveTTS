import argparse
import array
import ast
import contextlib
import datetime
import hashlib
import importlib.util
import json
import math
import os
import pathlib
import subprocess
import sys
import tempfile
import time
import uuid
import wave
from urllib.parse import urlsplit


ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTROLS = {
    "one-voice": [("one-voice-zh.wav", "中立", "zh"), ("one-voice-en.wav", "中立", "en")],
    "emotional-range": [
        ("emotion-warm.wav", "温暖", "zh"), ("emotion-excited.wav", "高兴", "zh"), ("emotion-sad.wav", "悲伤", "zh"),
        ("emotion-neutral.wav", "中立", "zh"), ("emotion-angry.wav", "愤怒", "zh"), ("emotion-fearful.wav", "恐惧", "zh"),
        ("emotion-surprised.wav", "惊讶", "zh"), ("emotion-worried.wav", "担忧", "zh"), ("emotion-expectant.wav", "期待", "zh"), ("emotion-urgent.wav", "着急", "zh"),
    ],
    "audio-tags": [("audio-tags-output.wav", "中立", "zh"), ("tag-laughter.wav", "中立", "zh"), ("tag-sigh.wav", "中立", "zh"), ("tag-cough.wav", "中立", "zh"), ("tag-throat.wav", "中立", "zh")],
    "across-languages": [
        ("language-en.wav", "中立", "en"), ("language-ja.wav", "中立", ""), ("language-mixed.wav", "中立", ""),
        ("language-de.wav", "中立", ""), ("language-fr.wav", "中立", ""), ("language-es.wav", "中立", ""), ("language-nl.wav", "中立", ""),
        ("language-ko.wav", "中立", ""), ("language-ar.wav", "中立", ""), ("language-id.wav", "中立", ""),
    ],
    "local-voices": [
        ("dialect-sichuan.wav", "中立", "sichuan"), ("dialect-cantonese.wav", "中立", "yue"), ("dialect-dongbei.wav", "中立", "dongbei"),
        ("dialect-henan.wav", "中立", "henan"), ("dialect-tianjin.wav", "中立", "tianjin"), ("dialect-shaanxi.wav", "中立", "shaanxi"),
        ("dialect-shanghai.wav", "中立", "shanghai"), ("dialect-min.wav", "中立", "min"),
    ],
    "long-story": [("long-story-output.wav", "中立", "zh"), ("long-podcast.wav", "中立", "zh")],
    "phonetics": [("phonetics-output.wav", "中立", "zh")],
    "everyday-scenarios": [("scene-service.wav", "温暖", "zh"), ("scene-live.wav", "高兴", "zh"), ("scene-museum.wav", "中立", "zh")],
}


def load_credential(filename):
    secret = os.environ.get("LIVETTS_API_KEY", "")
    if secret or not filename:
        return secret
    tree = ast.parse(filename.read_text())
    values = {}
    for statement in tree.body:
        if isinstance(statement, ast.Assign):
            for target in statement.targets:
                if isinstance(target, ast.Name) and target.id in {"API_KEY", "WS_URL"}:
                    values[target.id] = ast.literal_eval(statement.value)
    if urlsplit(values.get("WS_URL", "")).hostname != "open-live-api.jd.com":
        raise ValueError("Credential source does not belong to the expected LiveTTS host")
    return values.get("API_KEY", "")


def load_samples():
    source = "const fs=require('fs'),vm=require('vm');const context={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),context);console.log(JSON.stringify(context.window.LIVETTS_DATA.samples));"
    result = subprocess.run(["node", "-e", source, str(ROOT / "data.js")], check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def inspect_audio(filename):
    with wave.open(str(filename), "rb") as audio:
        if audio.getnchannels() != 1 or audio.getsampwidth() != 2 or audio.getframerate() != 24000:
            raise ValueError("Expected mono 24 kHz PCM16 WAV")
        frames = audio.getnframes()
        samples = array.array("h", audio.readframes(frames))
    if sys.byteorder != "little":
        samples.byteswap()
    if frames < 2400 or len(samples) != frames:
        raise ValueError("Audio is empty, truncated, or implausibly short")
    peak = max(abs(value) for value in samples) / 32768
    rms = math.sqrt(sum(value * value for value in samples) / len(samples)) / 32768
    if rms < 0.0001:
        raise ValueError("Audio is silent or nearly silent")
    return {
        "duration_seconds": round(frames / 24000, 3),
        "bytes": filename.stat().st_size,
        "sha256": hashlib.sha256(filename.read_bytes()).hexdigest(),
        "peak_dbfs": round(20 * math.log10(max(peak, 1e-10)), 2),
        "rms_dbfs": round(20 * math.log10(rms), 2),
        "clipped_sample_ratio": round(sum(abs(value) >= 32760 for value in samples) / len(samples), 7),
    }


def main():
    parser = argparse.ArgumentParser(description="Generate showcase audio using an existing local LiveTTS HTTP script")
    parser.add_argument("--script", type=pathlib.Path, required=True)
    parser.add_argument("--credential-script", type=pathlib.Path)
    parser.add_argument("--only", help="One case/output index, for example one-voice/0")
    parser.add_argument("--timeout", type=float, default=120)
    args = parser.parse_args()
    secret = load_credential(args.credential_script)
    if not secret:
        parser.error("Set LIVETTS_API_KEY or supply an explicit local credential script")
    spec = importlib.util.spec_from_file_location("local_livetts_http", args.script.resolve())
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    endpoint = urlsplit(module.url)
    if endpoint.scheme != "https" or endpoint.hostname != "open-live-api.jd.com" or endpoint.username or endpoint.password:
        parser.error("Refusing to transmit credentials outside the expected HTTPS LiveTTS host")
    if module.parameters.get("aue") != "1" or module.parameters.get("sr") != "24000":
        parser.error("The local script must be configured for 24 kHz PCM output")
    model = module.extparameters.get("model_version")
    if not model:
        parser.error("The local script must specify a model version")
    module.headers["X-API-KEY"] = secret
    private = ROOT / ".generation"
    private.mkdir(mode=0o700, exist_ok=True)
    destination = private / "audio"
    destination.mkdir(exist_ok=True)
    manifest_path = private / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {"model_version": model, "results": {}}
    if manifest["model_version"] != model:
        parser.error("Existing generation manifest uses a different model")
    voice_fingerprint = hashlib.sha256(json.dumps({"fid": module.extparameters.get("fid"), "tim": module.parameters.get("tim")}, sort_keys=True).encode()).hexdigest()
    if manifest.get("voice_fingerprint", voice_fingerprint) != voice_fingerprint:
        parser.error("Configured voice changed; start a separate generation directory")
    manifest["voice_fingerprint"] = voice_fingerprint
    completed = 0
    for sample in load_samples():
        if len(CONTROLS[sample["id"]]) != len(sample["outputs"]):
            raise ValueError("Catalogue changed; review generation controls first")
        for index, output in enumerate(sample["outputs"]):
            job_id = f"{sample['id']}/{index}"
            if args.only and job_id != args.only:
                continue
            filename, emotion, language = CONTROLS[sample["id"]][index]
            settings = {"emotion": emotion, "lang": language, "speed": module.parameters.get("sp"), "volume": module.parameters.get("vol"), "sample_rate": 24000, "channels": 1, "sample_width_bits": 16}
            signature = hashlib.sha256(json.dumps({"text": output["text"], "settings": settings, "model": model, "voice": voice_fingerprint}, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
            target = destination / filename
            previous = manifest["results"].get(job_id)
            if previous and previous.get("signature") == signature and target.exists():
                actual = inspect_audio(target)
                if actual["sha256"] != previous["audio"]["sha256"]:
                    raise ValueError("Existing audio checksum changed: " + filename)
                print("SKIP", job_id, "already generated and verified", flush=True)
                completed += 1
                continue
            if target.exists():
                raise ValueError("Refusing to overwrite an existing nonmatching audio file: " + filename)
            module.extparameters["emotion"] = emotion
            if language:
                module.extparameters["lang"] = language
            else:
                module.extparameters.pop("lang", None)
            module.headers["Request-Id"] = str(uuid.uuid4())
            module.headers["Sequence-Id"] = "1"
            module.headers["Property"] = json.dumps(module.pp, ensure_ascii=True)
            print("START", job_id, "model=" + model, "emotion=" + emotion, "lang=" + (language or "auto"), flush=True)
            started = time.monotonic()
            original_directory = pathlib.Path.cwd()
            with tempfile.TemporaryDirectory(prefix="clip-", dir=private) as temporary:
                try:
                    os.chdir(temporary)
                    with open(private / (filename + ".private.log"), "w") as log:
                        with contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
                            module.test_single(output["text"], timeout=args.timeout)
                    generated = pathlib.Path(temporary) / "test.wav"
                    metadata = inspect_audio(generated)
                    generated.replace(target)
                finally:
                    os.chdir(original_directory)
            manifest["results"][job_id] = {
                "case_id": sample["id"], "output_index": index, "filename": filename,
                "text": output["text"], "model_version": model, "settings": settings,
                "voice_label": "Configured voice A", "signature": signature,
                "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "elapsed_seconds": round(time.monotonic() - started, 3), "audio": metadata,
            }
            temporary_manifest = private / "manifest.tmp.json"
            temporary_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
            temporary_manifest.replace(manifest_path)
            completed += 1
            print("OK", job_id, json.dumps(metadata, ensure_ascii=False), flush=True)
    if not completed:
        parser.error("No matching output was selected")
    print("Generated or reused", completed, "outputs. Original reference recordings are unchanged.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("Generation stopped:", type(error).__name__, "— inspect the local private log; no automatic retries.", file=sys.stderr)
        sys.exit(1)

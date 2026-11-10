import asyncio
import base64
import binascii
import io
import json
import time
import uuid
import wave
from dataclasses import dataclass

import httpx


SAMPLE_RATE = 24000
MAX_AUDIO_BYTES = 8_000_000
MAX_RESPONSE_BYTES = 2_000_000


class ProviderError(Exception):
    pass


@dataclass(frozen=True)
class SynthesisResult:
    audio: bytes
    duration_seconds: float
    total_seconds: float
    first_chunk_seconds: float


async def synthesize(
    *, client: httpx.AsyncClient, api_url: str, api_key: str,
    model_version: str, text: str, voice: dict, speed: float,
) -> SynthesisResult:
    started = time.monotonic()
    request_id = str(uuid.uuid4())
    extensions = {
        "stream": "true",
        "remain_tail_sil": "0",
        "model_version": model_version,
    }
    if voice.get("fid"):
        extensions["fid"] = voice["fid"]
    properties = {
        "platform": "Linux",
        "version": "1.0.0",
        "timestamp": "0",
        "parameters": {
            "aue": "1", "sr": str(SAMPLE_RATE), "vol": "1.0",
            "sp": str(speed), "tt": "0", "tim": voice.get("tim", "40000"),
        },
        "extparameters": extensions,
    }
    headers = {
        "X-API-KEY": api_key,
        "Service-Type": "synthesis",
        "Application-Id": "linux_demo_kefu_nv",
        "Request-Id": request_id,
        "Protocol": "1", "Net-State": "2", "Applicator": "0",
        "Content-Type": "text/plain; charset=utf-8",
        "Property": json.dumps(properties, ensure_ascii=True),
    }
    pcm = bytearray()
    first_chunk_seconds = None
    completed = False
    try:
        async with asyncio.timeout(120):
            for sequence in range(1, 301):
                headers["Sequence-Id"] = str(sequence)
                body = text.encode("utf-8") if sequence == 1 else b""
                async with client.stream("POST", api_url, headers=headers, content=body) as response:
                    response.raise_for_status()
                    raw = bytearray()
                    async for chunk in response.aiter_bytes():
                        raw.extend(chunk)
                        if len(raw) > MAX_RESPONSE_BYTES:
                            raise ProviderError("response_too_large")
                result = json.loads(raw)
                if not isinstance(result, dict) or result.get("status") != 0:
                    raise ProviderError("upstream_rejected")
                encoded_audio = result.get("audio")
                index = result.get("index")
                if not isinstance(encoded_audio, str) or type(index) is not int:
                    raise ProviderError("invalid_response")
                audio_chunk = base64.b64decode(encoded_audio, validate=True)
                if audio_chunk and first_chunk_seconds is None:
                    first_chunk_seconds = time.monotonic() - started
                pcm.extend(audio_chunk)
                if len(pcm) > MAX_AUDIO_BYTES:
                    raise ProviderError("audio_too_large")
                if index < 0 or not audio_chunk:
                    completed = True
                    break
    except ProviderError:
        raise
    except (TimeoutError, httpx.TimeoutException) as error:
        raise ProviderError("timeout") from error
    except (httpx.HTTPError, ValueError, binascii.Error, UnicodeError) as error:
        raise ProviderError("upstream_failed") from error
    if not completed or not pcm or len(pcm) % 2:
        raise ProviderError("incomplete_audio")
    output = io.BytesIO()
    with wave.open(output, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm)
    return SynthesisResult(
        audio=output.getvalue(),
        duration_seconds=len(pcm) / SAMPLE_RATE / 2,
        total_seconds=time.monotonic() - started,
        first_chunk_seconds=first_chunk_seconds or 0,
    )

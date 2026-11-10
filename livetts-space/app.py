import asyncio
import hmac
import json
import os
import re
import time
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field, ValidationError

from provider import ProviderError, SAMPLE_RATE, synthesize


ROOT = Path(__file__).parent


def integer_setting(name: str, default: int, minimum: int, maximum: int) -> int:
    value = int(os.getenv(name, str(default)))
    if not minimum <= value <= maximum:
        raise ValueError(f"{name} is outside its allowed range")
    return value


def load_voices() -> list[dict]:
    try:
        voices = json.loads(os.getenv("LIVETTS_VOICES_JSON", "[]"))
        if not isinstance(voices, list) or len(voices) > 20:
            raise ValueError
        seen = set()
        allowed = {"id", "name", "name_zh", "description", "description_zh", "tim", "fid"}
        for voice in voices:
            if not isinstance(voice, dict) or set(voice) - allowed:
                raise ValueError
            if not all(isinstance(value, str) and len(value) <= 200 for value in voice.values()):
                raise ValueError
            if not re.fullmatch(r"[a-zA-Z0-9_-]{1,40}", voice.get("id", "")):
                raise ValueError
            if voice["id"] in seen or not voice.get("name") or not (voice.get("tim") or voice.get("fid")):
                raise ValueError
            seen.add(voice["id"])
        return voices
    except (ValueError, TypeError):
        raise ValueError("LIVETTS_VOICES_JSON must contain a valid voice allowlist") from None


API_KEY = os.getenv("LIVETTS_API_KEY", "").strip()
API_URL = os.getenv("LIVETTS_API_URL", "https://open-live-api.jd.com/livetts").strip()
MODEL_VERSION = os.getenv("LIVETTS_MODEL_VERSION", "").strip()
VOICES = load_voices()
DEMO_ENABLED = os.getenv("LIVETTS_DEMO_ENABLED", "false").lower() == "true"
DEMO_PASSWORD = os.getenv("LIVETTS_DEMO_PASSWORD", "")
READY = bool(API_KEY and MODEL_VERSION and VOICES and DEMO_ENABLED)
MAX_CHARACTERS = integer_setting("LIVETTS_MAX_CHARACTERS", 500, 50, 2000)
DAILY_LIMIT = integer_setting("LIVETTS_DAILY_LIMIT", 100, 1, 10000)
PER_MINUTE = integer_setting("LIVETTS_PER_MINUTE", 6, 1, 120)
MAX_CONCURRENT = integer_setting("LIVETTS_MAX_CONCURRENT", 2, 1, 10)
CONTACT_URL = os.getenv("LIVETTS_CONTACT_URL", "")
if CONTACT_URL and urlparse(CONTACT_URL).scheme not in ("https", "mailto"):
    raise ValueError("LIVETTS_CONTACT_URL must use https or mailto")
if urlparse(API_URL).scheme != "https" or not urlparse(API_URL).hostname:
    raise ValueError("LIVETTS_API_URL must be an HTTPS endpoint")


class GenerationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    text: str = Field(min_length=1, max_length=2000)
    voice_id: str = Field(min_length=1, max_length=40)
    speed: float = Field(default=1.0, ge=0.75, le=1.25, allow_inf_nan=False)


class UsageGate:
    def __init__(self):
        self.lock = asyncio.Lock()
        self.recent = deque()
        self.day = ""
        self.daily_count = 0
        self.active = 0

    async def enter(self):
        async with self.lock:
            now = time.monotonic()
            day = datetime.now(timezone.utc).date().isoformat()
            if day != self.day:
                self.day, self.daily_count = day, 0
            while self.recent and now - self.recent[0] >= 60:
                self.recent.popleft()
            if self.daily_count >= DAILY_LIMIT:
                return "daily_limit"
            if len(self.recent) >= PER_MINUTE:
                return "rate_limit"
            if self.active >= MAX_CONCURRENT:
                return "busy"
            self.recent.append(now)
            self.daily_count += 1
            self.active += 1
            return None

    async def leave(self):
        async with self.lock:
            self.active -= 1


@asynccontextmanager
async def lifespan(application: FastAPI):
    async with httpx.AsyncClient(timeout=40, follow_redirects=False) as client:
        application.state.client = client
        application.state.gate = UsageGate()
        yield


app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)


@app.middleware("http")
async def response_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self'; style-src 'self'; "
        "img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; "
        "object-src 'none'; base-uri 'none'; form-action 'self'"
    )
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    return response


def failure(code: str, status: int, headers: dict | None = None):
    return JSONResponse({"error": code}, status_code=status, headers=headers)


@app.get("/healthz")
async def health():
    return {"status": "ok", "configured": READY}


@app.get("/api/config")
async def config():
    public_voices = [
        {key: value for key, value in voice.items() if key not in ("tim", "fid")}
        for voice in VOICES
    ]
    return {
        "ready": READY,
        "model": "LiveTTS",
        "version": MODEL_VERSION,
        "voices": public_voices,
        "max_characters": MAX_CHARACTERS,
        "sample_rate": SAMPLE_RATE,
        "password_required": bool(DEMO_PASSWORD),
        "contact_url": CONTACT_URL,
    }


@app.post("/api/generate")
async def generate(request: Request):
    origin = request.headers.get("origin")
    if origin and urlparse(origin).netloc != request.headers.get("host"):
        return failure("origin_rejected", 403)
    if not READY:
        return failure("not_configured", 503)
    if DEMO_PASSWORD and not hmac.compare_digest(
        request.headers.get("x-demo-password", "").encode(), DEMO_PASSWORD.encode()
    ):
        return failure("unauthorized", 401)
    if request.headers.get("content-type", "").split(";")[0].strip() != "application/json":
        return failure("invalid_request", 415)
    raw = bytearray()
    async for chunk in request.stream():
        raw.extend(chunk)
        if len(raw) > 16_000:
            return failure("request_too_large", 413)
    try:
        payload = GenerationRequest.model_validate_json(raw)
    except ValidationError:
        return failure("invalid_request", 422)
    text = payload.text.strip()
    if not text or len(text) > MAX_CHARACTERS:
        return failure("invalid_text", 422)
    voice = next((voice for voice in VOICES if voice["id"] == payload.voice_id), None)
    if voice is None:
        return failure("invalid_voice", 422)
    reason = await request.app.state.gate.enter()
    if reason:
        return failure(reason, 429, {"Retry-After": "60" if reason != "daily_limit" else "3600"})
    try:
        result = await synthesize(
            client=request.app.state.client, api_url=API_URL, api_key=API_KEY,
            model_version=MODEL_VERSION, text=text, voice=voice, speed=payload.speed,
        )
        return Response(result.audio, media_type="audio/wav", headers={
            "Content-Disposition": 'attachment; filename="livetts.wav"',
            "X-Audio-Duration": f"{result.duration_seconds:.3f}",
            "X-Generation-Seconds": f"{result.total_seconds:.3f}",
            "X-Upstream-First-Chunk-Seconds": f"{result.first_chunk_seconds:.3f}",
        })
    except ProviderError as error:
        code = "timeout" if str(error) == "timeout" else "upstream_failed"
        return failure(code, 504 if code == "timeout" else 502)
    finally:
        await request.app.state.gate.leave()


@app.get("/")
async def index():
    return FileResponse(ROOT / "static" / "index.html", headers={"Cache-Control": "no-cache"})


app.mount("/static", StaticFiles(directory=ROOT / "static"), name="static")

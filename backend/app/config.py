"""Central application settings, loaded once from the environment / .env."""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

APP_DIR = Path(__file__).resolve().parent

ENV = os.getenv("ENV", "production")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

# Upstream order book feed
WS_ENDPOINT = os.getenv("WS_ENDPOINT", "")
# Reconnect when the feed sends nothing for this long (it ticks ~10x/second)
FEED_STALE_S = float(os.getenv("FEED_STALE_S", "10"))

# MongoDB
MONGO_URL = os.getenv("MONGO_URL", "")
MONGO_DB = os.getenv("MONGO_DB", "sim_trades")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "trades")

# Gemini (GOOGLE_API_kEY kept for backwards compatibility with old .env files)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_API_kEY")
# Models tried in order; a model that is overloaded falls through to the next.
# GEMINI_MODEL (single model, older setting) is still honoured as the first choice.
_DEFAULT_MODELS = "gemini-3.8-flash,gemini-3.5-flash,gemini-3.5-flash-lite"
GEMINI_MODELS = list(dict.fromkeys(
    m.strip()
    for m in [os.getenv("GEMINI_MODEL", ""), *os.getenv("GEMINI_MODELS", _DEFAULT_MODELS).split(",")]
    if m.strip()
))
# Per-model time limit before failing over; the last model in the chain gets longer
GEMINI_ATTEMPT_TIMEOUT_S = float(os.getenv("GEMINI_ATTEMPT_TIMEOUT_S", "8"))
GEMINI_LAST_TIMEOUT_S = float(os.getenv("GEMINI_LAST_TIMEOUT_S", "30"))
# How long to skip a model after it reports it is overloaded
GEMINI_COOLDOWN_S = float(os.getenv("GEMINI_COOLDOWN_S", "60"))

# Firebase Admin credentials (Render mounts secret files under /etc/secrets)
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH") or (
    "/etc/secrets/firebase-adminsdk.json"
    if os.getenv("IS_RENDER") == "true"
    else str(APP_DIR / "firebase-adminsdk.json")
)

# Prediction model
MODEL_PATH = os.getenv(
    "MODEL_PATH", str(APP_DIR / "regression_models" / "mid_price_60.pkl")
)

# CORS
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS",
        "https://tradesim-shubhabha.vercel.app,http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
]
# Allow Vercel preview deployments of this project
CORS_ORIGIN_REGEX = os.getenv(
    "CORS_ORIGIN_REGEX", r"https://tradesim-[a-z0-9-]+\.vercel\.app"
)

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


def _flag(name: str, default: str) -> bool:
    return os.getenv(name, default).strip().lower() in ("1", "true", "yes", "on")


# Request logging: incoming HTTP/WebSocket, and outgoing calls (Mongo, Gemini, HTTP)
LOG_REQUESTS = _flag("LOG_REQUESTS", "true")
LOG_OUTGOING = _flag("LOG_OUTGOING", "true")
# Render polls /health every few seconds; keep those out of the logs by default
LOG_HEALTH_CHECKS = _flag("LOG_HEALTH_CHECKS", "false")
# Requests slower than this are logged at WARNING
SLOW_REQUEST_MS = float(os.getenv("SLOW_REQUEST_MS", "1000"))
# Interval for upstream feed throughput summaries (0 disables)
FEED_STATS_INTERVAL_S = float(os.getenv("FEED_STATS_INTERVAL_S", "60"))

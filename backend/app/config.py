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

# MongoDB
MONGO_URL = os.getenv("MONGO_URL", "")
MONGO_DB = os.getenv("MONGO_DB", "sim_trades")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "trades")

# Gemini (GOOGLE_API_kEY kept for backwards compatibility with old .env files)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_API_kEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

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

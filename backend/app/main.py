"main.py"

import asyncio
import logging
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import CORS_ORIGIN_REGEX, CORS_ORIGINS, LOG_LEVEL, MODEL_PATH
from app.db import client as mongo_client, trade_repository
from app.okx_client import OKXClient
from app.router.routes import router as app_router
from app.services.orderbook_manager import hub
from app.services.prediction_model import MidPriceModel
from app.utils.firebase_auth import init_firebase

logging.basicConfig(level=LOG_LEVEL, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("tradesim")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_firebase()
    hub.model = MidPriceModel(MODEL_PATH)
    feed = asyncio.create_task(hub.run(OKXClient()))

    try:
        await mongo_client.admin.command("ping")
        await trade_repository.init_indexes()
        logger.info("Connected to MongoDB")
    except Exception as e:
        # Keep serving live data even if the database is unreachable
        logger.error("MongoDB connection error: %s", e)

    yield

    feed.cancel()
    with suppress(asyncio.CancelledError):
        await feed
    await mongo_client.close()


app = FastAPI(title="TradeSim API", lifespan=lifespan)

app.add_middleware(GZipMiddleware, minimum_size=1024)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX or None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(app_router)

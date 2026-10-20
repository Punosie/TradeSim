from pymongo import AsyncMongoClient
from pymongo.server_api import ServerApi

from app.config import MONGO_COLLECTION, MONGO_DB, MONGO_URL

from .trade_repository import TradeRepository

# The client connects lazily, so creating it at import time does no I/O.
client: AsyncMongoClient = AsyncMongoClient(MONGO_URL, server_api=ServerApi("1"))

trade_repository = TradeRepository(client[MONGO_DB][MONGO_COLLECTION])

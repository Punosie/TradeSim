import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()
URL = os.getenv("MONGO_URL")

client = MongoClient(URL, server_api=ServerApi("1"))

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB!")
except Exception as e:
    print("❌ MongoDB connection error:", e)

from .schema import TradeRepository

trade_repository = TradeRepository(client["sim_trades"]["trades"])

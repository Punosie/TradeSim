import csv
import io

from pymongo import IndexModel
from pymongo.asynchronous.collection import AsyncCollection

from app.schemas import TradeOutput


class TradeRepository:
    def __init__(self, collection: AsyncCollection):
        self.collection = collection

    async def save_trade(self, trade_output: TradeOutput):
        """Save a trade output to the MongoDB collection."""
        await self.collection.insert_one(trade_output.model_dump())

    async def init_indexes(self):
        """Ensure the index used by per-user history queries exists."""
        await self.collection.create_indexes(
            [IndexModel([("user_id", 1), ("timestamp", -1)])]
        )

    async def get_trades_by_user(self, user_id: str, limit: int = 0) -> list[dict]:
        """Retrieve trades for a user, newest first (limit=0 means all)."""
        cursor = (
            self.collection.find({"user_id": user_id}, {"_id": 0})
            .sort("timestamp", -1)
            .limit(limit)
        )
        return await cursor.to_list()

    async def get_trades_csv_by_user(self, user_id: str) -> str:
        """Retrieve all trades for a user as a CSV string ('' when there are none)."""
        trades = await self.get_trades_by_user(user_id)
        if not trades:
            return ""

        output = io.StringIO()
        output.write("﻿")  # BOM so Excel detects UTF-8
        writer = csv.DictWriter(output, fieldnames=list(TradeOutput.model_fields), extrasaction="ignore")
        writer.writeheader()
        writer.writerows(trades)
        return output.getvalue()

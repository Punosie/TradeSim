from app.schemas import TradeOutput
from pymongo.collection import Collection
from pymongo import IndexModel
import csv
import io


class TradeRepository:
    def __init__(self, collection: Collection):
        self.collection = collection

    def save_trade(self, trade_output: TradeOutput):
        """ Save a trade output to the MongoDB collection. """
        self.collection.insert_one(trade_output.model_dump())

    def init_indexes(self):
        """
        Ensure indexes on user_id and timestamp for performance.
        """
        indexes = [
            IndexModel([("user_id", 1)]),
            IndexModel([("timestamp", -1)])
        ]
        self.collection.create_indexes(indexes)

    def get_trades_by_user(self, user_id: str, limit: int = 50):
        """ Retrieve trades for a specific user, sorted by timestamp. """
        cursor = self.collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
        return list(cursor)

    def get_trades_csv_by_user(self, user_id: str) -> str:
        """ Retrieve all trades for a specific user and return as CSV string. """
        cursor = self.collection.find({"user_id": user_id}).sort("timestamp", -1)
        trades = list(cursor)

        if not trades:
            return ""
        
        for trade in trades:
            trade.pop("_id", None)

        # Convert MongoDB documents to CSV
        output = io.StringIO()
        output.write('\ufeff')
        writer = csv.DictWriter(output, fieldnames=trades[0].keys())
        writer.writeheader()
        writer.writerows(trades)

        return output.getvalue()

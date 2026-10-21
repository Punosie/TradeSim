import asyncio
import logging
from contextlib import contextmanager
from typing import Literal

import orjson

from app.okx_client import OKXClient
from app.services.prediction_model import MidPriceModel

logger = logging.getLogger(__name__)

Channel = Literal["orderbook", "prediction"]


class OrderbookHub:
    """Keeps a single upstream connection and fans each tick out to clients.

    The latest snapshot is kept for trade simulation; every WebSocket client
    gets its own small queue (oldest message dropped when it falls behind),
    and the mid-price prediction is computed once per tick, not per client.
    """

    QUEUE_SIZE = 4
    MAX_BACKOFF = 30

    def __init__(self, model: MidPriceModel | None = None):
        self.snapshot: dict = {}
        self.model = model
        self._subscribers: dict[Channel, set[asyncio.Queue[str]]] = {
            "orderbook": set(),
            "prediction": set(),
        }

    async def run(self, client: OKXClient):
        """Consume the upstream feed forever, reconnecting with backoff."""
        backoff = 1
        while True:
            try:
                async for message in client.subscribe():
                    backoff = 1
                    self._on_message(message)
            except asyncio.CancelledError:
                raise
            except Exception as e:
                logger.warning("Upstream feed error: %s; retrying in %ss", e, backoff)
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, self.MAX_BACKOFF)

    def _on_message(self, message: dict):
        bids, asks = message.get("bids"), message.get("asks")
        if not bids or not asks:
            return
        self.snapshot = message

        if self._subscribers["orderbook"]:
            self._publish("orderbook", orjson.dumps(message).decode())

        if self.model and self._subscribers["prediction"]:
            try:
                prediction = self.model.predict(bids, asks)
            except Exception:
                logger.exception("Prediction failed")
                return
            self._publish("prediction", orjson.dumps({"prediction": prediction}).decode())

    def _publish(self, channel: Channel, payload: str):
        for queue in self._subscribers[channel]:
            if queue.full():
                queue.get_nowait()
            queue.put_nowait(payload)

    @contextmanager
    def subscribe(self, channel: Channel):
        """Register a client queue for the given channel for the duration of the block."""
        queue: asyncio.Queue[str] = asyncio.Queue(maxsize=self.QUEUE_SIZE)
        self._subscribers[channel].add(queue)
        try:
            yield queue
        finally:
            self._subscribers[channel].discard(queue)

    @property
    def ready(self) -> bool:
        return bool(self.snapshot)

    def get_asks(self) -> list:
        return self.snapshot.get("asks", [])

    def get_bids(self) -> list:
        return self.snapshot.get("bids", [])

    def get_symbol(self) -> str:
        return self.snapshot.get("symbol", "")

    def get_timestamp(self) -> str:
        return self.snapshot.get("timestamp", "")

    def get_exchange(self) -> str:
        return self.snapshot.get("exchange", "OKX")

    def get_order_type(self) -> str:
        return self.snapshot.get("order_type", "market")


hub = OrderbookHub()

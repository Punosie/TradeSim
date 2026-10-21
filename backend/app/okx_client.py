import logging

import orjson
import websockets

from app.config import WS_ENDPOINT

logger = logging.getLogger(__name__)


class OKXClient:
    """Client for the upstream order book WebSocket feed.

    Holds no per-connection state, so it is safe to reuse; keepalive pings are
    handled by the websockets library.
    """

    def __init__(self, url: str = WS_ENDPOINT, ping_interval: float = 20):
        if not url:
            raise RuntimeError("WS_ENDPOINT is not configured")
        self.url = url
        self.ping_interval = ping_interval

    async def subscribe(self):
        """Connect to the feed and yield each decoded message."""
        async with websockets.connect(
            self.url, ping_interval=self.ping_interval, max_size=None
        ) as websocket:
            logger.info("Connected to upstream order book feed")
            async for message in websocket:
                yield orjson.loads(message)

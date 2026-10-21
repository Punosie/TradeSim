import asyncio
import logging
import time
from urllib.parse import urlsplit

import orjson
import websockets

from app.config import FEED_STALE_S, WS_ENDPOINT

logger = logging.getLogger(__name__)


class StaleFeedError(Exception):
    """No message arrived within the staleness window."""


class OKXClient:
    """Client for the upstream order book WebSocket feed.

    Holds no per-connection state, so it is safe to reuse.

    The upstream server never answers WebSocket pings, so pings are still sent
    (they keep proxies/NATs from dropping an idle connection) but no pong is
    required; liveness is judged by data instead: if no message arrives within
    `stale_after` seconds the connection is treated as dead.
    """

    def __init__(self, url: str = WS_ENDPOINT, ping_interval: float = 20, stale_after: float = FEED_STALE_S):
        if not url:
            raise RuntimeError("WS_ENDPOINT is not configured")
        self.url = url
        self.ping_interval = ping_interval
        self.stale_after = stale_after

    async def subscribe(self):
        """Connect to the feed and yield each decoded message."""
        target = urlsplit(self.url)
        start = time.perf_counter()
        async with websockets.connect(
            self.url, ping_interval=self.ping_interval, ping_timeout=None, max_size=None
        ) as websocket:
            logger.info(
                "Connected to upstream feed %s%s in %.0fms",
                target.netloc, target.path, (time.perf_counter() - start) * 1000,
            )
            while True:
                try:
                    message = await asyncio.wait_for(websocket.recv(), self.stale_after)
                except TimeoutError:
                    raise StaleFeedError(f"no data for {self.stale_after:.0f}s") from None
                yield orjson.loads(message)

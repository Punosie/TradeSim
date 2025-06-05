import os
import asyncio
import websockets
import orjson


class OKXClient:
    """Client for connecting to the OKX WebSocket API."""

    "class variables"
    WS_URL = os.getenv("WS_ENDPOINT")
    DATA_PATH = "./dataSample/sample.json"
    PING_INTERVAL = 20  # seconds

    def __init__(self):
        os.makedirs(os.path.dirname(self.DATA_PATH), exist_ok=True)
        self.websocket = None
        self.ping_task = None
        self.connected = False

    async def start_ping(self):
        """Continuously sends ping messages to keep the WebSocket alive."""
        try:
            while self.connected:
                await self.websocket.ping()
                await asyncio.sleep(self.PING_INTERVAL)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"[Ping Error] {e}")
            self.connected = False

    async def subscribe(self):
        """Connects to the WebSocket and yields incoming messages."""
        async with websockets.connect(self.WS_URL, ping_interval=None) as websocket:
            self.websocket = websocket
            self.connected = True
            self.ping_task = asyncio.create_task(self.start_ping())

            try:
                async for message in websocket:
                    data = orjson.loads(message)
                    yield data
            finally:
                self.ping_task.cancel()
                try:
                    await self.ping_task
                except asyncio.CancelledError:
                    pass
                self.connected = False

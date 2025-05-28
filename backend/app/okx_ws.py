import os
import asyncio
import websockets
import orjson
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
WS_URL = os.getenv("WS_ENDPOINT")
DATA_PATH = "./dataSample/sample.json"
PING_INTERVAL = 20  # seconds

# Ensure the data directory exists
os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

async def start_ping(websocket):
    """Continuously sends ping messages to keep the WebSocket alive."""
    try:
        while True:
            await websocket.ping()
            await asyncio.sleep(PING_INTERVAL)
    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"[Ping Error] {e}")


async def sub_to_orderbook():
    """Connects to the WebSocket and yields incoming messages."""
    async with websockets.connect(WS_URL, ping_interval=None) as websocket:
        # Start background ping task
        ping_task = asyncio.create_task(start_ping(websocket))

        try:
            async for message in websocket:
                data = orjson.loads(message)
                yield data
        finally:
            ping_task.cancel()

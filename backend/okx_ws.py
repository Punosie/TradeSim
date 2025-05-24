import os
import websockets
import asyncio
import json
from dotenv import load_dotenv

load_dotenv()

WS_URL = os.getenv("WS_ENDPOINT")
PATH = "dataSample/sample.json"
os.makedirs(os.path.dirname(PATH), exist_ok=True)

async def sub_to_orderbook():
    async with websockets.connect(WS_URL) as websocket:
        async for message in websocket:
            data = json.loads(message)
            yield data

# if __name__ == "__main__":
#     asyncio.run(sub_to_orderbook())
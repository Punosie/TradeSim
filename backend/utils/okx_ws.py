import asyncio
import websockets
import json
import os
from dotenv import load_dotenv
load_dotenv()

SAVE_PATH = "data_samples"
SAMPLE_FILE = "btc_usdt_snap.json"
os.makedirs(SAVE_PATH, exist_ok=True)
URL = os.getenv("OKX_WS_URL")
if not URL:
    raise ValueError("OKX_WS_URL environment variable is not set.")

async def collect_and_save_okx_data():
    url = URL
    async with websockets.connect(url) as ws:
        print("Connected to OKX WebSocket")
        
        # Subscribe message
        sub_msg = {
            "op": "subscribe",
            "args": [
                {
                    "channel": "books5",
                    "instId": "BTC-USDT-SWAP"
                }
            ]
        }
        await ws.send(json.dumps(sub_msg))
        print("Subscribed to BTC-USDT-SWAP orderbook...")

        samples = []
        while len(samples) < 10:
            msg = await ws.recv()
            msg_json = json.loads(msg)

            # Only save actual orderbook updates
            if "data" in msg_json and "bids" in msg_json["data"][0]:
                samples.append(msg_json)

        # Save to file
        with open(os.path.join(SAVE_PATH, SAMPLE_FILE), "w") as f:
            json.dump(samples, f, indent=2)

        print(f"\n✅ Saved {len(samples)} messages to {SAVE_PATH}/{SAMPLE_FILE}")

asyncio.run(collect_and_save_okx_data())

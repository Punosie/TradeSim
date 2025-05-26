import websockets
import asyncio
import os
from dotenv import load_dotenv
import orjson

load_dotenv()

WS_URL = os.getenv('WS_ENDPOINT')
PATH = "./training_data.json"
os.makedirs(os.path.dirname(PATH), exist_ok=True)

async def generate_data(WS_URL):
    try:
        async with websockets.connect(WS_URL) as websocket:
            print(f"Connected to {WS_URL}")
            while True:
                try:
                    # Wait for messages and process them
                    message = await websocket.recv()
                    data = orjson.loads(message)
                    with open(PATH, 'a') as f:
                        f.write(orjson.dumps(data).decode('utf-8') + '\n')
                
                except websockets.exceptions.ConnectionClosedError as e:
                    print(f"Connection closed with error: {e}")
                    break  # If connection is closed, break out of loop and attempt reconnect

                except Exception as e:
                    print(f"Error while processing message: {e}")
                    continue  # Continue processing if there's a minor error

    except Exception as e:
        print(f"Failed to connect or an error occurred: {e}")
        await asyncio.sleep(5)  # Wait before retrying

async def keep_alive(websocket):
    # This sends a ping every 30 seconds to keep the connection alive.
    while True:
        await asyncio.sleep(30)  # Set interval to your desired keep-alive frequency
        try:
            await websocket.ping()  # Send a ping
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed during ping. Attempting to reconnect.")
            break  # Exit keep-alive loop if connection is closed

async def reconnect():
    while True:
        try:
            await generate_data(WS_URL)
        except Exception as e:
            print(f"Reconnection failed with error: {e}. Retrying in 5 seconds.")
            await asyncio.sleep(5)

if __name__ == "__main__":
    # Start the WebSocket connection and keep the connection open forever
    asyncio.run(reconnect())
    print(f"Data saved to {PATH}")
    print("Exiting...")

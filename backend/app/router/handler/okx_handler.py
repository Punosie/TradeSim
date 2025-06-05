from fastapi import WebSocket, WebSocketDisconnect
from app.okx_client import OKXClient

class OKXWebSocketHandler:
    def __init__(self, client: OKXClient):
        self.client = client

    async def stream_orderbook(self, websocket: WebSocket):
        """Handle WebSocket connections for streaming order book data from OKX."""
        await websocket.accept()
        print("WebSocket connection established")
        try:
            async for message in self.client.subscribe():
                await websocket.send_json(message)
        except WebSocketDisconnect:
            print("WebSocket connection closed by client")
        except Exception as e:
            print(f"WebSocket error: {e}")
        finally:
            print("WebSocket connection cleanup")
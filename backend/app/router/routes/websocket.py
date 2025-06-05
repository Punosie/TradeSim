from fastapi import APIRouter, WebSocket
from app.okx_client import OKXClient
from ..handler.okx_handler import OKXWebSocketHandler

router = APIRouter()

# Instantiate your client and handler (can be replaced with DI if you want)
okx_client = OKXClient()
handler = OKXWebSocketHandler(okx_client)

@router.websocket("/ws/okx")
async def orderbook_ws(websocket: WebSocket):
    await handler.stream_orderbook(websocket)

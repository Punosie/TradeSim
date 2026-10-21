from fastapi import APIRouter, WebSocket

from app.services.orderbook_manager import hub
from ..handler.stream_handler import stream_channel

router = APIRouter()


@router.websocket("/ws/okx")
async def orderbook_ws(websocket: WebSocket):
    """Live order book snapshots."""
    await stream_channel(websocket, hub, "orderbook")

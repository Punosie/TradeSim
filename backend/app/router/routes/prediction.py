from fastapi import APIRouter, WebSocket

from app.services.orderbook_manager import hub
from ..handler.stream_handler import stream_channel

router = APIRouter()


@router.websocket("/ws/prediction")
async def midpoint_pred_ws(websocket: WebSocket):
    """Live 60-second mid-price predictions, sent as {"prediction": [price]}."""
    await stream_channel(websocket, hub, "prediction")

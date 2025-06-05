import os
from fastapi import APIRouter, WebSocket
from ..handler.prediction_handler import PredictionHandler

router = APIRouter()

handler = PredictionHandler("app/regression_models/mid_price_60.pkl")

@router.websocket("/ws/prediction")
async def midpoint_pred_ws(websocket: WebSocket):
    await handler.handle_websocket(websocket)

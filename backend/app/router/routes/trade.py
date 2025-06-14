from fastapi import APIRouter, Depends
from app.schemas import TradeInput
from ..handler.trade_handler import TradeHandler
from app.dependencies.auth import get_current_user

router = APIRouter()
handler = TradeHandler()


@router.post("/simulate/trade")
async def simulate_trade(trade_input: TradeInput, _user=Depends(get_current_user)):
    return await handler.simulate_trade(trade_input, _user["uid"])
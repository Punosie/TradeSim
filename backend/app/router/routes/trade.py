from fastapi import APIRouter
from app.schemas import TradeInput
from ..handler.trade_handler import TradeHandler

router = APIRouter()
handler = TradeHandler()


@router.post("/simulate/trade")
def simulate_trade(trade_input: TradeInput):
    return handler.simulate_trade(trade_input)
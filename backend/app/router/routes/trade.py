from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response

from app.dependencies.auth import get_current_user
from app.schemas import TradeInput, TradeOutput
from app.services.orderbook_manager import hub
from ..handler.trade_handler import TradeHandler

router = APIRouter()
handler = TradeHandler(hub)


@router.post("/simulate/trade", response_model=TradeOutput)
async def simulate_trade(trade_input: TradeInput, _user=Depends(get_current_user)):
    return await handler.simulate_trade(trade_input, _user["uid"])


@router.get("/trade-history")
async def get_trade_history(_user=Depends(get_current_user)):
    """
    Retrieve the trade history for the current user as a CSV download.
    """
    csv_data = await handler.get_trade_history_csv(_user["uid"])
    if not csv_data:
        raise HTTPException(status_code=404, detail="No trades yet.")

    return Response(
        content=csv_data,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename=trade_history.csv"},
    )

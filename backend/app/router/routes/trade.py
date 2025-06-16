from fastapi import APIRouter, Depends
from app.schemas import TradeInput
from ..handler.trade_handler import TradeHandler
from app.dependencies.auth import get_current_user
from fastapi.responses import StreamingResponse, JSONResponse
import io

router = APIRouter()
handler = TradeHandler()


@router.post("/simulate/trade")
async def simulate_trade(trade_input: TradeInput, _user=Depends(get_current_user)):
    return await handler.simulate_trade(trade_input, _user["uid"])


@router.get("/trade-history")
def get_trade_history(_user=Depends(get_current_user)):
    """
    Retrieve the trade history for the current user.
    """
    csv_data = handler.get_trade_history_csv(_user["uid"])
    if not csv_data:
        return JSONResponse(content={"message": "No trades yet."}, status_code=404)

    return StreamingResponse(
        io.StringIO(csv_data),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=trade_history.csv"},
    )

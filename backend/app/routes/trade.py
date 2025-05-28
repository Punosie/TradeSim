import os
import orjson
from app.schemas import Trade_input
from app.services.simulate import simulate_buy_order
from app.config import TRADE_LOG_PATH
from fastapi import HTTPException, APIRouter
from app.services.orderbook import get_latest_orderbook

PATH = TRADE_LOG_PATH

router = APIRouter()


@router.post("/simulate/trade")
# http://127.0.0.1:8000/simulate/trade
async def simulate_trade(trade_input: Trade_input):
    """
    Simulate a trade based on the input data.
    """
    latest_orderbook = get_latest_orderbook()

    if latest_orderbook is None:
        return {"error": "Orderbook not available. Please wait for the WebSocket connection to establish."}

    if trade_input.order_type != "market":
        return {"error": "Only market orders are supported in this simulation."}

    if trade_input.asset not in latest_orderbook.get("symbol", ""):
        return {"error": f"Orderbook does not contain asset {trade_input.asset}"}

    asks = latest_orderbook.get("asks", [])
    if trade_input.qty_usd <= 0:
        # status code 400
        raise HTTPException(
            status_code=400, detail="Quantity in USD must be greater than 0.")

    result = simulate_buy_order(asks, trade_input.qty_usd)

    trade_log = {
        "timestamp": latest_orderbook.get("timestamp", ""),
        "exchange": trade_input.exchange,
        "asset": trade_input.asset,
        "order_type": trade_input.order_type,
        "qty_usd": trade_input.qty_usd,
        "filled_qty": result.get("filled_qty", 0),
        "fee_usd": result.get("fee_usd", 0),
        "slippage": result.get("slippage_percent", 5.0),
        "average_price": result.get("average_price", 0),
        "total_spent": result.get("total_spent", 0),
        "latency": result.get("latency", "N/A"),
        "status": "success" if result.get("filled_qty", 0) > 0 else "failed"
    }

    # Save trade to a file (append mode)
    os.makedirs(os.path.dirname(PATH), exist_ok=True)
    with open(PATH, "a") as f:
        f.write(orjson.dumps(trade_log).decode() + "\n")

    return trade_log

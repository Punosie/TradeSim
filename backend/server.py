import os
import uvicorn
import orjson
from schemas import Trade_input
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, HTTPException
from okx_ws import sub_to_orderbook
import asyncio
import time
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))
PATH = "./trades/trade_log.json"

latest_orderbook = None


async def orderbook_updater():
    global latest_orderbook
    async for message in sub_to_orderbook():
        latest_orderbook = message


def simulate_buy_order(asks, qty_usd):
    """
    Simulate a buy order.
    """
    start = time.perf_counter()
    print(start)
    remaining_usd = qty_usd
    total_qty = 0
    total_spent = 0

    if latest_orderbook is None:
        return {"error": "Orderbook not available."}

    for price, qty in asks:
        price = float(price)
        qty = float(qty)
        level_cost = price * qty

        if level_cost < remaining_usd:
            # Buy the full quantity at this level
            total_qty += qty
            total_spent += level_cost
            remaining_usd -= level_cost
        else:
            # Buy as much as possible at this level
            qty_to_buy = remaining_usd / price
            total_qty += qty_to_buy
            total_spent += remaining_usd
            remaining_usd = 0
            break

    average_price = total_spent / total_qty if total_qty > 0 else 0

    # deduct fees
    fee_usd = fee_charge(total_spent)
    fee_btc = fee_usd / average_price
    net_qty = total_qty - fee_btc

    # calculate slippage
    slippage_percent = calculate_slippage(asks, average_price)

    end = time.perf_counter()
    print(end)
    latency = round((end - start) * 1000, 2)
    return {
        "filled_qty": round(net_qty, 8),  # Crypto received after fees
        "average_price": average_price,
        "total_spent": total_spent,
        "slippage_percent": round(slippage_percent, 2),
        "fee_usd": round(fee_usd, 4),
        "latency": str(latency) + "ms"
    }


def fee_charge(amount):
    """
    Calculate the fee charged on a given amount.
    """
    tiers = [
        (1, 100_000, 0.1),
        (100_000, 500_000, 0.05),
        (500_000, 2_000_000, 0.045),
        (2_000_000, 5_000_000, 0.04),
        (5_000_000, 10_000_000, 0.03),
    ]

    for lower, upper, taker_fee in tiers:
        if lower < amount <= upper:
            return (taker_fee / 100) * amount

    # Default fee for amounts above 10 million
    return (0.025 / 100) * amount


def calculate_slippage(asks, average_price):
    """
    Calculate slippage percentage for a market buy order.
    Slippage = ((average execution price - best ask price) / best ask price) * 100

    Args:
      asks (list): List of orderbook asks (price, qty).
      average_price (float): The weighted average price paid.

    Returns:
      float: Slippage percent (positive means you paid more than expected).
    """
    if not asks or average_price == 0:
        return 0.0

    best_ask = float(asks[0][0])  # Best ask price at top of orderbook
    slippage = ((average_price - best_ask) / best_ask) * 100
    return slippage


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs on startup
    task = asyncio.create_task(orderbook_updater())
    yield
    # This runs on shutdown (cancel background task)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app.router.lifespan_context = lifespan


@app.get("/")
async def home():
    return {"message": "Welcome to the TradeSim server!"}


@app.websocket("/ws/okx")
# ws://127.0.0.1:8000/ws/okx
async def orderbook_ws(websockt: WebSocket):
    await websockt.accept()
    await websockt.send_text("WebSocket connection established. Subscribing to orderbook...")

    async for message in sub_to_orderbook():
        await websockt.send_json(message)


@app.post("/simulate/trade")
# http://127.0.0.1:8000/simulate/trade
async def simulate_trade(trade_input: Trade_input):
    """
    Simulate a trade based on the input data.
    """
    global latest_orderbook

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

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)

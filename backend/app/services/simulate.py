import time
from app.utils.fees import fee_charge
from app.utils.slippage import calculate_slippage
from app.services.orderbook import get_latest_orderbook

def simulate_buy_order(asks, qty_usd):
    """
    Simulate a buy order.
    """
    latest_orderbook = get_latest_orderbook()
    if latest_orderbook is None:
        return {"error": "Orderbook not available."}
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
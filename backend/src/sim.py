import json
import os
from collections import deque
from utils.orderbook_tools import get_best_bid_ask, simulate_market_buy
from utils.latency_fee import apply_fee, simulate_latency

def load_orderbook_sample(path="../data_samples/btc_usdt_snap.json"):
    if not os.path.exists(path):
        print(f"❌ File not found: {path}")
        return None
    try:
        with open(path, "r") as f:
            samples = json.load(f)
        return samples
    except json.JSONDecodeError:
        print(f"❌ Failed to parse JSON from: {path}")
        return None

def run_simulation(amount_to_spend=50000):
    orderbooks = load_orderbook_sample()
    if orderbooks is None:
        print("⚠️ Simulation aborted due to missing or invalid orderbook data.")
        return []
    
    orderbook_buffer = deque(maxlen=10)
    for ob in orderbooks:
        orderbook_buffer.append(ob)

    # amount_to_spend = 1000 # Simulate market buy of 1000 USDT

    results = []
    for i, ob in enumerate(orderbook_buffer):
        if i >= 3:
            break
        
        latency = simulate_latency()
        avg_price, slippage = simulate_market_buy(ob, amount_to_spend)
        final_price = apply_fee(avg_price)
        best_bid, best_ask = get_best_bid_ask(ob)

        results.append({
            "snapshot": i + 1,
            "best_bid": best_bid,
            "best_ask": best_ask,
            "latency": latency,
            "avg_price": round(avg_price, 2),
            "slippage": round(slippage, 3),
            "final_price": round(final_price, 2)
        })

    return results

    
    # for i, ob in enumerate(orderbook_buffer):  # limit for brevity
    #     if i >= 3:
    #         break        
    #     print(f"\n🧾 Snapshot {i+1}")
    #     latency = simulate_latency()
    #     avg_price, slippage = simulate_market_buy(ob, amount_to_spend)
    #     final_price = apply_fee(avg_price)

    #     best_bid, best_ask = get_best_bid_ask(ob)
    #     print(f"📈 Best Ask: {best_ask}, Best Bid: {best_bid}")
    #     print(f"⏱️ Latency: {latency} ms")
    #     print(f"💰 Average Fill Price: {avg_price:.2f}")
    #     print(f"📉 Slippage: {slippage:.3f}%")
    #     print(f"💸 Final Price after Fee: {final_price:.2f}")
        
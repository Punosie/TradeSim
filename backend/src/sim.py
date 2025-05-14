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

def run_simulation():
    orderbooks = load_orderbook_sample()
    if orderbooks is None:
        print("⚠️ Simulation aborted due to missing or invalid orderbook data.")
        return
    
    orderbook_buffer = deque(maxlen=10)
    for ob in orderbooks:
        orderbook_buffer.append(ob)


    amount_to_spend = 1000  # Simulate market buy of 1000 USDT

    for i, ob in enumerate(orderbook_buffer):  # limit for brevity
        if i >= 3:
            break        
        print(f"\n🧾 Snapshot {i+1}")
        latency = simulate_latency()
        avg_price, slippage = simulate_market_buy(ob, amount_to_spend)
        final_price = apply_fee(avg_price)

        best_bid, best_ask = get_best_bid_ask(ob)
        print(f"📈 Best Ask: {best_ask}, Best Bid: {best_bid}")
        print(f"⏱️ Latency: {latency} ms")
        print(f"💰 Average Fill Price: {avg_price:.2f}")
        print(f"📉 Slippage: {slippage:.3f}%")
        print(f"💸 Final Price after Fee: {final_price:.2f}")
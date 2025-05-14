import random
import time

def apply_fee(price, fee_rate=0.001):
    """
    Applies trading fee on the price.
    """
    return price * (1 + fee_rate)

def simulate_latency(min_ms=50, max_ms=300):
    """
    Simulates network/execution latency in milliseconds.
    """
    latency = random.randint(min_ms, max_ms)
    time.sleep(latency / 1000.0)
    return latency


def get_best_bid_ask(orderbook):
    """
    Extracts the best bid and ask from an orderbook snapshot.
    """
    bids = orderbook["data"][0]["bids"]
    asks = orderbook["data"][0]["asks"]
    best_bid = float(bids[0][0]) if bids else None
    best_ask = float(asks[0][0]) if asks else None
    return best_bid, best_ask

def simulate_market_buy(orderbook, amount):
    """
    Simulates a market buy order of 'amount' (in USDT) using the orderbook's asks.
    Returns the average fill price and slippage.
    """
    asks = [(float(price), float(size)) for price, size, *_ in orderbook["data"][0]["asks"]]
    cost = 0
    filled = 0
    initial_price = asks[0][0] if asks else 0

    for price, size, *_ in orderbook["data"][0]["asks"][:5]:
        print(f"Ask Level: {price}, Size: {size}")
    
    used_levels = 0
    for price, size in asks:
        trade_value = price * size
        if cost + trade_value >= amount:
            remaining = amount - cost
            qty = remaining / price
            filled += qty
            cost += qty * price
            used_levels += 1
            break
        else:
            filled += size
            cost += trade_value
            used_levels += 1

    avg_price = cost / filled if filled > 0 else 0
    slippage = ((avg_price - initial_price) / initial_price) * 100 if initial_price else 0

    print(f"[DEBUG] Used {used_levels} ask levels | Initial price: {initial_price} | Avg price: {avg_price:.2f} | Slippage: {slippage:.6f}%")

    return avg_price, slippage

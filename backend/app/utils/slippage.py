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
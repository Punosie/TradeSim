import time
from app.utils.calculator import FeeCalculator, SlippageCalculator
from app.services.orderbook_manager import shared_orderbook

class SimulateMarketOrder:
    """Simulate a market order execution."""
    
    def __init__(self):
        self.orderbook = shared_orderbook
        
    def execute(self, side:str, qty_usd:float):
        """Simulate a market order execution."""
        
        if not self.orderbook:
            return {"error": "Orderbook not available."}
        
        if side not in ["buy", "sell"]:
            return {"error": "Invalid order side. Must be 'buy' or 'sell'."}
        
        book = self.orderbook.get_asks() if side == 'buy' else self.orderbook.get_bids()
        
        total_qty = 0.0
        total_value = 0.0
        remaining_usd = qty_usd
        
        if self.orderbook is None:
            return {"error": "Orderbook not available."}
        
        start = time.perf_counter()
        
        for price, qty in book:
            price = float(price)
            qty = float(qty)
            level_cost = price * qty

            if level_cost < remaining_usd:
                # Buy the full quantity at this level
                total_qty += qty
                total_value += level_cost
                remaining_usd -= level_cost
            else:
                # Buy as much as possible at this level
                qty_to_fill = remaining_usd / price
                total_qty += qty_to_fill
                total_value += remaining_usd
                remaining_usd = 0
                break

        average_price = total_value / total_qty if total_qty > 0 else 0
        if average_price == 0:
            raise ValueError("Average price cannot be zero.")
        
        # Calculate fees
        fee_usd = FeeCalculator.calculate_fee(total_value)
        fee_btc = fee_usd / average_price
        net_qty = total_qty - fee_btc
        
        # Calculate slippage
        slippage_percent = SlippageCalculator.calculate_slippage(book, average_price, side)
        
        end = time.perf_counter()
        
        self.latency = round((end - start) * 1000, 2)
        
        return {
            "side": side,
            "filled_qty": round(net_qty, 4),  # Crypto received after fees
            "average_price": average_price,
            "total_value" if side == "buy" else "total_received": round(total_value, 2),
            "slippage_percent": round(slippage_percent, 2),
            "fee_usd": round(fee_usd, 4),
            "latency": str(self.latency) + "ms"
        }
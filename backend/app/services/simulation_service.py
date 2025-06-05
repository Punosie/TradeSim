import time
from app.utils.calculator import FeeCalculator, SlippageCalculator
from app.services.orderbook_manager import shared_orderbook

class SimulateBuy:
    """Simulate a buy order based on the latest orderbook data."""
    
    def __init__(self):
        self.orderbook = shared_orderbook
        
    def execute(self, asks, qty_usd):
        """ Simulate a buy order."""
        
        total_qty = 0.0
        total_spent = 0.0
        remaining_usd = qty_usd
        
        if self.orderbook is None:
            return {"error": "Orderbook not available."}
        
        start = time.perf_counter()
        
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
        if average_price == 0:
            raise ValueError("Average price cannot be zero.")
        
        # Calculate fees
        fee_usd = FeeCalculator.calculate_fee(total_spent)
        fee_btc = fee_usd / average_price
        net_qty = total_qty - fee_btc
        
        # Calculate slippage
        slippage_percent = SlippageCalculator.calculate_slippage(asks, average_price)
        
        end = time.perf_counter()
        
        self.latency = round((end - start) * 1000, 2)
        
        return {
            "filled_qty": round(net_qty, 4),  # Crypto received after fees
            "average_price": average_price,
            "total_spent": total_spent,
            "slippage_percent": round(slippage_percent, 2),
            "fee_usd": round(fee_usd, 4),
            "latency": str(self.latency) + "ms"
        }
import os
import orjson
from app.schemas import TradeInput
from app.config import TRADE_LOG_PATH
from app.services.orderbook_manager import shared_orderbook
from app.services.simulation_service import SimulateBuy

class TradeHandler:
    """Service for handling trade simulations."""
    PATH = TRADE_LOG_PATH
    
    def __init__(self):
        """Initialize the TradeHandler with a shared orderbook and simulator."""
        self.orderbook = shared_orderbook
        self.simulator = SimulateBuy()
        
    def simulate_trade(self, trade_input: TradeInput):
        """Simulate a trade based on the input data."""
        
        if self.orderbook is None:
            return {"error": "Orderbook not available. Please wait for the WebSocket connection to establish."}
        
        try:
            asks = self.orderbook.get_asks()
            
            if trade_input.qty_usd <= 0:
                raise ValueError("Quantity in USD must be greater than 0.")
            
        finally:
            result = self.simulator.execute(asks, trade_input.qty_usd)
            
        trade_log = {
            "timestamp": self.orderbook.get_symbol(),
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
        
        os.makedirs(os.path.dirname(self.PATH), exist_ok=True)
        with open(self.PATH, "a") as f:
            f.write(orjson.dumps(trade_log).decode() + "\n")
            
        return trade_log
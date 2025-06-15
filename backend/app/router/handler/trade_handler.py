from app.db import trade_repository
from app.schemas import TradeInput, TradeOutput
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

    async def simulate_trade(self, trade_input: TradeInput, user_id: str):
        """Simulate a trade based on the input data."""

        if self.orderbook is None:
            return {
                "error": "Orderbook not available. Please wait for the WebSocket connection to establish."
            }

        try:
            asks = self.orderbook.get_asks()

            if trade_input.qty_usd <= 0:
                raise ValueError("Quantity in USD must be greater than 0.")

        finally:
            result = self.simulator.execute(asks, trade_input.qty_usd)

        trade_log = TradeOutput(
            user_id=user_id,
            timestamp=self.orderbook.get_timestamp(),
            exchange=self.orderbook.get_exchange(),
            asset=self.orderbook.get_symbol(),
            order_type=self.orderbook.get_order_type(),
            qty_usd=trade_input.qty_usd,
            filled_qty=result.get("filled_qty", 0),
            fee_usd=result.get("fee_usd", 0),
            slippage=result.get("slippage_percent", 5.0),
            average_price=result.get("average_price", 0),
            total_spent=result.get("total_spent", 0),
            latency=result.get("latency", "N/A"),
            status="success" if result.get("filled_qty", 0) > 0 else "failed",
        )

        trade_repository.save_trade(trade_log)

        return trade_log.model_dump()

    def get_trade_history_csv(self, user_id: str) -> str:
        """Retrieve the trade history for a specific user and return as a CSV string."""
        csv_data = trade_repository.get_trades_csv_by_user(user_id)

        if not csv_data:
            return "NO TRADES YET"

        return csv_data
from fastapi import HTTPException

from app.db import trade_repository
from app.schemas import TradeInput, TradeOutput
from app.services.orderbook_manager import OrderbookHub
from app.services.simulation_service import SimulateMarketOrder


class TradeHandler:
    """Service for handling trade simulations."""

    def __init__(self, orderbook: OrderbookHub):
        self.orderbook = orderbook

    async def simulate_trade(self, trade_input: TradeInput, user_id: str) -> dict:
        """Simulate a market order against the latest order book and persist it."""
        if not self.orderbook.ready:
            raise HTTPException(
                status_code=503,
                detail="Order book not available yet. Please retry in a few seconds.",
            )

        side = trade_input.side
        book = self.orderbook.get_asks() if side == "buy" else self.orderbook.get_bids()
        try:
            result = SimulateMarketOrder.execute(book, side, trade_input.qty_usd)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

        trade_log = TradeOutput(
            user_id=user_id,
            timestamp=self.orderbook.get_timestamp(),
            exchange=self.orderbook.get_exchange(),
            asset=self.orderbook.get_symbol(),
            order_type=self.orderbook.get_order_type(),
            qty_usd=trade_input.qty_usd,
            side=side,
            filled_qty=result["filled_qty"],
            fee_usd=result["fee_usd"],
            slippage=result["slippage_percent"],
            average_price=result["average_price"],
            total_value=result["total_value"],
            latency=result["latency"],
            status="success" if result["filled_qty"] > 0 else "failed",
        )

        await trade_repository.save_trade(trade_log)

        return trade_log.model_dump()

    async def get_trade_history_csv(self, user_id: str) -> str:
        """Return the user's trade history as CSV ('' when there are no trades)."""
        return await trade_repository.get_trades_csv_by_user(user_id)

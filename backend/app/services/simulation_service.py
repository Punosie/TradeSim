import time

from app.utils.calculator import FeeCalculator, SlippageCalculator


class SimulateMarketOrder:
    """Simulate a market order walking the given side of the order book."""

    @staticmethod
    def execute(book: list, side: str, qty_usd: float) -> dict:
        """Fill `qty_usd` against `book` (asks for buys, bids for sells).

        Raises ValueError when the book is empty or nothing could be filled.
        """
        if not book:
            raise ValueError("Order book is empty.")

        start = time.perf_counter()

        total_qty = 0.0
        total_value = 0.0
        remaining_usd = qty_usd

        for price, qty in book:
            price = float(price)
            qty = float(qty)
            level_cost = price * qty

            if level_cost < remaining_usd:
                # Take the full level
                total_qty += qty
                total_value += level_cost
                remaining_usd -= level_cost
            else:
                # Take only what is left to fill
                total_qty += remaining_usd / price
                total_value += remaining_usd
                remaining_usd = 0
                break

        if total_qty <= 0:
            raise ValueError("Order could not be filled.")

        average_price = total_value / total_qty

        fee_usd = FeeCalculator.calculate_fee(total_value)
        net_qty = total_qty - fee_usd / average_price
        slippage_percent = SlippageCalculator.calculate_slippage(book, average_price, side)

        latency_ms = round((time.perf_counter() - start) * 1000, 2)

        return {
            "side": side,
            "filled_qty": round(net_qty, 4),  # Crypto received after fees
            "average_price": average_price,
            "total_value": round(total_value, 2),
            "slippage_percent": round(slippage_percent, 2),
            "fee_usd": round(fee_usd, 4),
            "latency": f"{latency_ms}ms",
        }

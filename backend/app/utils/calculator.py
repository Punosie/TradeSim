# (lower bound inclusive, upper bound exclusive, taker fee %)
FEE_TIERS = (
    (0, 100_000, 0.1),
    (100_000, 500_000, 0.05),
    (500_000, 2_000_000, 0.045),
    (2_000_000, 5_000_000, 0.04),
    (5_000_000, 10_000_000, 0.03),
)
# Fee for amounts of 10 million and above
DEFAULT_FEE = 0.025


class FeeCalculator:

    @staticmethod
    def calculate_fee(amount: float) -> float:
        """
        Calculate the taker fee in USD for a trade of `amount` USD.

        Args:
            amount (float): The trade value in USD.

        Returns:
            float: The calculated fee.
        """
        for lower, upper, taker_fee in FEE_TIERS:
            if lower <= amount < upper:
                return (taker_fee / 100) * amount

        return (DEFAULT_FEE / 100) * amount


class SlippageCalculator:

    @staticmethod
    def calculate_slippage(book: list, average_price: float, side: str) -> float:
        """
        Calculate slippage percentage for a market order.

        Slippage (buy) = ((avg_price - best_ask) / best_ask) * 100
        Slippage (sell) = ((best_bid - avg_price) / best_bid) * 100

        Args:
        book (list): List of (price, qty) from the relevant side of the book.
        average_price (float): The weighted average price executed.
        side (str): 'buy' or 'sell'

        Returns:
        float: Slippage percent. Positive = worse price than best.
        """
        if not book or average_price == 0:
            return 0.0

        best_price = float(book[0][0])

        if side == "buy":
            slippage = ((average_price - best_price) / best_price) * 100
        elif side == "sell":
            slippage = ((best_price - average_price) / best_price) * 100
        else:
            raise ValueError("Invalid side. Must be 'buy' or 'sell'.")

        return slippage

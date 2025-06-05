class FeeCalculator:

    @staticmethod
    def calculate_fee(amount: float) -> float:
        """
        Calculate the fee based on the amount and fee percentage.

        Args:
            amount (float): The amount to calculate the fee for.
            fee_percentage (float): The percentage of the fee to apply.

        Returns:
            float: The calculated fee.
        """
        tiers = [
            (1, 100_000, 0.1),
            (100_000, 500_000, 0.05),
            (500_000, 2_000_000, 0.045),
            (2_000_000, 5_000_000, 0.04),
            (5_000_000, 10_000_000, 0.03),
        ]

        for lower, upper, taker_fee in tiers:
            if lower <= amount < upper:
                return (taker_fee / 100) * amount
        
        # Default fee for amounts above 10 million
        return (0.025 / 100) * amount

class SlippageCalculator:

    @staticmethod
    def calculate_slippage(asks: list, average_price: float) -> float:
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

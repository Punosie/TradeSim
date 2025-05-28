def fee_charge(amount):
    """
    Calculate the fee charged on a given amount.
    """
    tiers = [
        (1, 100_000, 0.1),
        (100_000, 500_000, 0.05),
        (500_000, 2_000_000, 0.045),
        (2_000_000, 5_000_000, 0.04),
        (5_000_000, 10_000_000, 0.03),
    ]

    for lower, upper, taker_fee in tiers:
        if lower < amount <= upper:
            return (taker_fee / 100) * amount

    # Default fee for amounts above 10 million
    return (0.025 / 100) * amount
class FeatureExtractor:
    """Builds scale-free order book features, so the model generalises across price levels."""

    DEPTH = 5

    @staticmethod
    def mid_price(bids: list, asks: list) -> float:
        return (float(asks[0][0]) + float(bids[0][0])) / 2

    @classmethod
    def extract_features(cls, bids: list, asks: list) -> list[float]:
        """Return spread, volume imbalance and top-of-book price offsets, all relative to mid."""
        best_bid = float(bids[0][0])
        best_ask = float(asks[0][0])
        mid_price = (best_ask + best_bid) / 2

        ask_vol = sum(float(q) for _, q in asks)
        bid_vol = sum(float(q) for _, q in bids)
        imbalance = (bid_vol - ask_vol) / (bid_vol + ask_vol + 1e-9)

        top_asks = [float(price) for price, _ in asks[: cls.DEPTH]]
        top_bids = [float(price) for price, _ in bids[: cls.DEPTH]]
        top_asks += [best_ask] * (cls.DEPTH - len(top_asks))
        top_bids += [best_bid] * (cls.DEPTH - len(top_bids))

        # Price levels as offsets from mid in basis points
        ask_offsets = [(p - mid_price) / mid_price * 1e4 for p in top_asks]
        bid_offsets = [(mid_price - p) / mid_price * 1e4 for p in top_bids]

        return [
            (best_ask - best_bid) / mid_price * 1e4,  # spread (bps)
            imbalance,
        ] + ask_offsets + bid_offsets

class FeatureExtractor:
    @staticmethod
    def extract_features(bids: list, asks: list) -> list[float]:
        best_bid = float(bids[0][0])
        best_ask = float(asks[0][0])
        spread = best_ask - best_bid
        mid_price = (best_ask + best_bid) / 2

        ask_vol = sum(float(q) for _, q in asks)
        bid_vol = sum(float(q) for _, q in bids)
        imbalance = (bid_vol - ask_vol) / (bid_vol + ask_vol + 1e-9)

        top_5_ask_prices = [float(price) for price, _ in asks[:5]]
        top_5_bid_prices = [float(price) for price, _ in bids[:5]]

        top_5_ask_prices += [best_ask] * (5 - len(top_5_ask_prices))
        top_5_bid_prices += [best_bid] * (5 - len(top_5_bid_prices))

        return [
            best_ask, best_bid, spread, mid_price,
            ask_vol, bid_vol, imbalance
        ] + top_5_ask_prices + top_5_bid_prices

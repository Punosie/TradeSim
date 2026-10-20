import joblib
import numpy as np

from app.utils.feature_extractor import FeatureExtractor


class MidPriceModel:
    """Predicts the future mid-price from the current order book.

    The model outputs the expected relative change of the mid-price (in basis
    points), which is applied to the current mid so predictions track the live
    price level instead of the level seen during training.
    """

    def __init__(self, model_path: str):
        """Load the pre-trained model from disk."""
        self.model = joblib.load(model_path)

    def predict(self, bids: list, asks: list) -> list[float]:
        """Return the predicted mid-price as a single-element list."""
        features = np.asarray(
            FeatureExtractor.extract_features(bids, asks), dtype=np.float64
        ).reshape(1, -1)
        change_bps = float(self.model.predict(features)[0])
        return [FeatureExtractor.mid_price(bids, asks) * (1 + change_bps / 1e4)]

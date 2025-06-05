import joblib
import numpy as np

class MidPriceModel:
    """A model for predicting mid-price based on order book features."""
    def __init__(self, model_path: str):
        """Initialize the model with the path to the pre-trained model."""
        self.model = joblib.load(model_path)

    def predict(self, features: list[float]) -> float:
        """Predict the mid-price based on the provided features.
        Args:
            features (list[float]): A list of features extracted from the order book.
        Returns:
            float: The predicted mid-price.
        """
        features_array = np.array(features).reshape(1, -1)
        return self.model.predict(features_array).tolist()

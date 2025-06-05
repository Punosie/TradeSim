from fastapi import WebSocket
from app.okx_client import OKXClient
from app.services.prediction_model import MidPriceModel
from app.utils.feature_extractor import FeatureExtractor

class PredictionHandler:
    """Service for handling real-time predictions based on order book data."""
    def __init__(self, model_path: str):
        """Initialize the PredictionHandler with a model path."""
        self.client = OKXClient()
        self.model = MidPriceModel(model_path)

    async def handle_websocket(self, websocket: WebSocket):
        """Handle WebSocket connections for real-time predictions."""
        await websocket.accept()
        print("✅ WebSocket connected")

        try:
            async for message in self.client.subscribe():
                if websocket.client_state.name != "CONNECTED":
                    print("⚠️ WebSocket not connected")
                    break

                bids = message.get('bids', [])
                asks = message.get('asks', [])

                if not bids or not asks:
                    continue

                try:
                    features = FeatureExtractor.extract_features(bids, asks)
                    prediction = self.model.predict(features)

                    await websocket.send_json({"prediction": prediction})
                except Exception as e:
                    print(f"❌ Prediction error: {e}")
                    break

        except Exception as e:
            print(f"WebSocket failed: {e}")
        finally:
            print("🔌 WebSocket connection closed")

import joblib
import numpy as np
from app.okx_ws import sub_to_orderbook
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

# PATH = "./models/linear_regression_model_5s_timestamp.pkl"
PATH = "./models/linear_regression_model_60s_timestamp.pkl"

router = APIRouter()


@router.websocket("/ws/prediction")
# ws://127.0.0.1:8000/ws/prediction
async def midpoint_pred_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established")

    # Load the pre-trained model
    model = joblib.load(PATH)

    try:
        async for message in sub_to_orderbook():
            if websocket.client_state.name != "CONNECTED":
                print("⚠️ WebSocket no longer connected. Exiting loop.")
                break

            bids = message.get('bids', [])
            asks = message.get('asks', [])

            if not bids or not asks:
                continue

            try:
                best_bid = float(bids[0][0])
                best_ask = float(asks[0][0])
                spread = best_ask - best_bid
                mid_price = (best_ask + best_bid) / 2
                ask_vol = sum(float(q) for _, q in asks)
                bid_vol = sum(float(q) for _, q in bids)
                imbalance = (bid_vol - ask_vol) / (bid_vol + ask_vol + 1e-9)

                top_5_ask_prices = [float(price) for price, _ in asks[:5]]
                top_5_bid_prices = [float(price) for price, _ in bids[:5]]

                # Pad if fewer than 5
                while len(top_5_ask_prices) < 5:
                    top_5_ask_prices.append(best_ask)
                while len(top_5_bid_prices) < 5:
                    top_5_bid_prices.append(best_bid)

                features = [
                    best_ask, best_bid, spread, mid_price,
                    ask_vol, bid_vol, imbalance
                ] + top_5_ask_prices + top_5_bid_prices

                features = np.array(features).reshape(1, -1)

                prediction = model.predict(features)

                if websocket.client_state.name == "CONNECTED":
                    await websocket.send_json({"prediction": prediction.tolist()})
                else:
                    print("⚠️ Attempted to send on closed WebSocket.")
                    break
            except Exception as e:
                print(f"Feature extraction or prediction failed: {e}")
                break

    except WebSocketDisconnect:
        print("WebSocket connection closed")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        print("WebSocket connection closed")

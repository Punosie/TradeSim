"""Train the 60-second mid-price model from recorded order book snapshots.

Usage (from backend/):
    python train_model.py            # train and save app/regression_models/mid_price_60.pkl
    python train_model.py --plot     # also plot predicted vs actual (needs requirements-dev.txt)
"""

import argparse
import bisect
from datetime import datetime, timedelta
from pathlib import Path

import joblib
import numpy as np
import orjson
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split

from app.utils.feature_extractor import FeatureExtractor

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "dataSample" / "training_data.json"
MODEL_FILE = BASE_DIR / "app" / "regression_models" / "mid_price_60.pkl"
PREDICT_HORIZON = timedelta(seconds=60)
TOLERANCE_S = 0.5


def load_snapshots(path: Path) -> list[dict]:
    """Load newline-delimited JSON snapshots, sorted by timestamp."""
    with open(path, "rb") as f:
        snapshots = [orjson.loads(line) for line in f if line.strip()]
    for snap in snapshots:
        snap["parsed_ts"] = datetime.fromisoformat(snap["timestamp"].replace("Z", "+00:00"))
    snapshots.sort(key=lambda s: s["parsed_ts"])
    return snapshots


def build_dataset(snapshots: list[dict]) -> tuple[np.ndarray, np.ndarray]:
    """Pair each snapshot with the one PREDICT_HORIZON later.

    The target is the relative mid-price change in basis points, which keeps the
    model independent of the absolute price level seen in the training window.
    """
    timestamps = [s["parsed_ts"] for s in snapshots]
    X, Y = [], []
    for snap in snapshots:
        if not snap.get("asks") or not snap.get("bids"):
            continue
        t_future = snap["parsed_ts"] + PREDICT_HORIZON
        j = bisect.bisect_left(timestamps, t_future)
        if j >= len(timestamps) or abs((timestamps[j] - t_future).total_seconds()) > TOLERANCE_S:
            continue
        future = snapshots[j]
        if not future.get("asks") or not future.get("bids"):
            continue

        mid_now = FeatureExtractor.mid_price(snap["bids"], snap["asks"])
        mid_future = FeatureExtractor.mid_price(future["bids"], future["asks"])
        X.append(FeatureExtractor.extract_features(snap["bids"], snap["asks"]))
        Y.append((mid_future - mid_now) / mid_now * 1e4)
    return np.array(X), np.array(Y)


def plot(y_test: np.ndarray, y_pred: np.ndarray):
    import matplotlib.pyplot as plt

    plt.figure(figsize=(8, 6))
    plt.scatter(y_test, y_pred, alpha=0.5, color="blue")
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], "r--")
    plt.xlabel("Actual change (bps)")
    plt.ylabel("Predicted change (bps)")
    plt.title("Actual vs Predicted 60s Mid-Price Change (bps)")
    plt.grid(True)
    plt.show()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plot", action="store_true", help="plot predicted vs actual")
    args = parser.parse_args()

    X, Y = build_dataset(load_snapshots(DATA_PATH))
    print(f"Training samples: {len(X)}")

    x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=57)
    model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, max_depth=5, random_state=57)
    model.fit(x_train, y_train)
    print(f"Model R^2 score: {model.score(x_test, y_test):.4f}")

    MODEL_FILE.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_FILE)
    print(f"Model saved to {MODEL_FILE}")

    if args.plot:
        plot(y_test, model.predict(x_test))


if __name__ == "__main__":
    main()

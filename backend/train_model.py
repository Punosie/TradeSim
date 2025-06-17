# import orjson
# from datetime import datetime, timedelta
# from sklearn.ensemble import GradientBoostingRegressor
# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# import numpy as np
# import joblib
# import os

# PATH = "./dataSample/training_data.json"
# MODEL_PATH = "./models"
# LR_MODEL_FILE = "linear_regression_model.pkl"
# PREDICT_HORIZON = timedelta(minutes=5)

# os.makedirs(MODEL_PATH, exist_ok=True)

# #Load data
# with open(PATH, "rb") as f:
#     snpashots = [orjson.loads(line.strip()) for line in f.readlines()]

# x = [] #features (best ask, best bid, spread)
# y = [] #target variable (mid price)

# for snapshot in snpashots:
#     if "asks" in snapshot and "bids" in snapshot:
#         best_ask = float(snapshot["asks"][0][0])
#         best_bid = float(snapshot["bids"][0][0])
#         spread = best_ask - best_bid
#         mid_price = (best_ask + best_bid) / 2
#         ask_vol = sum(float(q) for _, q in snapshot["asks"])
#         bid_vol = sum(float(q) for _, q in snapshot["bids"])
#         features = [best_ask, best_bid, spread, ask_vol, bid_vol]
#         x.append(features)
#         y.append(mid_price)

# # Convert to numpy arrays
# x = np.array(x)
# y = np.array(y)

# # Split the data into training and testing sets
# x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# # Train the model
# model = LinearRegression()
# model.fit(x_train, y_train)
# # Evaluate the model
# score = model.score(x_test, y_test)
# print(f"Model score: {score:.4f}")
# # Save the model
# model_file_path = os.path.join(MODEL_PATH, LR_MODEL_FILE)
# joblib.dump(model, model_file_path)
# print(f"Model saved to {model_file_path}")

# import matplotlib.pyplot as plt

# # Predict on test data
# y_pred = model.predict(x_test)

# # Plot: Predicted vs Actual (Scatter)
# plt.figure(figsize=(8, 6))
# plt.scatter(y_test, y_pred, alpha=0.5, color="blue")
# plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], 'r--')  # Diagonal line
# plt.xlabel("Actual Mid Price")
# plt.ylabel("Predicted Mid Price")
# plt.title("Linear Regression: Actual vs Predicted Mid Prices")
# plt.grid(True)
# plt.show()

# # Optional: Line plot if you want to see sequences
# plt.figure(figsize=(10, 4))
# plt.plot(y_test[:100], label="Actual", linewidth=2)
# plt.plot(y_pred[:100], label="Predicted", linewidth=2, linestyle='dashed')
# plt.title("Mid Price Prediction (First 100 Test Samples)")
# plt.xlabel("Snapshot Index")
# plt.ylabel("Mid Price")
# plt.legend()
# plt.grid(True)
# plt.show()


import orjson
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
import numpy as np
import joblib
import os
import bisect
import matplotlib.pyplot as plt

# Configuration
PATH = "./dataSample/training_data.json"
MODEL_PATH = "./models"
LR_MODEL_FILE = "linear_regression_model_5s_timestamp.pkl"
PREDICT_HORIZON = timedelta(seconds=60)

os.makedirs(MODEL_PATH, exist_ok=True)

# Load and sort snapshots by timestamp
with open(PATH, "rb") as f:
    snapshots = [orjson.loads(line.strip()) for line in f.readlines()]


# convert timestamp to datetime and sort

for snap in snapshots:
    snap["parsed_ts"] = datetime.fromisoformat(
        snap["timestamp"].replace("Z", "+00:00"))
# Sort snapshots by parsed timestamp
snapshots.sort(key=lambda x: x["parsed_ts"])


# map timestamps to parsed timestamps for faster lookup
timestamp_map = {}
for snap in snapshots:
    timestamp_map[snap["parsed_ts"]] = snap

all_timestamps = sorted(timestamp_map.keys())


# select snapshot pairs with a 5-second difference
# BINARY SEARCH

X = []  # features (best ask, best bid, spread)
Y = []  # target variable (mid price)

for i in range(len(all_timestamps)):
    t = all_timestamps[i]
    t_future = t + PREDICT_HORIZON

    j = bisect.bisect_left(all_timestamps, t_future)

    if j < len(all_timestamps) and abs((all_timestamps[j] - t_future).total_seconds()) <= 0.5:
        # Found a matching future timestamp

        snap_curr = timestamp_map[t]
        snap_future = timestamp_map[all_timestamps[j]]

        # Extract features and target variable
        if "asks" in snap_curr and "bids" in snap_curr:
            best_ask = float(snap_curr["asks"][0][0])
            best_bid = float(snap_curr["bids"][0][0])
            spread = best_ask - best_bid
            mid_price_curr = (best_ask + best_bid) / 2
            ask_vol = sum(float(q) for _, q in snap_curr["asks"])
            bid_vol = sum(float(q) for _, q in snap_curr["bids"])
            imbalance = (bid_vol - ask_vol) / (bid_vol + ask_vol + 1e-9)

            # Add top 5 prices
            top_5_ask_prices = [float(price)
                                for price, _ in snap_curr["asks"][:5]]
            top_5_bid_prices = [float(price)
                                for price, _ in snap_curr["bids"][:5]]
            while len(top_5_ask_prices) < 5:
                top_5_ask_prices.append(best_ask)
            while len(top_5_bid_prices) < 5:
                top_5_bid_prices.append(best_bid)

            features = [
                best_ask, best_bid, spread, mid_price_curr,
                ask_vol, bid_vol, imbalance
            ] + top_5_ask_prices + top_5_bid_prices

            mid_price_future = (
                float(snap_future["asks"][0][0]) + float(snap_future["bids"][0][0]))/2

        else:
            continue
        
        X.append(features)
        Y.append(mid_price_future)
    

# Convert to numpy arrays
X = np.array(X)
Y = np.array(Y)

# Split the data into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=57)

# Train the model
# model = LinearRegression()
model = GradientBoostingRegressor( n_estimators=200, learning_rate=0.1, max_depth=5, random_state=57)
model.fit(x_train, y_train)

# Evaluate the model
score = model.score(x_test, y_test)
print(f"Model score: {score:.4f}")

# Save the model
model_file_path = os.path.join(MODEL_PATH, LR_MODEL_FILE)
joblib.dump(model, model_file_path)
print(f"Model saved to {model_file_path}")

# Predict on test data
y_pred = model.predict(x_test)

# Plot: Predicted vs Actual (Scatter)
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.5, color="blue")
plt.plot([min(y_test), max(y_test)], [
         min(y_test), max(y_test)], 'r--')  # Diagonal line
plt.xlabel("Actual Mid Price")
plt.ylabel("Predicted Mid Price")
plt.title("Linear Regression: Actual vs Predicted Mid Prices")
plt.grid(True)
plt.show()

# Line plot if you want to see sequences
plt.figure(figsize=(10, 4))
plt.plot(y_test, label="Actual", linewidth=2)
plt.plot(y_pred, label="Predicted", linewidth=2, linestyle='dashed')
plt.title("Mid Price Prediction")
plt.xlabel("Snapshot Index")
plt.ylabel("Mid Price")
plt.legend()
plt.grid(True)
plt.show()

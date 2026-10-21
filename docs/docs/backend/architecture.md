---
title: Architecture
---

The backend of TradeSim is built to stream real-time market data, simulate trades, and provide machine learning predictions without maintaining persistent state internally. It acts as a pipeline for real-time data flow from exchange → processing → frontend.

## Core Technologies

- **Python** – Core backend and data handling logic
- **FastAPI** – Provides REST and WebSocket endpoints
- **scikit-learn** – Used for training and serving the ML predictor
- **Uvicorn** – ASGI server for async support
- **orjson** – Fast JSON serialization/deserialization
- **OKX API** – External data source for orderbook snapshots

## Architectural Overview

### 1. **Single Upstream Feed, Fan-Out to Clients**

- On startup the backend opens **one** WebSocket connection to the upstream OKX order book feed. If the connection drops, it reconnects with exponential backoff.
- An in-process **`OrderbookHub`** (`app/services/orderbook_manager.py`) keeps the latest snapshot and publishes every tick to subscribed clients.
- Each browser connection on `/ws/okx` or `/ws/prediction` gets its own small bounded queue. A slow client drops its oldest message instead of slowing everyone else down.

### 2. **Prediction Pipeline**

- A scikit-learn `GradientBoostingRegressor` predicts the **relative change** of the mid-price 60 seconds ahead, in basis points.
- Its features are scale-free: spread and top-of-book offsets measured relative to the mid-price, plus volume imbalance. The model therefore keeps working when BTC trades far from the price level seen in training.
- The predicted change is applied to the current mid-price, **computed once per tick** and broadcast on `/ws/prediction`.
- Retrain with `python train_model.py` (add `--plot` to plot the results, which needs `requirements-dev.txt`).

### 3. **Trade Simulation Engine**

- `POST /simulate/trade` walks the live order book (asks for buys, bids for sells) to fill the requested USD amount.
- Computes the fill quantity, average price, tiered taker fee, slippage and latency.
- Each simulated trade is stored in **MongoDB**, written through the async `pymongo` client. Users can download their history as CSV.

### 4. **Auth and AI**

- REST endpoints verify **Firebase ID tokens** with the Firebase Admin SDK. Verification runs in a thread pool, so it never blocks the event loop.
- `POST /ask-ai` uses the async Google Gen AI client with a server-configured Gemini model.

### 5. **High-Performance JSON Handling**

- **`orjson`** decodes the upstream feed. Each tick is serialized **once** and the same payload is sent to every client.

### 6. **Data Flow Overview**

```plaintext
            [OKX order book feed]
                     │  (one connection)
                     ▼
              [OrderbookHub]
          ┌──────────┼──────────────┐
          ▼          ▼              ▼
  latest snapshot  per-tick      [ML model]
          │        broadcast         │
          ▼          ▼               ▼
 POST /simulate   /ws/okx      /ws/prediction
     /trade      (N clients)    (N clients)
          │
          ▼
      [MongoDB]
```

## Design Characteristics

- **Single process, single worker:** the hub is in-process state, so the service runs one Uvicorn worker.
- **Async throughout:** Mongo, Gemini and token verification never block the event loop.
- **Configurable:** CORS origins, Gemini model, credentials and model paths all come from environment variables (see `backend/.env.example`).

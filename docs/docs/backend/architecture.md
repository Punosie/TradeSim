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

### 1. **Real-Time Data Routing**

- The backend connects to the **OKX WebSocket API** to receive live orderbook data.
- This data is then:
  - Published to a WebSocket endpoint: `/ws/okx` (for frontend visualization)
  - Forwarded to the **prediction module** via internal WebSocket or async message queue

### 2. **Prediction Pipeline**

- The **prediction service** listens for incoming orderbook snapshots via WebSocket.
- It runs a scikit-learn ML model on each snapshot to forecast the midpoint  60 seconds into pricethe future.
- Predictions are streamed to the frontend via the `/ws/prediction` WebSocket endpoint.

### 3. **Trade Simulation Engine**

- Stateless simulation using the current orderbook data supplied with each request.
- Computes:
  - Simulated market order fill
  - Execution metrics like slippage, latency, etc.
- Available at the REST endpoint: `POST /simulate/trade`

### 4. **High-Performance JSON Handling**

To ensure minimal latency in message encoding/decoding:

- **`orjson`** is used for fast serialization and deserialization of JSON data in both WebSocket and REST pipelines.
- This significantly reduces the overhead of handling high-frequency market data and responses.

### 5. **Data Flow Overview**

```plaintext
              [OKX WebSocket API]
                       ↓
          [Backend Data Relay Service]
               ↙              ↘
     [/ws/okx]          [Prediction Module]
                                ↓
                        [/ws/prediction]

```

## Design Characteristics

- **Stateless:** No long-term state is stored on the backend — all logic is driven by live or request-time data.
- **Modular:** Prediction and simulation are separated logically and can scale independently.
- **High-Performance:** Fully async stack, fast JSON parsing (orjson), and WebSocket-first design allow real-time responsiveness.

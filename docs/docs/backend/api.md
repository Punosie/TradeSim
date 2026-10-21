---
title: Backend API
---

This section outlines the APIs exposed by the TradeSim backend for trade simulation, real-time market data, AI chat and machine-learning predictions.

Base URL (production): `https://tradesim-alce.onrender.com`

## Authentication

REST endpoints other than `/` and `/health` require a Firebase ID token from the signed-in user:

```http
Authorization: Bearer <firebase-id-token>
```

Missing or invalid tokens return `401`. The WebSocket streams are public.

## WebSocket API

The backend keeps **one** upstream order book connection and fans each tick out to every connected client. The prediction is computed once per tick and shared.

| Purpose            | Endpoint         | Description                                                    |
|--------------------|------------------|----------------------------------------------------------------|
| Orderbook Data     | `/ws/okx`        | Live order book snapshots for `BTC-USDT-SWAP` on OKX.          |
| Prediction Metrics | `/ws/prediction` | Predicted mid-price 60 seconds ahead, computed on every tick.  |

Messages are JSON, serialized with **`orjson`**. Slow clients don't hold anyone up: each client has a small buffer and drops the oldest snapshot when it falls behind.

### Example: Orderbook Stream

```json
{
  "timestamp": "2026-10-20T23:12:13Z",
  "exchange": "OKX",
  "symbol": "BTC-USDT-SWAP",
  "asks": [["82947.0", "599.56"], ["82947.1", "58.81"]],
  "bids": [["82946.9", "1537.02"], ["82946.8", "0.02"]]
}
```

### Example: Prediction Stream

```json
{
  "prediction": [82935.03]
}
```

## REST API

| Purpose          | Endpoint          | Method    | Auth | Description |
|------------------|-------------------|-----------|------|-------------|
| Welcome          | `/`               | GET       | No   | Service banner. |
| Health check     | `/health`         | GET, HEAD | No   | `{"status": "ok", "orderbook_ready": true}` |
| Simulate a trade | `/simulate/trade` | POST      | Yes  | Simulates a market order against the live book and stores it. |
| Trade history    | `/trade-history`  | GET       | Yes  | Downloads the user's trades as CSV. |
| Ask AI           | `/ask-ai`         | POST      | Yes  | Sends a prompt to Gemini and returns the answer. |

### Simulate Trade

**Request**

```json
{
  "exchange": "OKX",
  "asset": "BTC-USDT-SWAP",
  "order_type": "market",
  "qty_usd": 1000,
  "side": "buy"
}
```

`qty_usd` must be greater than 0 and `side` is `buy` or `sell`.

**Response**

```json
{
  "user_id": "<firebase-uid>",
  "timestamp": "2026-10-20T23:14:07Z",
  "exchange": "OKX",
  "asset": "BTC-USDT-SWAP",
  "order_type": "market",
  "side": "buy",
  "qty_usd": 1000.0,
  "filled_qty": 0.012,
  "fee_usd": 1.0,
  "slippage": 0.0,
  "average_price": 82947.5,
  "total_value": 1000.0,
  "latency": "0.01ms",
  "status": "success"
}
```

**Errors:** `422` invalid input or unfillable order · `503` order book not available yet.

### Trade History

Returns `text/csv` (`trade_history.csv`), newest first. Returns `404` when the user has no trades yet.

### Ask AI

**Request:** `{"prompt": "What is slippage?"}`. The model is chosen by the server (`GEMINI_MODEL`).

**Response:** `{"text": "Slippage is the difference between..."}`. Returns `502` if the model request fails.

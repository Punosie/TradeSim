---
title: Backend API
---

This section outlines the core APIs exposed by the TradeSim backend for trade simulation, real-time market data, and machine learning-based prediction services.

## WebSocket API

The backend streams real-time data via WebSocket for high-frequency updates.

| Purpose             | Endpoint          | Description                                                                 |
|---------------------|-------------------|-----------------------------------------------------------------------------|
| Prediction Metrics  | `/ws/prediction`  | Streams midpoint price predictions and metadata computed by the ML model.  |
| Orderbook Data      | `/ws/okx`         | Streams live orderbook updates from the OKX exchange for `BTC-USDT_SWAP`.  |

### WebSocket Message Format

- All WebSocket messages are JSON-encoded using **`orjson`** for high-speed serialization.
- Clients must maintain persistent connections to receive continuous updates.
- Message content depends on the type of stream:

### Example: Orderbook Stream

```json
{
    "timestamp": "2025-05-24T10:22:29Z",
    "exchange": "OKX",
    "symbol": "BTC-USDT-SWAP",
    "asks": [
        [
            "108225.1",
            "832.32"
        ],
        [
            "108225.2",
            "0.66"
        ],
    ],
    "bids":[
        [
            "108225",
            "348.79"
        ],
        [
            "108224.7",
            "0.11"
        ],
    ]
```

### Example: Prediction  Stream

```json

{
    "prediction": [
        108950.20113248515
    ]
}
```

**WebSocket data is pushed in real-time with minimal latency, thanks to FastAPI's async capabilities.**

## REST API

### Simulate Trade

| Purpose          | Endpoint          | Method | Description                                                                               |
| ---------------- | ----------------- | ------ | ----------------------------------------------------------------------------------------- |
| Simulate a Trade | `/simulate/trade` | POST   | Simulates a market trade and returns execution metrics like slippage, fill, latency, etc. |

### Request

```json
{
  "asset": "BTC-USDT_SWAP",
  "exchange": "OKX",
  "orderType": "market",
  "quantityUSD": 1000
}

```

### Response

```json

{
    "timestamp": "2025-05-24T17:18:53Z",
    "exchange": "OKX",
    "asset": "BTC-USDT-SWAP",
    "order_type": "market",
    "qty_usd": 5000000.0,
    "filled_qty": 45.91403658,
    "fee_usd": 2000.0,
    "slippage": 0.0,
    "average_price": 108855.6,
    "total_spent": 5000000.0,
    "latency": "0.24ms",
    "status": "success"
}

```
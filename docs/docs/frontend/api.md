---
title: API
---

This section outlines the key APIs used by the TradeSim frontend to interact with backend services for real-time data and trade simulation.

## WebSocket API

TradeSim uses WebSocket connections to receive continuous streams of live data.

| Purpose             | Endpoint          | Description                                |
|---------------------|-------------------|--------------------------------------------|
| Prediction Metrics  | `/ws/prediction`  | Streams midpoint price predictions and related metrics in real-time. |
| Orderbook Data      | `/ws/okx`         | Streams live orderbook updates from the OKX exchange for the `BTC-USDT_SWAP` asset. |

### WebSocket Data Format

- Messages are JSON objects with fields specific to prediction metrics or orderbook snapshots.
- Clients maintain persistent connections and handle updates to keep the UI in sync with live market data.

## REST API

TradeSim uses REST endpoints to execute trades and retrieve data.

| Purpose          | Endpoint           | Method | Description                 |
|------------------|--------------------|--------|-----------------------------|
| Simulate a Trade | `/simulate/trade`  | POST   | Sends a trade simulation request with order parameters and returns execution results. |

### Simulate Trade Request

```json
{
  "asset": "BTC-USDT_SWAP",
  "exchange": "OKX",
  "orderType": "market",
  "quantityUSD": 1000
}
```

### Response

``` json
{
    "timestamp": "2025-05-30T22:46:25Z",
    "exchange": "OKX",
    "asset": "BTC-USDT-SWAP",
    "order_type": "market",
    "qty_usd": 1000.0,
    "filled_qty": 0.00960489,
    "fee_usd": 1.0,
    "slippage": 0.0,
    "average_price": 104009.5,
    "total_spent": 1000.0,
    "latency": "0.16ms",
    "status": "success"
}
```

## Integration Notes

- WebSocket connections are managed via `react-use-websocket` for clean lifecycle management.
- REST calls made using `axios` inside React components.
- Proper error handling and reconnection strategies are followed.

---
title: API
---

This section outlines how the TradeSim frontend talks to the backend for real-time data, trade simulation and the AI assistant. See the [Backend API](../backend/api.md) for full request and response formats.

The backend location comes from two build-time variables:

| Variable       | Example                              |
|----------------|--------------------------------------|
| `VITE_API_URL` | `https://tradesim-alce.onrender.com` |
| `VITE_WS_URL`  | `wss://tradesim-alce.onrender.com`   |

## WebSocket API

| Purpose            | Endpoint         | Used by          |
|--------------------|------------------|------------------|
| Orderbook Data     | `/ws/okx`        | `OrderBook.jsx`  |
| Prediction Metrics | `/ws/prediction` | `Prediction.jsx` |

Both use the shared `useWebSocket` hook (`src/hooks/useWebSocket.js`), which:

- opens the socket when the component mounts and **always closes it on unmount**,
- reconnects with exponential backoff (1s → 15s) if the connection drops,
- parses each message as JSON and passes it to the component's handler.

The order book renders at most once per animation frame, however fast the feed ticks.

## REST API

| Purpose          | Endpoint          | Method | Used by           |
|------------------|-------------------|--------|-------------------|
| Simulate a trade | `/simulate/trade` | POST   | `TradeForm.jsx`   |
| Trade history    | `/trade-history`  | GET    | `TradeOutput.jsx` |
| Ask AI           | `/ask-ai`         | POST   | `InputForm.jsx`   |

### Simulate Trade Request

```json
{
  "exchange": "OKX",
  "asset": "BTC-USDT-SWAP",
  "order_type": "market",
  "qty_usd": 1000,
  "side": "buy"
}
```

## Integration Notes

- All REST calls go through the shared axios client in `src/lib/api.js`. It attaches the signed-in user's Firebase ID token as `Authorization: Bearer <token>`.
- API errors are shown to the user using the backend's `detail` message (for example, "Order book not available yet").
- Routes are lazy-loaded, so AG Grid only loads on `/sim`, and the markdown/KaTeX renderer only loads on `/ask-ai`.

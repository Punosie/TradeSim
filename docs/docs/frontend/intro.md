---
title: Introduction
---

The frontend of TradeSim is built using:

- **React**
- **Vite**
- **TailwindCSS**
- **AG Grid**

### Simulator Features

- 📈 **Live Orderbook Visualization**  
  Displays real-time bid/ask data in a structured tabular format.

- 🧾 **Trade Execution Form**  
  Users can place market orders on the **OKX** exchange for the `BTC-USDT_SWAP` asset. More assets and exchanges coming soon.

- 📊 **Trade Output Details**  
  After execution, the simulator displays key information:
  - Exchange used
  - Order type
  - Asset
  - Qty (USD)
  - Filled Qty
  - Avg Price
  - Total Spent
  - Slippage
  - Latency

- 🤖 **Midpoint Price Prediction**  
  Predicts the midpoint price **60 seconds** into the future using live orderbook data and machine learning.
  
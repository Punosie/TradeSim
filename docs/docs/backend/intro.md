---
title: Introduction
---

The backend of TradeSim is developed using:

- **Python** – The core language for backend logic and data processing.
- **FastAPI** – A high-performance asynchronous web framework used to expose REST and WebSocket APIs.
- **scikit-learn** – Used for training and deploying the machine learning model that predicts midpoint prices.

## Key Responsibilities

- 🔌 **API Services**  
  Serves REST and WebSocket endpoints for trade simulation, orderbook updates, and prediction metrics.

- 🧠 **Machine Learning Model**  
  A trained scikit-learn model predicts the midpoint price 60 seconds into the future using real-time orderbook data.

- ⚙️ **Trade Simulation Engine**  
  Processes incoming market order requests, simulates fills based on current orderbook state, and returns detailed trade execution metrics.

- 🔄 **Real-time Data Handling**  
  Ingests live market data (e.g., from OKX), updates the orderbook cache, and pushes real-time updates to connected clients via WebSockets.

## Technologies

| Component           | Tech Used        | Description                                 |
|---------------------|------------------|---------------------------------------------|
| Web Framework        | FastAPI          | Async framework for HTTP and WebSocket APIs |
| Machine Learning     | scikit-learn     | Model training and inference for predictions|
| WebSockets           | FastAPI WebSocket | Real-time data push to frontend             |
| Market Data Provider | OKX API (external) | Source of live orderbook snapshots         |

---

The backend is designed to be modular, scalable, and ready to integrate more exchanges, assets, and advanced ML capabilities in future updates.

---
title: Architecture Overview
---

The TradeSim frontend is designed for performance, modularity, and scalability. It leverages modern web development tools and libraries to create a responsive, efficient, and user-friendly trading simulation experience.

## Core Technologies

- **React**  
  Provides a declarative component-based UI framework enabling efficient updates and state management.

- **Vite**  
  A fast build tool and development server for modern web projects, offering lightning-fast hot module replacement (HMR) and optimized production builds.

- **TailwindCSS**  
  A utility-first CSS framework that allows rapid styling with low specificity and high customizability.

- **AG Grid**  
  An advanced grid component used for displaying and manipulating large datasets such as the live orderbook.

## Application Structure

- **Components**  
  Modular React components represent UI pieces such as forms, grids, charts, and controls.

- **State Management**  
  Local React state combined with hooks (e.g., `useState`, `useEffect`) manages component state and side effects.  
  Future plans may include a state management library for global state.

- **WebSocket Integration**  
  Real-time data streams for orderbook updates and trade events are handled via WebSocket connections.

- **API Communication**  
  RESTful endpoints are used for submitting trade orders.

## Key Modules

- **Orderbook Module**  
  Utilizes AG Grid to display live bids and asks with real-time updates.

- **Trade Execution Module**  
  Provides forms to input trade parameters and submits market orders to the backend.

- **Trade Output Module**  
  Shows detailed results of trades, including execution metrics and performance statistics.

- **Midpoint Price Predictor**  
  Integrates machine learning predictions with UI updates, forecasting price movements 60 seconds ahead.

## Styling and Theming

- TailwindCSS facilitates a consistent design language with customizable utility classes.  
- Responsive design ensures usability across desktop and mobile devices.

## Build and Deployment

- Vite optimizes build size and load times.  
- Production builds generate highly optimized static assets ready for deployment.

---

This architecture supports extensibility and maintainability as TradeSim grows to include more exchanges, assets, and advanced features.

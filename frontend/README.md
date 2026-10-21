# TradeSim Frontend

React 19 + Vite 8 single-page app for [TradeSim](https://tradesim-shubhabha.vercel.app/).

## Scripts

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev            # dev server on http://localhost:5173
npm run lint           # ESLint (flat config, React Hooks rules)
npm run build          # production build into dist/
npm run preview        # serve the production build
```

Requires Node.js 22.22+.

## Environment

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend REST base URL, e.g. `https://tradesim-alce.onrender.com` |
| `VITE_WS_URL` | Backend WebSocket base URL, e.g. `wss://tradesim-alce.onrender.com` |
| `VITE_SITE_URL` | Public site URL for canonical and Open Graph tags (optional) |
| `VITE_FIREBASE_*` | Firebase web app config |
| `VITE_SERVICE_ID`, `VITE_TEMPLATE_ID`, `VITE_PUBLIC_KEY` | EmailJS contact form |

Every `VITE_*` value is embedded in the public bundle, so never put secrets here.

## Structure

```text
src/
  router/App.jsx         lazy-loaded routes (+ 404)
  pages/                 Home, Simulator, AskAI, About, Contact, NotFound
  components/            OrderBook, Prediction, TradeForm, TradeOutput, ChatWindow, Seo, ...
  hooks/useWebSocket.js  WebSocket with reconnect/backoff and cleanup on unmount
  lib/api.js             axios client that attaches the Firebase ID token
  firebase/config.jsx    Firebase app/auth; analytics loaded lazily
public/                  favicons, web manifest, robots.txt, sitemap.xml, og-image.png
```

## SEO

Each page renders `<Seo title description path />`, which uses React 19's native `<title>`/`<meta>` hoisting (no react-helmet). `index.html` carries default tags for crawlers that don't run JavaScript; they're removed on startup so pages never duplicate them.

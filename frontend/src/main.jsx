import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './router/App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { initAnalytics } from './firebase/config'
import { startPerfLogging } from './lib/perfLogger'

startPerfLogging()

// index.html carries default SEO tags for crawlers that don't run JS; once the
// app runs, each page renders its own via <Seo>, so drop the defaults.
document.head.querySelectorAll('[data-default]').forEach((el) => el.remove())

// Vercel's analytics scripts are served only by Vercel deployments
const onVercel = import.meta.env.VITE_ON_VERCEL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {onVercel && <SpeedInsights />}
      {onVercel && <Analytics />}
      <App />
    </AuthProvider>
  </StrictMode>,
)

initAnalytics()

import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Home from '../pages/Home'

// Home is the landing page and stays in the main bundle; the rest load on demand
const About = lazy(() => import('../pages/About'))
const Simulator = lazy(() => import('../pages/Simulator'))
const Contact = lazy(() => import('../pages/Contact'))
const AskAI = lazy(() => import('../pages/AskAI'))
const NotFound = lazy(() => import('../pages/NotFound'))

const PageFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <p className="text-slate-300 text-base xl:text-xl animate-pulse">Loading...</p>
  </div>
)

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sim" element={<Simulator />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App

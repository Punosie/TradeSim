import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Simulator from '../pages/Simulator'
import Contact from '../pages/Contact'
import AskAI from '../pages/AskAI'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sim" element={<Simulator />} />
        <Route path="/ask-ai" element={<AskAI />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Components/styles/style.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/examensarbete">
      <App />
    </BrowserRouter>
  </StrictMode>,
)

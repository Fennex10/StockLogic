import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StockLogicApp } from './StockLogicApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StockLogicApp />
  </StrictMode>,
)

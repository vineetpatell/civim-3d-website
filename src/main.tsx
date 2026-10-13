import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

/**
 * BrowserRouter = clean URLs (/, /about, /shop, /contact).
 * Direct load / refresh needs an SPA fallback on the host
 * (see README + public/_redirects + vercel.json).
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

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

// Service Worker registration — caches app shell, excludes checkout/payment data.
function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.onupdatefound = () => {
            const installing = reg.installing
            if (!installing) return
            installing.onstatechange = () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available — could trigger an "update available" UI
                console.log('[SW] New version installed')
              }
            }
          }
        })
        .catch((err) => console.log('[SW] Registration failed:', err))
    })
  }
}

registerSW()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

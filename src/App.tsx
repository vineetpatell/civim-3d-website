import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/Home'
import { AboutPage } from './pages/About'
import { ShopPage } from './pages/Shop'
import { ContactPage } from './pages/Contact'
import { ScrollTrigger } from './lib/gsap'
import './components/nav-hero.css'
import './components/real-bottle.css'
import './components/sections.css'
import './components/pages.css'

/**
 * Multi-page app: Home / About / Shop / Contact with clean URLs.
 * Old single-page anchors (Story/Purity/Process) are retired — those ideas
 * now live as sections inside Home/About, so header/footer never compete
 * with in-page pins and scroll overlap is gone for good.
 */
export default function App() {
  // Recalculate trigger positions once webfonts have loaded (they shift layout).
  useEffect(() => {
    if ('fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
  }, [])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}


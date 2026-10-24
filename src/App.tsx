import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { MobileBottomNav } from './components/MobileBottomNav'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { ScrollToTop } from './components/ScrollToTop'
import { CartProvider } from './lib/cart'
import { HomePage } from './pages/Home'
import { AboutPage } from './pages/About'
import { ShopPage } from './pages/Shop'
import { ProductDetailPage } from './pages/ProductDetail'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactPage } from './pages/Contact'
import { PrivacyPolicyPage } from './pages/PrivacyPolicy'
import { TermsPage } from './pages/Terms'
import { ReturnRefundPage } from './pages/ReturnRefund'
import { DataProtectionPage } from './pages/DataProtection'
import { ScrollTrigger } from './lib/gsap'
import './components/nav-hero.css'
import './components/real-bottle.css'
import './components/sections.css'
import './components/pages.css'
import './components/store.css'
import './components/home.css'
import './components/commerce.css'
import './components/legal.css'

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
    <CartProvider>
      <div className="grain" aria-hidden="true" />
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          {/* Legacy slug → canonical product URL */}
          <Route
            path="/shop/mustard-oil-100-pure"
            element={<Navigate to="/shop/mustard-oil" replace />}
          />
          <Route path="/shop/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* --- Legal & policy pages (public, indexable) ------------------ */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPage />} />
          <Route path="/data-protection" element={<DataProtectionPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PWAInstallPrompt />
      <MobileBottomNav />
      <Footer />
    </CartProvider>
  )
}


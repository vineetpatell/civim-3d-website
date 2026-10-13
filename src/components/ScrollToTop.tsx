import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../lib/gsap'

/** Scroll to top on route change + refresh triggers after new layout. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Anchor navigation (e.g. /#faq): let the browser handle it.
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    // New DOM heights → recalc every trigger so nothing overlaps.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname, hash])

  return null
}

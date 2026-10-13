import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap, useGSAP } from '../lib/gsap'
import { CONTACT, ROUTES } from '../lib/site'
import { whatsappUrl, GENERAL_ENQUIRY_MESSAGE } from '../lib/whatsapp'

/**
 * Simplified header: wordmark + Home / About / Shop / Contact + one
 * "Order on WhatsApp" CTA. Mobile gets a real menu (no hidden links).
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // entrance (immediateRender:false: stays visible until tween starts)
  useGSAP(
    () => {
      gsap.from(navRef.current, {
        y: -24,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
        immediateRender: false,
      })
    },
    { scope: navRef },
  )

  return (
    <header ref={navRef} className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="shell nav__inner">
        <Link className="nav__brand" to="/" aria-label="CIVIM GRAINS home">
          <span className="nav__brand-name">CIVIM</span>
          <span className="nav__brand-tag">Grains · Kisaan Se Rasoi Tak</span>
        </Link>

        <nav aria-label="Primary">
          <ul className="nav__links">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <NavLink
                  to={r.path}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                  end={r.path === '/'}
                >
                  {r.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__right">
          <a
            className="btn btn--primary nav__cta"
            href={whatsappUrl(GENERAL_ENQUIRY_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order on WhatsApp
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`nav__mobile${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {ROUTES.map((r) => (
              <li key={r.path}>
                <NavLink to={r.path} end={r.path === '/'}>
                  {r.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href={whatsappUrl(GENERAL_ENQUIRY_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp — {CONTACT.phoneDisplay}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}


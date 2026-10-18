import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap, useGSAP } from '../lib/gsap'
import { LOGO, ROUTES } from '../lib/site'
import { useCart } from '../lib/cart'

/**
 * Header: official logo + wordmark, Home / About / Shop / Contact,
 * a cart icon with live item count, and a real mobile menu.
 * (No WhatsApp ordering CTA — ordering flows through the cart/checkout.)
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const { count } = useCart()

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
          <img
            className="nav__logo"
            src={LOGO.src}
            alt="CIVIM GRAINS official logo"
            width={LOGO.width}
            height={LOGO.height}
            style={{ aspectRatio: LOGO.aspectRatio }}
          />
          <span className="nav__brand-text">
            <span className="nav__brand-name">CIVIM GRAINS</span>
            <span className="nav__brand-tag">Kisaan Se Rasoi Tak</span>
          </span>
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
          <Link className="nav__cart" to="/cart" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
              <path
                d="M4 5h2l1.2 10.2a1.5 1.5 0 0 0 1.5 1.35h7.9a1.5 1.5 0 0 0 1.47-1.2L20 8H7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="19.6" r="1.4" fill="currentColor" />
              <circle cx="16.6" cy="19.6" r="1.4" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="nav__cart-count" aria-hidden="true">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
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
              <NavLink to="/cart">Cart ({count})</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}


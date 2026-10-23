import { Link } from 'react-router-dom'
import { LOGO } from '../lib/site'
import { useCart } from '../lib/cart'

/**
 * Compact mobile top bar — logo, cart badge, optional install action.
 * Shown on mobile only, sits above the main Nav on small screens.
 */
export function MobileTopBar() {
  const { count } = useCart()

  return (
    <header className="mobile-top-bar">
      <div className="mobile-top-bar__inner">
        <Link to="/" className="mobile-top-bar__logo" aria-label="CIVIM GRAINS home">
          <img
            src={LOGO.src}
            alt="CIVIM GRAINS"
            width={48}
            height={48}
            style={{ aspectRatio: '1 / 1' }}
          />
          <span className="mobile-top-bar__wordmark">CIVIM GRAINS</span>
        </Link>

        <div className="mobile-top-bar__actions">
          <Link to="/cart" className="mobile-top-bar__cart" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <circle cx="9" cy="20" r="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="15" cy="20" r="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 19H4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v1M5 19H2L1 3L4 3h14l3 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {count > 0 && <span className="mobile-top-bar__badge">{count > 9 ? '9+' : count}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
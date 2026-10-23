import { NavLink } from 'react-router-dom'
import { useCart } from '../lib/cart'

/**
 * Fixed bottom navigation for mobile — app-like shopping shell.
 * Shows Home, Shop (categories), Cart (with badge), Contact.
 * Hidden on desktop (see CSS).
 */
export function MobileBottomNav() {
  const { count } = useCart()

  return (
    <>
      {/* Bottom tab bar */}
      <nav className="mobile-bottom-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
          end
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
            <path d="M3 3v18h18V3H3zm16 16h-5l-3-3l-3 3H7V5h10l4 4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Shop</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
            <circle cx="9" cy="20" r="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="15" cy="20" r="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19H4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v1M5 19H2L1 3L4 3h14l3 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Cart</span>
          {count > 0 && <span className="mobile-nav-badge">{count > 9 ? '9+' : count}</span>}
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2H9.82c-1.12 0-2.02-.78-2.22-1.79v-.5c-.2-.62-.41-1.25-.61-1.85L1.49 7.68c-.2-.62-.41-1.25-.61-1.85l-.18-.28l.18-.28c.2-.62.41-1.25.61-1.85V3.95c0-.77.48-1.46 1.13-1.76h14.13c.77 0 1.24.57 1.43 1.19l1.12 2.63c.17.4.34.82.5 1.27L21.1 14c.2.62.41 1.25.61 1.85V15c0 .77-.48 1.46-1.13 1.76H19a2 2 0 0 1-2-2v-.5c0-.77-.22-1.5-.59-2.06L15.13 7h-6.25L8.12 13H6.88c-.25 0-.49.13-.66.34l-.22.26l-.22-.26c-.17-.2-.42-.34-.66-.34H3.88c-.39 0-.74.23-.88.6l-.18.27l-.18-.26c-.14-.36-.49-.6-.89-.6H2c-.77 0-1.43.59-1.63 1.37l-.28 1.08c-.07.25-.11.52-.11.78v1c0 .85.34 1.62.9 2.18L3.82 21H20.18c1.12 0 2.02-.78 2.22-1.79l.18-.27c.2-.59.23-1.25.09-1.87z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Contact</span>
        </NavLink>
      </nav>
    </>
  )
}
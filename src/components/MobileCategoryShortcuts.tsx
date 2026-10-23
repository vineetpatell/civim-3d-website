import { Link } from 'react-router-dom'
import { CATEGORIES } from '../lib/products'

/**
 * Horizontal row of category shortcut chips for mobile homepage.
 * Taps go to filtered shop results.
 */
export function MobileCategoryShortcuts() {
  return (
    <section className="mobile-category-shortcuts">
      <div className="shell">
        <span className="eyebrow">Quick shop</span>
        <h2 className="shortcuts-heading">Categories</h2>
        <div className="shortcuts-list">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={c.name === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(c.name)}`}
              className="shortcut-chip"
            >
              {c.name === 'All' ? 'All Products' : c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
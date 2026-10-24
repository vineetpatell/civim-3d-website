import { Link } from 'react-router-dom'
import type { Product } from '../lib/products'
import { formatPrice, unitPrice } from '../lib/products'
import { useCart } from '../lib/cart'

/**
 * Product card for grids and carousels:
 * real photo (or honest placeholder), name, category, price only when
 * confirmed, Add to Cart + Buy Now. Unpriced items show a clear
 * "Price to be confirmed" state — never a fabricated number.
 */
export function ProductCard({ product }: { product: Product }) {
  const { add, lastAdded } = useCart()
  const price = unitPrice(product)
  const justAdded = lastAdded === product.slug

  return (
    <article className="product-card">
      <Link className="product-card__media" to={`/shop/${product.slug}`} tabIndex={-1}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt ?? `${product.name} — CIVIM GRAINS product photo`}
            loading="lazy"
            decoding="async"
            width={887}
            height={1774}
            className="product-card__img product-card__img--bottle"
          />
        ) : (
          <div className="product-card__placeholder">
            <span className="product-card__placeholder-brand">CIVIM</span>
            <span className="product-card__placeholder-cat">{product.category}</span>
            <span className="product-card__placeholder-note">Photo coming soon</span>
          </div>
        )}
        <span className="product-card__cat">{product.category}</span>
      </Link>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link to={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.detail && <p className="product-card__detail">{product.detail}</p>}

        <div className="product-card__price">
          {price !== null ? (
            <span className="product-card__price-value">{formatPrice(price)}</span>
          ) : (
            <span className="product-card__price-tbc">Price to be confirmed</span>
          )}
        </div>

        <div className="product-card__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => add(product.slug)}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? 'Added ✓' : 'Add to Cart'}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              add(product.slug)
              window.location.href = `/shop/${product.slug}`
            }}
            aria-label={`Buy ${product.name} now`}
          >
            Buy Now
          </button>
        </div>
        {!product.image && (
          <span className="sr-only">
            {product.name}: product photograph not yet available, placeholder shown.
          </span>
        )}
      </div>
    </article>
  )
}

import { Link } from 'react-router-dom'
import type { Product } from '../lib/products'
import { whatsappUrl, productEnquiryMessage } from '../lib/whatsapp'

/**
 * Product card: real photo when available, clean placeholder tile otherwise.
 * Never fabricated packaging. Supports name / category / verified description
 * / verified detail + WhatsApp CTA.
 */
export function ProductCard({ product }: { product: Product }) {
  const wa = whatsappUrl(productEnquiryMessage(product.name))
  return (
    <article className="product-card">
      <div className="product-card__media">
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
          <div className="product-card__placeholder" aria-hidden="true">
            <span className="product-card__placeholder-brand">CIVIM</span>
            <span className="product-card__placeholder-cat">{product.category}</span>
            <span className="product-card__placeholder-note">
              Photo coming soon
            </span>
          </div>
        )}
        <span className="product-card__cat">{product.category}</span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        {product.detail && <p className="product-card__detail">{product.detail}</p>}
        <div className="product-card__actions">
          <a
            className="btn btn--primary btn--sm"
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask on WhatsApp
          </a>
          <Link className="btn btn--ghost btn--sm" to="/contact">
            Contact
          </Link>
        </div>
        <span className="sr-only">
          {product.image
            ? undefined
            : `${product.name}: product photograph not yet available, placeholder shown.`}
        </span>
      </div>
    </article>
  )
}

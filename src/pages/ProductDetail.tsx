import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { ProductCard } from '../components/ProductCard'
import { Seo, productJsonLd } from '../lib/seo'
import { CONTACT } from '../lib/site'
import { useCart } from '../lib/cart'
import { formatPrice, findProduct, productsByCategory, unitPrice, type ProductImage } from '../lib/products'

function galleryOf(product: {
  images?: ProductImage[]
  image: string | null
  imageAlt?: string
  name: string
}): ProductImage[] {
  if (product.images && product.images.length > 0) return product.images
  if (product.image) {
    return [{ src: product.image, alt: product.imageAlt ?? product.name }]
  }
  return []
}

/**
 * Premium product detail page (/shop/:slug).
 * Desktop: gallery left, purchase panel right. Mobile: stacked.
 * Prices/stock appear only when confirmed; missing data is honestly marked.
 */
export function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = slug ? findProduct(slug) : undefined
  const { add } = useCart()

  const [qty, setQty] = useState(1)
  const [variantId, setVariantId] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  // Reset panel state when navigating between products.
  useEffect(() => {
    setQty(1)
    setVariantId(null)
    setActive(0)
    setZoom(false)
  }, [slug])

  // Esc closes the zoom dialog.
  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const gallery = useMemo(() => (product ? galleryOf(product) : []), [product])

  if (!product) {
    return (
      <>
        <Seo
          title="Product not found — CIVIM GRAINS"
          description="This product could not be found. Browse the full CIVIM GRAINS catalogue."
          path={slug ? `/shop/${slug}` : '/shop'}
          noindex
        />
        <section className="section page-hero" aria-labelledby="pd-404">
          <div className="shell narrow">
            <span className="eyebrow">404</span>
            <h1 id="pd-404">Product not found</h1>
            <p className="lede">
              This product does not exist (it may have moved). Browse the full
              catalogue instead.
            </p>
            <div className="btn-row">
              <Link className="btn btn--primary" to="/shop">
                Back to Shop
              </Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  const price = unitPrice(product, variantId)
  const selectedVariant = variantId
    ? product.variants?.find((v) => v.id === variantId)
    : undefined
  const related = productsByCategory(product.category).filter(
    (p) => p.slug !== product.slug,
  )

  const currentImage = gallery[active]
  const path = `/shop/${product.slug}`

  const addToCart = () => add(product.slug, variantId, qty)
  const buyNow = () => {
    add(product.slug, variantId, qty)
    navigate('/checkout')
  }

  return (
    <>
      <Seo
        title={`${product.name} — CIVIM GRAINS`}
        description={`${product.name} from CIVIM GRAINS. ${product.description}`}
        path={path}
        image={product.image ?? undefined}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
          { name: product.name, path },
        ]}
        jsonLd={[
          productJsonLd({
            name: product.name,
            description: product.description,
            path,
            image: product.image,
            price,
            category: product.category,
          }),
        ]}
      />

      <section className="section pdp-hero" aria-labelledby="pdp-h">
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="pdp">
            {/* --- Gallery ------------------------------------------------ */}
            <div className="pdp__gallery">
              <div className="pdp__stage">
                {currentImage ? (
                  <button
                    type="button"
                    className="pdp__zoomable"
                    onClick={() => setZoom(true)}
                    aria-label={`View larger image of ${product.name}`}
                  >
                    <img
                      className={`pdp__main-img${product.image && !product.images ? ' pdp__main-img--bottle' : ''}`}
                      src={currentImage.src}
                      alt={currentImage.alt}
                      decoding="async"
                      width={887}
                      height={1774}
                    />
                    <span className="pdp__zoomhint" aria-hidden="true">
                      Click to enlarge
                    </span>
                  </button>
                ) : (
                  <div className="product-card__placeholder pdp__placeholder">
                    <span className="product-card__placeholder-brand">CIVIM</span>
                    <span className="product-card__placeholder-cat">{product.category}</span>
                    <span className="product-card__placeholder-note">Photo coming soon</span>
                  </div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="pdp__thumbs" role="tablist" aria-label="Product images">
                  {gallery.map((g, i) => (
                    <button
                      key={g.src}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      className={`pdp__thumb${i === active ? ' is-active' : ''}`}
                      onClick={() => setActive(i)}
                    >
                      <img src={g.src} alt="" width={80} height={80} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* --- Purchase panel ---------------------------------------- */}
            <div className="pdp__panel">
              <span className="pdp__cat">{product.category}</span>
              <h1 id="pdp-h">{product.name}</h1>
              {product.detail && <p className="pdp__detail">{product.detail}</p>}

              <div className="pdp__price">
                {price !== null ? (
                  <span className="pdp__price-value">{formatPrice(price)}</span>
                ) : (
                  <span className="pdp__price-tbc">Price to be confirmed</span>
                )}
                {selectedVariant && (
                  <span className="pdp__variant-label">{selectedVariant.label}</span>
                )}
              </div>

              <p className="pdp__stock">
                {product.stock === 'in' && <strong>In stock</strong>}
                {product.stock === 'out' && <strong>Out of stock</strong>}
                {product.stock === 'unknown' && (
                  <span>Availability: contact us for current stock</span>
                )}
              </p>

              {product.variants && product.variants.length > 0 && (
                <fieldset className="pdp__variants">
                  <legend>Pack size</legend>
                  <div className="pdp__variant-list">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className={`chip${variantId === v.id ? ' is-active' : ''}`}
                        aria-pressed={variantId === v.id}
                        onClick={() => setVariantId(variantId === v.id ? null : v.id)}
                      >
                        {v.label}
                        {v.price !== null && ` — ${formatPrice(v.price)}`}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="pdp__qty">
                <label htmlFor="pdp-qty">Quantity</label>
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    id="pdp-qty"
                    type="number"
                    min={1}
                    max={99}
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pdp__actions">
                <button type="button" className="btn btn--primary" onClick={addToCart}>
                  Add to Cart
                </button>
                <button type="button" className="btn btn--gold" onClick={buyNow}>
                  Buy Now
                </button>
              </div>

              <p className="pdp__delivery">
                Delivery: confirmed with your order — share your PIN code on the{' '}
                <Link className="text-link" to="/contact">
                  Contact page
                </Link>{' '}
                ({CONTACT.phoneDisplay}). Online payment activates with our
                verified payment provider; Cash on Delivery is available once
                order processing is connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Specifications ------------------------------------------- */}
      {product.specs && product.specs.length > 0 && (
        <section className="section page-section pdp-specs" aria-labelledby="pdp-specs-h">
          <Reveal className="shell">
            <span className="eyebrow" data-reveal>
              Product information
            </span>
            <h2 id="pdp-specs-h" data-reveal>
              Specifications
            </h2>
            <table className="spec-table" data-reveal>
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label}>
                    <th scope="row">{s.label}</th>
                    <td>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="fine-print" data-reveal>
              Always refer to the physical pack label for the definitive
              information.
            </p>
          </Reveal>
        </section>
      )}

      {/* --- Product FAQs --------------------------------------------- */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="section page-section page-section--tint" id="faq" aria-labelledby="pdp-faq-h">
          <Reveal className="shell faq-wrap">
            <span className="eyebrow" data-reveal>
              Questions about this product
            </span>
            <h2 id="pdp-faq-h" data-reveal>
              {product.name} FAQ
            </h2>
            <div data-reveal>
              <Faq items={product.faqs} idPrefix={`pdp-faq-${product.slug}`} />
            </div>
          </Reveal>
        </section>
      )}

      {/* --- Related products ------------------------------------------ */}
      {related.length > 0 && (
        <section className="section page-section" aria-labelledby="pdp-rel-h">
          <Reveal className="shell">
            <div className="section-head" data-reveal>
              <div>
                <span className="eyebrow">More from this category</span>
                <h2 id="pdp-rel-h">Related products</h2>
              </div>
              <Link className="text-link" to={`/shop?category=${encodeURIComponent(product.category)}`}>
                View all {product.category} →
              </Link>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* --- Accessible zoom dialog ------------------------------------- */}
      {zoom && currentImage && (
        <div
          className="zoom"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} — enlarged image`}
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            className="zoom__close"
            onClick={() => setZoom(false)}
            aria-label="Close enlarged view"
            autoFocus
          >
            ×
          </button>
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
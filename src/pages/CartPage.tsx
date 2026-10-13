import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../lib/seo'
import { useCart } from '../lib/cart'
import { formatPrice } from '../lib/products'

/**
 * Cart: line items, quantity steppers, remove, subtotal (only from
 * confirmed prices), clear empty state and blocked-checkout validation.
 */
export function CartPage() {
  const { lines, count, subtotal, hasUnpriced, setQty, remove, clear } = useCart()

  return (
    <>
      <Seo
        title="Your Cart — CIVIM GRAINS"
        description="Review the items in your CIVIM GRAINS cart before checkout."
        path="/cart"
        noindex
      />
      <section className="section page-hero" aria-labelledby="cart-h">
        <Reveal className="shell narrow">
          <span className="eyebrow" data-reveal>
            Your basket
          </span>
          <h1 id="cart-h" data-reveal>
            Shopping <em>cart.</em>
          </h1>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="cart-list-h">
        <div className="shell cart-layout">
          <h2 id="cart-list-h" className="sr-only">
            Cart items
          </h2>

          {lines.length === 0 ? (
            <div className="empty-state">
              <h2>Your cart is empty</h2>
              <p>Browse the catalogue and add everyday staples to your basket.</p>
              <div className="btn-row btn-row--center">
                <Link className="btn btn--primary" to="/shop">
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="cart-lines">
                {lines.map((line) => (
                  <li className="cart-line" key={line.key}>
                    <div className="cart-line__media">
                      {line.product.image ? (
                        <img
                          src={line.product.image}
                          alt={line.product.imageAlt ?? line.product.name}
                          width={120}
                          height={240}
                          loading="lazy"
                        />
                      ) : (
                        <div className="cart-line__placeholder" aria-hidden="true">
                          CIVIM
                        </div>
                      )}
                    </div>
                    <div className="cart-line__info">
                      <h3>
                        <Link to={`/shop/${line.slug}`}>{line.product.name}</Link>
                      </h3>
                      {line.variantLabel && (
                        <p className="cart-line__variant">Pack: {line.variantLabel}</p>
                      )}
                      <p className="cart-line__price">
                        {line.unitPrice !== null ? (
                          `${formatPrice(line.unitPrice)} each`
                        ) : (
                          <span className="price-tbc">Price to be confirmed</span>
                        )}
                      </p>
                    </div>
                    <div className="cart-line__qty">
                      <label className="sr-only" htmlFor={`qty-${line.key}`}>
                        Quantity for {line.product.name}
                      </label>
                      <div className="qty-stepper qty-stepper--sm">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label={`Decrease quantity of ${line.product.name}`}
                        >
                          −
                        </button>
                        <input
                          id={`qty-${line.key}`}
                          type="number"
                          min={1}
                          max={99}
                          value={line.qty}
                          onChange={(e) => setQty(line.key, Number(e.target.value) || 1)}
                        />
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label={`Increase quantity of ${line.product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => remove(line.key)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="cart-line__total">
                      {line.lineTotal !== null ? (
                        formatPrice(line.lineTotal)
                      ) : (
                        <span className="price-tbc">—</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <aside className="cart-summary" aria-labelledby="cart-sum-h">
                <h2 id="cart-sum-h">Order summary</h2>
                <dl>
                  <div>
                    <dt>Items</dt>
                    <dd>{count}</dd>
                  </div>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>
                      {subtotal !== null ? (
                        formatPrice(subtotal)
                      ) : (
                        <span className="price-tbc">To be confirmed</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Shipping</dt>
                    <dd>Confirmed with your order</dd>
                  </div>
                </dl>

                {hasUnpriced && (
                  <p className="cart-summary__notice" role="status">
                    Some items do not have confirmed prices yet, so checkout is
                    disabled for them. Contact us to confirm pricing — we never
                    estimate prices on your behalf.
                  </p>
                )}

                <div className="cart-summary__actions">
                  <Link
                    className={`btn btn--primary${hasUnpriced ? ' is-disabled' : ''}`}
                    to="/checkout"
                    aria-disabled={hasUnpriced}
                    onClick={(e) => {
                      if (hasUnpriced) e.preventDefault()
                    }}
                  >
                    Proceed to Checkout
                  </Link>
                  <Link className="btn btn--ghost" to="/shop">
                    Continue Shopping
                  </Link>
                </div>
                <button type="button" className="cart-summary__clear" onClick={clear}>
                  Empty the cart
                </button>
              </aside>
            </>
          )}
        </div>
      </section>
    </>
  )
}
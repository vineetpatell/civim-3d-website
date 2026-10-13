import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../lib/seo'
import { useCart } from '../lib/cart'
import { formatPrice } from '../lib/products'
import { CONTACT } from '../lib/site'
import {
  CHECKOUT_CONFIG,
  placeOrder,
  validateCartForCheckout,
  validateCustomer,
  type CustomerInfo,
  type PaymentMethod,
} from '../lib/checkout'

const EMPTY_CUSTOMER: CustomerInfo = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
}

type FieldErrors = Partial<Record<keyof CustomerInfo, string>>

/**
 * Checkout: customer details, order summary, payment method selection
 * (online integration point + Cash on Delivery), review and submission.
 *
 * HONEST STATE: no order backend is connected yet, so the Place Order button
 * is disabled with a clear notice. Nothing is ever confirmed or simulated —
 * when CHECKOUT_CONFIG.orderApiUrl is set, the same UI submits genuine
 * orders and only shows success on a real server response.
 */
export function CheckoutPage() {
  const { lines, subtotal, hasUnpriced, clear } = useCart()
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [method, setMethod] = useState<PaymentMethod>('cod')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string; orderId?: string } | null>(
    null,
  )

  const cartBlock = validateCartForCheckout(lines, hasUnpriced)
  const orderServiceReady = CHECKOUT_CONFIG.orderApiUrl !== null

  const set = (key: keyof CustomerInfo) => (value: string) => {
    setCustomer((c) => ({ ...c, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (cartBlock || !orderServiceReady || busy) return

    const issues = validateCustomer(customer)
    if (issues.length > 0) {
      const map: FieldErrors = {}
      for (const issue of issues) map[issue.field] = issue.message
      setErrors(map)
      const firstKey = issues[0].field
      document.getElementById(`co-${firstKey}`)?.focus()
      return
    }

    setBusy(true)
    setResult(null)
    const response = await placeOrder({
      items: lines.map((l) => ({
        slug: l.slug,
        variantId: l.variantId,
        qty: l.qty,
        unitPrice: l.unitPrice,
      })),
      customer,
      paymentMethod: method,
      subtotal,
    })
    setBusy(false)
    setResult(response)
    if (response.ok) clear()
  }

  const field = (
    key: keyof CustomerInfo,
    label: string,
    props: {
      type?: string
      autoComplete?: string
      inputMode?: 'text' | 'tel' | 'email' | 'numeric'
      placeholder?: string
      full?: boolean
    } = {},
  ) => (
    <div className={`field${props.full ? ' field--full' : ''}`}>
      <label htmlFor={`co-${key}`}>{label}</label>
      <input
        id={`co-${key}`}
        type={props.type ?? 'text'}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        placeholder={props.placeholder}
        value={customer[key]}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `co-${key}-error` : undefined}
        onChange={(e) => set(key)(e.target.value)}
      />
      {errors[key] && (
        <p className="field__error" id={`co-${key}-error`} role="alert">
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <>
      <Seo
        title="Checkout — CIVIM GRAINS"
        description="Complete your CIVIM GRAINS order: delivery details, payment method and order review."
        path="/checkout"
        noindex
      />
      <section className="section page-hero" aria-labelledby="co-h">
        <Reveal className="shell narrow">
          <span className="eyebrow" data-reveal>
            Secure checkout
          </span>
          <h1 id="co-h" data-reveal>
            Checkout.
          </h1>
          <p className="lede" data-reveal>
            Enter your delivery details, choose a payment method and review
            your order before it is placed.
          </p>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="co-form-h">
        <div className="shell checkout">
          {!orderServiceReady && (
            <div className="checkout__notice" role="status">
              <strong>Online ordering is being activated.</strong>
              Order submission is currently disabled — no order can be placed
              from this page yet. Call{' '}
              <a className="text-link" href={CONTACT.phoneHref}>
                {CONTACT.phoneDisplay}
              </a>{' '}
              or visit the{' '}
              <Link className="text-link" to="/contact">
                Contact page
              </Link>{' '}
              to order in the meantime. This page will start accepting genuine
              orders as soon as our order service and payment provider are
              connected.
            </div>
          )}

          {cartBlock ? (
            <div className="empty-state">
              <h2>{cartBlock}</h2>
              <div className="btn-row btn-row--center">
                <Link className="btn btn--primary" to="/shop">
                  Back to Shop
                </Link>
                <Link className="btn btn--ghost" to="/cart">
                  View Cart
                </Link>
              </div>
            </div>
          ) : (
            <form className="checkout__grid" onSubmit={onSubmit} noValidate>
              <h2 id="co-form-h" className="sr-only">
                Delivery and payment
              </h2>

              {/* --- Customer details ---------------------------------- */}
              <fieldset className="checkout__section">
                <legend>Delivery details</legend>
                <div className="checkout__fields">
                  {field('name', 'Full name', { autoComplete: 'name', placeholder: 'Your name' })}
                  {field('phone', 'Phone (mobile)', {
                    type: 'tel',
                    autoComplete: 'tel',
                    inputMode: 'tel',
                    placeholder: '10-digit mobile number',
                  })}
                  {field('email', 'Email (optional)', {
                    type: 'email',
                    autoComplete: 'email',
                    inputMode: 'email',
                    placeholder: 'you@example.com',
                  })}
                  {field('address', 'Address', {
                    autoComplete: 'street-address',
                    placeholder: 'House / building, street, area',
                    full: true,
                  })}
                  {field('city', 'City', { autoComplete: 'address-level2', placeholder: 'City' })}
                  {field('state', 'State', {
                    autoComplete: 'address-level1',
                    placeholder: 'State',
                  })}
                  {field('pincode', 'PIN code', {
                    autoComplete: 'postal-code',
                    inputMode: 'numeric',
                    placeholder: '6-digit PIN',
                  })}
                </div>
              </fieldset>

              {/* --- Payment method ------------------------------------- */}
              <fieldset className="checkout__section">
                <legend>Payment method</legend>
                <div className="pay-options">
                  <label
                    className={`pay-option${method === 'cod' ? ' is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={method === 'cod'}
                      onChange={() => setMethod('cod')}
                    />
                    <span>
                      <strong>Cash on Delivery</strong>
                      <small>Pay when your order arrives. Availability is confirmed for your area with the order.</small>
                    </span>
                  </label>
                  <label
                    className={`pay-option pay-option--disabled${
                      method === 'online' ? ' is-active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={method === 'online'}
                      disabled={!CHECKOUT_CONFIG.onlinePaymentReady}
                      onChange={() => setMethod('online')}
                    />
                    <span>
                      <strong>Online payment</strong>
                      <small>
                        {CHECKOUT_CONFIG.onlinePaymentReady
                          ? `Pay securely via ${CHECKOUT_CONFIG.paymentProvider ?? 'our payment provider'}.`
                          : 'Activating with our verified payment provider — not enabled yet.'}
                      </small>
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* --- Order review --------------------------------------- */}
              <fieldset className="checkout__section checkout__review">
                <legend>Review your order</legend>
                <ul className="review-lines">
                  {lines.map((l) => (
                    <li key={l.key}>
                      <span>
                        {l.product.name}
                        {l.variantLabel ? ` (${l.variantLabel})` : ''} × {l.qty}
                      </span>
                      <span>
                        {l.lineTotal !== null ? formatPrice(l.lineTotal) : <span className="price-tbc">Price TBC</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="review-totals">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>
                      {subtotal !== null ? formatPrice(subtotal) : <span className="price-tbc">To be confirmed</span>}
                    </dd>
                  </div>
                  <div>
                    <dt>Shipping</dt>
                    <dd>Confirmed with your order</dd>
                  </div>
                </dl>
              </fieldset>

              {result && (
                <div
                  className={`checkout__result checkout__result--${result.ok ? 'ok' : 'fail'}`}
                  role="alert"
                >
                  <strong>{result.ok ? 'Order received.' : 'Order not placed.'}</strong>
                  <p>{result.message}</p>
                  {result.ok && (
                    <div className="btn-row">
                      <Link className="btn btn--primary btn--sm" to="/shop">
                        Continue Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="checkout__submit">
                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  disabled={!orderServiceReady || busy}
                >
                  {busy ? 'Placing order…' : 'Place Order'}
                </button>
                {!orderServiceReady && (
                  <p className="fine-print">
                    Submission is disabled until the order service is
                    connected — we never fake order confirmations.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
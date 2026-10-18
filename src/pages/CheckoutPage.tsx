import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../lib/seo'
import { useCart } from '../lib/cart'
import { CONTACT } from '../lib/site'
import { whatsappUrl } from '../lib/whatsapp'
import {
  CHECKOUT_CONFIG,
  placeOrder,
  validateCartForCheckout,
  type PaymentMethod,
  type OrderPayload,
} from '../lib/checkout'
import { formatPrice } from '../lib/products'

/**
 * Checkout â€” the numbered five-step order flow:
 *   1 Shopping bag Â· 2 Delivery address Â· 3 Payment method Â· 4 Order review Â· 5 Send order
 *
 * HONEST STATE
 *  - The configured order handoff is WhatsApp (+91 8450912454). The customer
 *    reviews and sends the prefilled message themselves; opening WhatsApp is
 *    never described as a placed or confirmed order.
 *  - When a real order service is configured (`CHECKOUT_CONFIG.orderApiUrl`)
 *    it is called first and a genuine reference is included in the message.
 *    Without it, no reference is invented.
 *  - Online payment stays disabled until a verified provider is connected
 *    server-side. A successful payment is never simulated.
 */

/** Full checkout address â€” every field is required except where marked optional. */
export interface CustomerForm {
  name: string
  phone: string
  email: string
  houseNo: string
  building: string
  street: string
  area: string
  landmark: string
  city: string
  state: string
  country: string
  pincode: string
  instructions: string
}

const EMPTY_CUSTOMER: CustomerForm = {
  name: '',
  phone: '',
  email: '',
  houseNo: '',
  building: '',
  street: '',
  area: '',
  landmark: '',
  city: '',
  state: 'Madhya Pradesh',
  country: 'India',
  pincode: '',
  instructions: '',
}

type FieldErrors = Partial<Record<keyof CustomerForm, string>>

/** Field descriptor used to render the address grid without repetition. */
interface FieldDef {
  key: keyof CustomerForm
  label: string
  type?: 'text' | 'textarea' | 'select'
  inputMode?: 'text' | 'tel' | 'numeric' | 'email'
  autoComplete?: string
  placeholder?: string
  optional?: boolean
  rows?: number
}

/** The five numbered steps, also used as the in-page step list. */
const STEPS = [
  { id: 'step1-h', n: 1, title: 'Shopping bag' },
  { id: 'step2-h', n: 2, title: 'Delivery address' },
  { id: 'step3-h', n: 3, title: 'Payment method' },
  { id: 'step4-h', n: 4, title: 'Order review' },
  { id: 'step5-h', n: 5, title: 'Send order' },
]

/** States & union territories, alphabetical, so the list stays easy to scan. */
const STATES = [
  'Andaman & Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

const ADDRESS_FIELDS: FieldDef[][] = [
  [
    { key: 'name', label: 'Full name', autoComplete: 'name', placeholder: 'Your full name' },
    {
      key: 'phone',
      label: 'Mobile number',
      inputMode: 'tel',
      autoComplete: 'tel-national',
      placeholder: '10-digit Indian mobile number',
    },
    {
      key: 'email',
      label: 'Email address',
      inputMode: 'email',
      autoComplete: 'email',
      placeholder: 'you@example.com',
      optional: true,
    },
  ],
  [
    { key: 'houseNo', label: 'House / flat number', autoComplete: 'address-line2', placeholder: 'e.g. B-12' },
    { key: 'building', label: 'Building / apartment name', autoComplete: 'address-line1', placeholder: 'e.g. Green Heights' },
  ],
  [
    { key: 'street', label: 'Street / road', autoComplete: 'address-line3', placeholder: 'e.g. MG Road' },
    { key: 'area', label: 'Area / locality', autoComplete: 'address-level3', placeholder: 'e.g. Civil Lines' },
  ],
  [
    { key: 'landmark', label: 'Landmark', autoComplete: 'off', placeholder: 'Opposite the temple', optional: true },
    { key: 'city', label: 'City', autoComplete: 'address-level2', placeholder: 'e.g. Bhopal' },
  ],
  [
    { key: 'state', label: 'State', type: 'select', autoComplete: 'address-level1' },
    { key: 'pincode', label: 'PIN code', inputMode: 'numeric', autoComplete: 'postal-code', placeholder: '6 digits' },
  ],
  [
    { key: 'country', label: 'Country', type: 'select', autoComplete: 'country-name' },
    {
      key: 'instructions',
      label: 'Delivery instructions',
      type: 'textarea',
      rows: 3,
      placeholder: 'Call me on this number, or leave the package with the guard',
      optional: true,
    },
  ],
]

/** Items as carried in the order record / message. */
export interface OrderItem {
  name: string
  variantLabel: string | null
  qty: number
  unitPrice: number | null
  lineTotal: number | null
}

/** Flattened order record used for review + the WhatsApp message. */
export interface OrderRecord {
  orderId?: string
  /** Matches `CustomerInfo` in lib/checkout so it can be posted verbatim. */
  customer: {
    name: string
    phone: string
    email: string
    address: string
    city: string
    state: string
    pincode: string
  }
  items: OrderItem[]
  subtotal: number | null
  deliveryCharge: number | null
  total: number | null
  paymentMethod: PaymentMethod
}

/** Join the entered address into one readable line. */
export function formatAddress(form: CustomerForm): string {
  return [
    form.houseNo,
    form.building,
    form.street,
    form.area,
    form.landmark ? `(near ${form.landmark})` : '',
    form.city,
    form.state,
    form.pincode ? `PIN ${form.pincode}` : '',
    form.country,
  ]
    .filter((p) => p.trim().length > 0)
    .join(', ')
}

function customerForOrder(form: CustomerForm): OrderRecord['customer'] {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    address: formatAddress(form),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.trim(),
  }
}

function paymentLabel(method: PaymentMethod): string {
  return method === 'cod'
    ? 'Cash on Delivery'
    : `Online payment via ${CHECKOUT_CONFIG.paymentProvider ?? 'the payment provider'}`
}

/** Inline validation. One message per invalid field; entered values are never cleared. */
export function validateCheckout(form: CustomerForm): FieldErrors {
  const issues: FieldErrors = {}

  if (form.name.trim().length < 2) issues.name = 'Please enter your full name.'

  const digits = form.phone.replace(/[\s-]/g, '')
  if (!/^[6-9]\d{9}$/.test(digits)) {
    issues.phone = 'Enter a valid 10-digit Indian mobile number (starting 6-9).'
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    issues.email = 'Enter a valid email address, or leave this blank.'
  }

  const required: { key: keyof CustomerForm; label: string }[] = [
    { key: 'houseNo', label: 'your house / flat number' },
    { key: 'building', label: 'the building or apartment name' },
    { key: 'street', label: 'the street or road' },
    { key: 'area', label: 'the area or locality' },
    { key: 'city', label: 'your city' },
    { key: 'state', label: 'your state' },
  ]
  for (const r of required) {
    if (form[r.key].trim().length < 2) issues[r.key] = `Please enter ${r.label}.`
  }

  const pin = form.pincode.trim()
  if (!pin) issues.pincode = 'Please enter your 6-digit PIN code.'
  else if (!/^\d{6}$/.test(pin)) issues.pincode = 'Enter a valid 6-digit PIN code (digits only).'

  return issues
}

/** Build the prefilled WhatsApp order message. The caller URL-encodes it. */
export function buildOrderMessage(record: OrderRecord): string {
  const itemLines = record.items.map((item) => {
    const name = item.variantLabel ? `${item.name} (${item.variantLabel})` : item.name
    return `- ${name} x ${item.qty} x ${formatPrice(item.unitPrice ?? 0)} = ${formatPrice(item.lineTotal ?? 0)}`
  })

  return [
    'Namaste CIVIM GRAINS,',
    '',
    `Order ref: ${record.orderId ?? 'to be assigned on confirmation'}`,
    '',
    'Customer',
    `Name: ${record.customer.name}`,
    `Mobile: ${record.customer.phone}`,
    `Email: ${record.customer.email || '-'}`,
    'Delivery address',
    record.customer.address,
    '',
    'Items',
    ...itemLines,
    '',
    `Subtotal: ${formatPrice(record.subtotal ?? 0)}`,
    ...(record.deliveryCharge !== null ? [`Delivery: ${formatPrice(record.deliveryCharge)}`] : []),
    `Total: ${formatPrice(record.total ?? 0)}`,
    `Payment: ${paymentLabel(record.paymentMethod)}`,
    '',
    'Please confirm this order and share the delivery timeline. Thank you.',
  ].join('\n')
}

export function CheckoutPage() {
  const { lines, subtotal, hasUnpriced, setQty, remove, clear } = useCart()

  const [customer, setCustomer] = useState<CustomerForm>(EMPTY_CUSTOMER)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [method, setMethod] = useState<PaymentMethod>('cod')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string; orderId?: string } | null>(null)
  /** Set once validation passes and the order is ready for the WhatsApp handoff. */
  const [handoff, setHandoff] = useState<OrderRecord | null>(null)
  /** True once WhatsApp has actually been opened with the prefilled message. */
  const [waOpened, setWaOpened] = useState(false)

  const cartBlock = validateCartForCheckout(lines, hasUnpriced)
  const orderServiceReady = CHECKOUT_CONFIG.orderApiUrl !== null
  const onlineReady = CHECKOUT_CONFIG.onlinePaymentReady
  const deliveryCharge = CHECKOUT_CONFIG.deliveryCharge ?? null
  const canCheckout = lines.length > 0 && !hasUnpriced
  const finalTotal = deliveryCharge !== null ? (subtotal ?? 0) + deliveryCharge : subtotal

  const setField =
    (key: keyof CustomerForm) =>
    (value: string): void => {
      setCustomer((c) => ({ ...c, [key]: value }))
      setErrors((e) => ({ ...e, [key]: undefined }))
    }

  const focusFirstError = (issues: FieldErrors): void => {
    const first = (Object.keys(issues) as (keyof CustomerForm)[])[0]
    if (first) document.getElementById(`co-${first}`)?.focus()
  }

  const buildItems = (): OrderItem[] =>
    lines.map((l) => ({
      name: l.product.name,
      variantLabel: l.variantLabel,
      qty: l.qty,
      unitPrice: l.unitPrice,
      lineTotal: l.lineTotal,
    }))

  /**
   * Step 5 â€” validate everything, create a genuine order when a service is
   * configured, then present the completed order for the WhatsApp handoff.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canCheckout) return

    const issues = validateCheckout(customer)
    if (Object.keys(issues).length > 0) {
      setErrors(issues)
      focusFirstError(issues)
      document.getElementById('step2-h')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (method === 'online' && !onlineReady) {
      setResult({
        ok: false,
        message:
          'Online payment is not enabled yet, so no payment can be taken. Please choose Cash on Delivery, or contact us to confirm your order.',
      })
      return
    }

    setBusy(true)
    setResult(null)
    setWaOpened(false)

    // A real order reference only when the configured order service returns one.
    let orderId: string | undefined
    if (orderServiceReady) {
      const payload: OrderPayload = {
        items: lines.map((l) => ({ slug: l.slug, variantId: l.variantId, qty: l.qty, unitPrice: l.unitPrice })),
        customer: customerForOrder(customer),
        paymentMethod: method,
        subtotal,
      }
      const response = await placeOrder(payload)
      if (!response.ok) {
        setBusy(false)
        setResult(response)
        return
      }
      orderId = response.orderId
    }

    setBusy(false)
    setHandoff({
      orderId,
      customer: customerForOrder(customer),
      items: buildItems(),
      subtotal,
      deliveryCharge,
      total: finalTotal,
      paymentMethod: method,
    })
  }

  /** Open WhatsApp with the prefilled, URL-encoded order message. */
  const sendViaWhatsApp = (): void => {
    if (!handoff) return
    const win = window.open(whatsappUrl(buildOrderMessage(handoff)), '_blank', 'noopener,noreferrer')
    setWaOpened(true)
    if (!win) {
      setResult({
        ok: false,
        message: `WhatsApp could not be opened. Please call us on ${CONTACT.phoneDisplay} and we will take your order directly.`,
      })
    }
  }

  /** The cart is cleared only after the customer confirms they sent the order. */
  const confirmSent = (): void => {
    clear()
    setHandoff(null)
    setCustomer(EMPTY_CUSTOMER)
    setErrors({})
    setWaOpened(false)
    setResult({
      ok: true,
      message:
        'Thank you. Your order request has been sent to CIVIM GRAINS on WhatsApp. It is confirmed once our team replies to you â€” nothing has been charged or guaranteed yet.',
    })
  }


  return (
    <>
      <Seo
        title="Checkout — CIVIM GRAINS"
        description="Complete your CIVIM GRAINS order: delivery address, payment method and order review, then send your order to us on WhatsApp."
        path="/checkout"
        noindex
      />

      <section className="section page-hero page-hero--tight" aria-labelledby="checkout-h">
        <div className="shell narrow">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li aria-current="page">Checkout</li>
            </ol>
          </nav>
          <span className="eyebrow">Secure your order</span>
          <h1 id="checkout-h">
            Check<em>out.</em>
          </h1>
          <p className="lede">
            Five quick steps: review your bag, add your delivery address, choose how you
            would like to pay, check the summary, then send your order to us.
          </p>
        </div>
      </section>


      <section className="section page-section page-section--flush" aria-label="Checkout steps">
        <div className="shell checkout">
          <ol className="co-steps">
            {STEPS.map((s) => (
              <li key={s.id}>
                <span className="co-steps__n" aria-hidden="true">
                  {s.n}
                </span>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>


          {cartBlock && (
            <div className="checkout__notice" role="status">
              <strong>
                {lines.length === 0 ? 'Your shopping bag is empty.' : 'Checkout is not available yet.'}
              </strong>
              <p>{cartBlock}</p>
              <div className="btn-row">
                <Link className="btn btn--primary btn--sm" to="/shop">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}

          <div className="checkout__layout">
            <form className="checkout__grid" onSubmit={handleSubmit} noValidate>


              <section className="checkout__section" aria-labelledby="step1-h">
                <h2 id="step1-h" className="checkout__legend">
                  <span className="checkout__n" aria-hidden="true">
                    1
                  </span>
                  Shopping bag
                </h2>

                {lines.length === 0 ? (
                  <p className="checkout__empty">
                    Nothing here yet. Add a product from the <Link to="/shop">shop</Link> to
                    continue.
                  </p>
                ) : (
                  <ul className="co-bag">
                    {lines.map((line) => (
                      <li className="co-bag__row" key={line.key}>
                        <div className="co-bag__media">
                          {line.product.image ? (
                            <img
                              src={line.product.image}
                              alt={line.product.imageAlt ?? line.product.name}
                              width={88}
                              height={176}
                              loading="lazy"
                            />
                          ) : (
                            <span className="co-bag__placeholder" aria-hidden="true">
                              CIVIM
                            </span>
                          )}
                        </div>

                        <div className="co-bag__info">
                          <h3>
                            <Link to={`/shop/${line.slug}`}>{line.product.name}</Link>
                          </h3>
                          {line.variantLabel && (
                            <p className="co-bag__variant">{line.variantLabel}</p>
                          )}
                          <p className="co-bag__unit">
                            {line.unitPrice !== null
                              ? `${formatPrice(line.unitPrice)} each`
                              : 'Price to be confirmed'}
                          </p>
                        </div>

                        <div className="co-bag__qty">
                          <label className="sr-only" htmlFor={`co-qty-${line.key}`}>
                            Quantity for {line.product.name}
                          </label>
                          <div className="qty-stepper qty-stepper--sm">
                            <button
                              type="button"
                              onClick={() => setQty(line.key, line.qty - 1)}
                              aria-label={`Decrease quantity of ${line.product.name}`}
                            >
                              &minus;
                            </button>
                            <input
                              id={`co-qty-${line.key}`}
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
                            className="co-bag__remove"
                            onClick={() => remove(line.key)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="co-bag__total">
                          {line.lineTotal !== null ? formatPrice(line.lineTotal) : '—'}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="checkout__section" aria-labelledby="step2-h">
                <h2 id="step2-h" className="checkout__legend">
                  <span className="checkout__n" aria-hidden="true">
                    2
                  </span>
                  Delivery address
                </h2>

                <div className="checkout__fields">
                  {ADDRESS_FIELDS.map((group, gi) => (
                    <div className="checkout__field-row" key={gi}>
                      {group.map((f) => (
                        <div className="field" key={f.key}>
                          <label htmlFor={`co-${f.key}`}>
                            {f.label}
                            {f.optional && <span className="opt"> (optional)</span>}
                          </label>

                          {f.type === 'select' ? (
                            <select
                              id={`co-${f.key}`}
                              value={customer[f.key]}
                              onChange={(e) => setField(f.key)(e.target.value)}
                              aria-invalid={Boolean(errors[f.key])}
                              aria-describedby={errors[f.key] ? `co-${f.key}-err` : undefined}
                              autoComplete={f.autoComplete}
                            >
                              {f.key === 'country' ? (
                                <option value="India">India</option>
                              ) : (
                                STATES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))
                              )}
                            </select>
                          ) : f.type === 'textarea' ? (
                            <textarea
                              id={`co-${f.key}`}
                              rows={f.rows ?? 3}
                              value={customer[f.key]}
                              onChange={(e) => setField(f.key)(e.target.value)}
                              aria-invalid={Boolean(errors[f.key])}
                              aria-describedby={errors[f.key] ? `co-${f.key}-err` : undefined}
                              placeholder={f.placeholder}
                            />
                          ) : (
                            <input
                              id={`co-${f.key}`}
                              type="text"
                              inputMode={f.inputMode}
                              value={customer[f.key]}
                              onChange={(e) => setField(f.key)(e.target.value)}
                              aria-invalid={Boolean(errors[f.key])}
                              aria-describedby={errors[f.key] ? `co-${f.key}-err` : undefined}
                              autoComplete={f.autoComplete}
                              placeholder={f.placeholder}
                              maxLength={f.key === 'pincode' ? 6 : undefined}
                            />
                          )}

                          {errors[f.key] && (
                            <p className="field__error" id={`co-${f.key}-err`}>
                              {errors[f.key]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <p className="checkout__address-note">
                  We confirm delivery to your PIN code during order processing — no delivery
                  date is promised on this page. Your details are used only to process and
                  deliver this order.
                </p>
              </section>

              <section className="checkout__section" id="payment" aria-labelledby="step3-h">
                <h2 id="step3-h" className="checkout__legend">
                  <span className="checkout__n" aria-hidden="true">
                    3
                  </span>
                  Payment method
                </h2>

                <div className="pay-options">
                  <label className={`pay-option${method === 'cod' ? ' is-active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={method === 'cod'}
                      onChange={() => setMethod('cod')}
                    />
                    <span>
                      <strong>Cash on Delivery</strong>
                      <small>
                        Pay in cash when your order arrives. Nothing is charged online.
                      </small>
                    </span>
                  </label>

                  <label
                    className={`pay-option${method === 'online' ? ' is-active' : ''}${
                      !onlineReady ? ' pay-option--disabled' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={method === 'online'}
                      disabled={!onlineReady}
                      onChange={() => setMethod('online')}
                    />
                    <span>
                      <strong>Online payment</strong>
                      <small>
                        {onlineReady
                          ? `Pay through ${CHECKOUT_CONFIG.paymentProvider}.`
                          : 'Not enabled yet — our verified payment provider is still being connected. Cash on Delivery is available in the meantime.'}
                      </small>
                    </span>
                  </label>
                </div>
              </section>


              <section className="checkout__section" aria-labelledby="step4-h">
                <h2 id="step4-h" className="checkout__legend">
                  <span className="checkout__n" aria-hidden="true">
                    4
                  </span>
                  Order review
                </h2>

                <ul className="review-lines">
                  {lines.map((line) => (
                    <li key={line.key}>
                      <span>
                        {line.product.name}
                        {line.variantLabel ? ` — ${line.variantLabel}` : ''} &times; {line.qty}
                      </span>
                      <span>
                        {line.lineTotal !== null
                          ? formatPrice(line.lineTotal)
                          : 'To be confirmed'}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="review-totals">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{subtotal !== null ? formatPrice(subtotal) : 'To be confirmed'}</dd>
                  </div>
                  {deliveryCharge !== null && (
                    <div>
                      <dt>Delivery charge</dt>
                      <dd>{formatPrice(deliveryCharge)}</dd>
                    </div>
                  )}
                  <div className="review-totals__final">
                    <dt>Total</dt>
                    <dd>
                      {finalTotal !== null ? formatPrice(finalTotal) : 'To be confirmed'}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="checkout__section" aria-labelledby="step5-h">
                <h2 id="step5-h" className="checkout__legend">
                  <span className="checkout__n" aria-hidden="true">
                    5
                  </span>
                  Send order
                </h2>

                <p className="checkout__disclosure">
                  Your name, mobile number and full delivery address above will be shared
                  with <strong>CIVIM GRAINS</strong> so we can process and deliver this
                  order. Continuing opens WhatsApp with your complete order prefilled — you
                  review it and send it yourself on {CONTACT.phoneDisplay}.
                </p>

                {!orderServiceReady && (
                  <p className="checkout__config-note" role="status">
                    Order records are normally created on our own order service, which is
                    still being connected. Until it is live, your order reference is
                    assigned by our team when they confirm your WhatsApp message.
                  </p>
                )}

                <div className="checkout__submit">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={!canCheckout || busy}
                  >
                    {busy ? 'Preparing your order…' : 'Review & send order on WhatsApp'}
                  </button>
                  <Link className="btn btn--ghost" to="/shop">
                    Continue Shopping
                  </Link>
                </div>
              </section>
            </form>

            <aside className="checkout__aside" aria-labelledby="co-summary-h">
              <h2 id="co-summary-h">Order summary</h2>

              <ul className="co-summary__items">
                {lines.map((line) => (
                  <li key={line.key}>
                    <span>
                      {line.product.name}
                      {line.variantLabel ? ` · ${line.variantLabel}` : ''} &times; {line.qty}
                    </span>
                    <span>
                      {line.lineTotal !== null ? formatPrice(line.lineTotal) : 'TBC'}
                    </span>
                  </li>
                ))}
                {lines.length === 0 && <li className="co-summary__empty">No items yet</li>}
              </ul>

              <dl className="co-summary__totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{subtotal !== null ? formatPrice(subtotal) : 'To be confirmed'}</dd>
                </div>
                {deliveryCharge !== null && (
                  <div>
                    <dt>Delivery</dt>
                    <dd>{formatPrice(deliveryCharge)}</dd>
                  </div>
                )}
                <div className="co-summary__final">
                  <dt>Total payable</dt>
                  <dd>
                    {finalTotal !== null ? formatPrice(finalTotal) : 'To be confirmed'}
                  </dd>
                </div>
              </dl>

              <p className="co-summary__note">
                Payment: {paymentLabel(method)}. Delivery charges and timelines are
                confirmed by our team when they accept your order.
              </p>

              <dl className="co-summary__address">
                <dt>Delivering to</dt>
                <dd>
                  {customer.name.trim() || customer.houseNo.trim() || customer.city.trim() ? (
                    <>
                      {customer.name.trim() && <strong>{customer.name.trim()}</strong>}
                      <br />
                      {formatAddress(customer)}
                    </>
                  ) : (
                    <span className="co-summary__pending">Add your address in step 2.</span>
                  )}
                </dd>
              </dl>
            </aside>
          </div>

          {handoff && (
            <div className="checkout__handoff" role="dialog" aria-labelledby="co-handoff-h">
              <h2 id="co-handoff-h">Review your order, then send it on WhatsApp</h2>

              <p className="checkout__disclosure">
                The order details below will be shared with CIVIM GRAINS on{' '}
                {CONTACT.phoneDisplay}. Continuing opens WhatsApp with the message already
                written for you — please read it and press send. Nothing is sent
                automatically.
              </p>

              <div className="co-handoff__msg">
                <pre>{buildOrderMessage(handoff)}</pre>
              </div>

              <div className="btn-row">
                <button type="button" className="btn btn--primary" onClick={sendViaWhatsApp}>
                  Open WhatsApp &amp; send order
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setHandoff(null)}
                >
                  Edit my details
                </button>
              </div>

              {waOpened && (
                <div className="checkout__after" role="status">
                  <p>
                    WhatsApp has opened with your order. Your order is confirmed only when
                    CIVIM GRAINS replies to your message — opening or sending WhatsApp is
                    not itself an order confirmation.
                  </p>
                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={confirmSent}
                    >
                      I have sent the order
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={sendViaWhatsApp}
                    >
                      Open WhatsApp again
                    </button>
                  </div>
                </div>
              )}

              <p className="checkout__config-note">
                If WhatsApp does not open, call us on{' '}
                <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> and we will take your
                order directly.
              </p>
            </div>
          )}

          {result && (
            <div
              className={`checkout__result checkout__result--${result.ok ? 'ok' : 'fail'}`}
              role="alert"
            >
              <strong>{result.ok ? 'Order request sent.' : 'Order not placed.'}</strong>
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
        </div>
      </section>
    </>
  )
}

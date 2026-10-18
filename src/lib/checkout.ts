/**
 * Checkout / order integration layer.
 *
 * HONEST STATUS: no backend or payment provider is connected yet. This module
 * is the single integration point — the checkout UI calls `placeOrder()` and
 * only ever reports success when the configured order service actually
 * returns one. No payment is ever simulated, and no order is ever marked
 * confirmed without a real server response.
 *
 * TODO(LAUNCH) — required before real orders are accepted:
 *   1. Set `orderApiUrl` to a server endpoint that creates orders
 *      (e.g. POST /api/orders → { orderId, status }).
 *   2. For online payments, register a verified provider (Razorpay/Stripe/
 *      Cashfree etc.) with keys held SERVER-SIDE only — never in this bundle.
 *      The server creates the payment order; the client only handles the
 *      checkout handshake; the server verifies the signature/webhook before
 *      an order is marked paid.
 *   3. Cash on Delivery must hit the same order API — the server decides
 *      whether COD is allowed for the pincode.
 */
import type { ResolvedLine } from './cart'

export type PaymentMethod = 'online' | 'cod'

export const CHECKOUT_CONFIG = {
  /** Server endpoint that creates genuine orders. null = not connected. */
  orderApiUrl: null as string | null,
  /** Verified payment provider name once integrated (e.g. 'Razorpay'). */
  paymentProvider: null as string | null,
  /** Online payment is offered only after a provider is connected. */
  onlinePaymentReady: false,
  /** COD availability — enforced server-side once the backend exists. */
  codAvailable: true,
  /**
   * Delivery charge in ₹ once configured. null = no fixed charge; the
   * checkout then shows no delivery fee and the customer is told delivery
   * options are confirmed during order processing.
   */
  deliveryCharge: null as number | null,
} as const

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface OrderPayload {
  items: {
    slug: string
    variantId: string | null
    qty: number
    unitPrice: number | null
  }[]
  customer: CustomerInfo
  paymentMethod: PaymentMethod
  subtotal: number | null
}

export interface PlaceOrderResult {
  ok: boolean
  /** Customer-safe message — never claims success without a server response. */
  message: string
  orderId?: string
}

interface FieldIssue {
  field: keyof CustomerInfo
  message: string
}

const PHONE_RE = /^[6-9]\d{9}$/
const PINCODE_RE = /^\d{6}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validate the checkout form. Returns one issue per invalid field. */
export function validateCustomer(c: CustomerInfo): FieldIssue[] {
  const issues: FieldIssue[] = []
  if (c.name.trim().length < 2) issues.push({ field: 'name', message: 'Please enter your full name.' })
  if (!PHONE_RE.test(c.phone.replace(/\s+/g, '')))
    issues.push({ field: 'phone', message: 'Enter a valid 10-digit Indian mobile number.' })
  if (c.email.trim() && !EMAIL_RE.test(c.email.trim()))
    issues.push({ field: 'email', message: 'Enter a valid email address (or leave it blank).' })
  if (c.address.trim().length < 10)
    issues.push({ field: 'address', message: 'Please enter your full shipping address.' })
  if (c.city.trim().length < 2) issues.push({ field: 'city', message: 'Please enter your city.' })
  if (c.state.trim().length < 2) issues.push({ field: 'state', message: 'Please enter your state.' })
  if (!PINCODE_RE.test(c.pincode.trim()))
    issues.push({ field: 'pincode', message: 'Enter a valid 6-digit PIN code.' })
  return issues
}

export function validateCartForCheckout(
  lines: ResolvedLine[],
  hasUnpriced: boolean,
): string | null {
  if (lines.length === 0) return 'Your cart is empty.'
  if (hasUnpriced)
    return 'Some items do not have a confirmed price yet, so checkout is disabled for them. Please contact us to confirm pricing before ordering.'
  return null
}

/**
 * Attempt to place a genuine order through the configured backend.
 * Returns an honest failure when no backend is configured — the caller must
 * show it verbatim and must NOT display any confirmation.
 */
export async function placeOrder(payload: OrderPayload): Promise<PlaceOrderResult> {
  if (!CHECKOUT_CONFIG.orderApiUrl) {
    return {
      ok: false,
      message:
        'Online ordering is not connected yet — no order has been placed. Our team can take your order directly in the meantime.',
    }
  }
  if (payload.paymentMethod === 'online' && !CHECKOUT_CONFIG.onlinePaymentReady) {
    return {
      ok: false,
      message: 'Online payment is not enabled yet — no order has been placed.',
    }
  }
  try {
    const res = await fetch(CHECKOUT_CONFIG.orderApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => null)) as
      | { orderId?: string; status?: string; message?: string }
      | null
    if (!res.ok || !data?.orderId) {
      return {
        ok: false,
        message:
          data?.message ??
          'The order service could not accept your order — nothing was placed. Please try again or contact us.',
      }
    }
    return {
      ok: true,
      orderId: data.orderId,
      message: `Order received (reference ${data.orderId}). Payment/confirmation follows from the order service.`,
    }
  } catch {
    return {
      ok: false,
      message:
        'Could not reach the order service — no order has been placed. Please check your connection and try again.',
    }
  }
}
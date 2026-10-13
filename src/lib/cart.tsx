import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { findProduct, unitPrice, type Product } from './products'

/**
 * Client-side cart with persistent state (localStorage).
 *
 * Integrity rules:
 *   - A line references catalogue data only (slug + optional variant id) —
 *     prices are always re-derived from PRODUCTS, so stale/fake prices can
 *     never be persisted or silently applied.
 *   - Lines whose product no longer exists are dropped on load.
 *   - `null` unit prices surface as "price to be confirmed" and block
 *     checkout — never substituted with a number.
 */
export interface CartLine {
  slug: string
  variantId: string | null
  qty: number
}

export interface ResolvedLine extends CartLine {
  key: string
  product: Product
  variantLabel: string | null
  unitPrice: number | null
  lineTotal: number | null
}

interface CartContextValue {
  lines: ResolvedLine[]
  count: number
  subtotal: number | null
  /** true when any line has no confirmed price → checkout must stay blocked. */
  hasUnpriced: boolean
  add: (slug: string, variantId?: string | null, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  /** "Added" feedback for product cards (transient flag). */
  lastAdded: string | null
}

const STORAGE_KEY = 'civim-cart-v1'
const CartContext = createContext<CartContextValue | null>(null)

export function lineKey(slug: string, variantId?: string | null): string {
  return `${slug}::${variantId ?? ''}`
}

function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return []
  const out: CartLine[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const { slug, variantId, qty } = item as Record<string, unknown>
    if (typeof slug !== 'string' || !findProduct(slug)) continue
    const q = typeof qty === 'number' && Number.isFinite(qty) ? Math.min(99, Math.max(1, Math.floor(qty))) : 1
    out.push({
      slug,
      variantId: typeof variantId === 'string' && variantId ? variantId : null,
      qty: q,
    })
  }
  return out
}

function loadStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return sanitize(JSON.parse(raw))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(() => loadStored())
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw))
    } catch {
      /* storage unavailable (private mode) — cart still works in-memory */
    }
  }, [raw])

  // "Added" toast flag resets after a moment.
  useEffect(() => {
    if (!lastAdded) return
    const t = window.setTimeout(() => setLastAdded(null), 2200)
    return () => window.clearTimeout(t)
  }, [lastAdded])

  const add = useCallback((slug: string, variantId?: string | null, qty = 1) => {
    if (!findProduct(slug)) return
    const vid = variantId ?? null
    setRaw((prev) => {
      const key = lineKey(slug, vid)
      const existing = prev.find((l) => lineKey(l.slug, l.variantId) === key)
      if (existing) {
        return prev.map((l) =>
          lineKey(l.slug, l.variantId) === key
            ? { ...l, qty: Math.min(99, l.qty + qty) }
            : l,
        )
      }
      return [...prev, { slug, variantId: vid, qty: Math.min(99, Math.max(1, qty)) }]
    })
    setLastAdded(slug)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) => {
      if (qty < 1) return prev.filter((l) => lineKey(l.slug, l.variantId) !== key)
      return prev.map((l) =>
        lineKey(l.slug, l.variantId) === key ? { ...l, qty: Math.min(99, qty) } : l,
      )
    })
  }, [])

  const remove = useCallback((key: string) => {
    setRaw((prev) => prev.filter((l) => lineKey(l.slug, l.variantId) !== key))
  }, [])

  const clear = useCallback(() => setRaw([]), [])

  const lines = useMemo<ResolvedLine[]>(() => {
    return raw.flatMap((l) => {
      const product = findProduct(l.slug)
      if (!product) return []
      const variant = l.variantId
        ? product.variants?.find((v) => v.id === l.variantId)
        : undefined
      if (l.variantId && product.variants && !variant) return [] // stale variant
      const price = unitPrice(product, l.variantId)
      return [
        {
          key: lineKey(l.slug, l.variantId),
          slug: l.slug,
          variantId: l.variantId,
          qty: l.qty,
          product,
          variantLabel: variant?.label ?? null,
          unitPrice: price,
          lineTotal: price === null ? null : price * l.qty,
        },
      ]
    })
  }, [raw])

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines])

  const subtotal = useMemo(() => {
    if (lines.length === 0) return 0
    if (lines.some((l) => l.lineTotal === null)) return null // unknown until all priced
    return lines.reduce<number>((n, l) => n + (l.lineTotal ?? 0), 0)
  }, [lines])

  const hasUnpriced = useMemo(() => lines.some((l) => l.unitPrice === null), [lines])

  const value = useMemo<CartContextValue>(
    () => ({ lines, count, subtotal, hasUnpriced, add, setQty, remove, clear, lastAdded }),
    [lines, count, subtotal, hasUnpriced, add, setQty, remove, clear, lastAdded],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
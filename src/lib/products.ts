/**
 * Real CIVIM GRAINS catalogue — maintainable product data model.
 *
 * Honesty rules (do not violate):
 *   - `price` stays `null` until a real price is supplied. null renders as
 *     "Price to be confirmed" — never invent or backfill numbers.
 *   - `variants` only exist when actual pack sizes are confirmed.
 *   - `specs` only hold verified label/company facts.
 *   - `stock: 'unknown'` until connected to real inventory; it renders as a
 *     neutral "contact us" state, never a fake "In stock".
 *   - `image: null` renders a clean placeholder (never fabricated packaging).
 *
 * Add products by appending to PRODUCTS — cards, filters, carousels, product
 * pages, cart and sitemap pick them up automatically.
 */
export type Category = 'Mustard Oil' | 'Rice' | 'Wheat Flour' | 'Multigrain Flour' | 'Pulses'

/** Coarser grouping used by the "Shop by staple" home sections. */
export type CategoryGroup = 'Mustard Oil' | 'Rice' | 'Flours' | 'Pulses'

export interface ProductImage {
  src: string
  alt: string
}

/** A real pack variant. `price: null` = price not yet confirmed. */
export interface ProductVariant {
  id: string
  label: string
  price: number | null
}

/** Verified specification (label copy or confirmed company data) only. */
export interface ProductSpec {
  label: string
  value: string
}

export interface ProductFaq {
  q: string
  a: string
}

export type StockState = 'unknown' | 'in' | 'out'

export interface Product {
  slug: string
  name: string
  category: Category
  /** Verified, supportable description only. */
  description: string
  /** Extra verified detail (e.g. a claim printed on the pack). */
  detail?: string
  /** Real asset path in /public, or null → placeholder tile. */
  image: string | null
  imageAlt?: string
  /** Additional genuine images (gallery) — none until supplied. */
  images?: ProductImage[]
  featured?: boolean
  /** Base price in ₹ (INR). null → "Price to be confirmed". */
  price: number | null
  /** Confirmed pack sizes, when available. */
  variants?: ProductVariant[]
  /** Verified specs only. */
  specs?: ProductSpec[]
  /** Product-specific FAQs. */
  faqs?: ProductFaq[]
  /** Inventory state — 'unknown' until a real inventory source exists. */
  stock: StockState
}

export const CATEGORIES: { name: Category | 'All'; blurb: string }[] = [
  { name: 'All', blurb: 'The full CIVIM GRAINS range.' },
  { name: 'Mustard Oil', blurb: '100% Pure Mustard Oil for everyday cooking.' },
  { name: 'Rice', blurb: 'Everyday rice varieties for daily meals and special dishes.' },
  { name: 'Wheat Flour', blurb: 'Sharbati and Lokwan wheat flours for daily rotis.' },
  { name: 'Multigrain Flour', blurb: 'Wheat-free multigrain flour for varied rotis.' },
  { name: 'Pulses', blurb: 'Essential dals and pulses for the Indian kitchen.' },
]

export const PRODUCTS: Product[] = [
  {
    slug: 'mustard-oil',
    name: '100% Pure Mustard Oil',
    category: 'Mustard Oil',
    description:
      'CIVIM GRAINS Mustard Oil brings a familiar ingredient to everyday Indian cooking. Use it in suitable traditional recipes, including sabzis, curries, pickles and other dishes where mustard oil is preferred. The product label identifies it as mustard oil and states “Cold Pressed”. Please refer to the actual product label for the complete ingredient, storage and other product information.',
    detail: 'Pack label (as printed): mustard oil, “Cold Pressed”',
    image: '/bottle-front.png',
    imageAlt:
      'CIVIM Grains Cold Pressed Mustard Oil bottle — red cap, yellow collar, amber oil and front label',
    featured: true,
    price: 280,
    variants: [
      { id: '1l', label: '1 litre', price: 280 },
      { id: '2l', label: '2 litres', price: 560 },
      { id: '3l', label: '3 litres', price: 840 },
    ],
    stock: 'unknown',
    specs: [
      { label: 'Product', value: 'CIVIM GRAINS Mustard Oil (sold as “100% Pure Mustard Oil”)' },
      { label: 'Label claim', value: 'Cold Pressed (as printed on the pack)' },
      { label: 'Pack sizes', value: '1 litre · 2 litres · 3 litres' },
      { label: 'Price', value: '₹280 per 1 litre' },
      { label: 'Brand', value: 'CIVIM GRAINS' },
      { label: 'Ingredients, nutrition & storage', value: 'See the physical pack label — not reproduced here' },
    ],
    faqs: [
      {
        q: 'What does “Cold Pressed” on the label mean?',
        a: 'Cold Pressed is the claim printed on our pack and generally refers to oil drawn without added high heat. For batch or process details, contact us with the batch code from your pack.',
      },
      {
        q: 'What pack sizes and prices are available online?',
        a: '1 litre = ₹280, 2 litres = ₹560 and 3 litres = ₹840. Contact us to confirm current availability before ordering.',
      },
      {
        q: 'What can I cook with it?',
        a: 'Mustard oil is traditionally used in sabzis, curries, pickles and other dishes where its flavour is preferred. Please refer to the actual product label for the definitive information about the product.',
      },
      {
        q: 'How should I store the oil?',
        a: 'We do not reproduce storage instructions here because they must match your pack label exactly. Please follow the storage instructions printed on the label. As a general practice for any cooking oil, keep it away from direct sunlight with the cap closed tightly after use.',
      },
      {
        q: 'Is it organic or chemical-free?',
        a: 'We do not make those claims, because they are not verified on the label for this product. The label identifies the product as mustard oil and states “Cold Pressed”.',
      },
    ],
  },
  {
    slug: 'ponni-rice',
    name: 'Ponni Rice',
    category: 'Rice',
    description:
      'Rice for everyday meals. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
    price: null,
    stock: 'unknown',
  },
  {
    slug: 'basmati-rice',
    name: 'Basmati Rice',
    category: 'Rice',
    description:
      'Long-grain rice for biryanis, pulao and festive meals. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
    price: null,
    stock: 'unknown',
  },
  {
    slug: 'sona-masoori-rice',
    name: 'Sona Masoori Rice',
    category: 'Rice',
    description:
      'A light, everyday rice for daily cooking. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
    price: null,
    stock: 'unknown',
  },
  {
    slug: 'sharbati-wheat-flour',
    name: 'Sharbati Wheat Flour',
    category: 'Wheat Flour',
    description:
      'Wheat flour for soft daily rotis. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
    price: null,
    stock: 'unknown',
  },
  {
    slug: 'lokwan-wheat-flour',
    name: 'Lokwan Wheat Flour',
    category: 'Wheat Flour',
    description:
      'Wheat flour for everyday rotis and parathas. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
    price: null,
    stock: 'unknown',
  },
  {
    slug: 'multigrain-flour-without-wheat',
    name: 'Multigrain Flour Without Wheat',
    category: 'Multigrain Flour',
    description:
      'A wheat-free multigrain flour for varied rotis. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
    price: null,
    stock: 'unknown',
  },
  {
    slug: 'pulses-and-dals',
    name: 'Pulses & Dals',
    category: 'Pulses',
    description:
      'Essential dals and pulses for everyday Indian kitchens. Contact CIVIM GRAINS for the current range, pack sizes and prices.',
    image: null,
    price: null,
    stock: 'unknown',
  },
]

export function productsByCategory(cat: Category | 'All'): Product[] {
  if (cat === 'All') return PRODUCTS
  return PRODUCTS.filter((p) => p.category === cat)
}

export function findProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function categoryGroup(cat: Category): CategoryGroup {
  if (cat === 'Wheat Flour' || cat === 'Multigrain Flour') return 'Flours'
  return cat
}

export function productsByGroup(group: CategoryGroup): Product[] {
  return PRODUCTS.filter((p) => categoryGroup(p.category) === group)
}

export function featuredProducts(): Product[] {
  const featured = PRODUCTS.filter((p) => p.featured)
  return featured.length > 0 ? featured : PRODUCTS.slice(0, 4)
}

/** Group-level copy for the home "Shop by staple" sections. */
export const STAPLE_GROUPS: {
  group: CategoryGroup
  title: string
  blurb: string
  to: string
}[] = [
  {
    group: 'Rice',
    title: 'Rice',
    blurb: 'Ponni, Basmati and Sona Masoori for everyday meals and celebration dishes.',
    to: '/shop?category=Rice',
  },
  {
    group: 'Flours',
    title: 'Flours',
    blurb: 'Sharbati and Lokwan wheat flours plus a wheat-free multigrain flour.',
    to: '/shop?category=Wheat%20Flour',
  },
  {
    group: 'Pulses',
    title: 'Pulses & Dals',
    blurb: 'The quiet backbone of the everyday Indian thali.',
    to: '/shop?category=Pulses',
  },
  {
    group: 'Mustard Oil',
    title: 'Mustard Oil',
    blurb: '100% Pure Mustard Oil — the signature CIVIM bottle.',
    to: '/shop?category=Mustard%20Oil',
  },
]

/** Format a confirmed price; callers must handle null separately. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

/** Effective unit price (variant price first, then base). null = unpriced. */
export function unitPrice(product: Product, variantId?: string | null): number | null {
  if (variantId) {
    const v = product.variants?.find((x) => x.id === variantId)
    if (v) return v.price
  }
  return product.price
}

/**
 * Real CIVIM GRAINS catalogue.
 *
 * Add products by appending to PRODUCTS — cards, filters and WhatsApp CTAs
 * pick them up automatically. Only verified info goes here:
 *   - NO prices, weights, pack sizes, SKUs, stock or delivery promises.
 *   - `image` uses a real asset in /public, or null for the clean
 *     placeholder treatment (never fabricated/AI packaging).
 */
export type Category = 'Mustard Oil' | 'Rice' | 'Flours' | 'Pulses'

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
  featured?: boolean
}

export const CATEGORIES: { name: Category | 'All'; blurb: string }[] = [
  { name: 'All', blurb: 'The full CIVIM GRAINS range.' },
  { name: 'Mustard Oil', blurb: '100% Pure Mustard Oil for everyday cooking.' },
  { name: 'Rice', blurb: 'Everyday rice varieties for daily meals and special dishes.' },
  { name: 'Flours', blurb: 'Wheat and multigrain flours for daily rotis.' },
  { name: 'Pulses', blurb: 'Essential dals and pulses for the Indian kitchen.' },
]

export const PRODUCTS: Product[] = [
  {
    slug: 'mustard-oil-100-pure',
    name: '100% Pure Mustard Oil',
    category: 'Mustard Oil',
    description:
      'Our signature mustard oil for everyday Indian cooking — tadka, sabzi, parathas and pickles. Carries the “100% Pure” claim as printed on the pack.',
    detail: 'Pack label (as printed): Cold Pressed',
    image: '/bottle-front.png',
    imageAlt:
      'CIVIM Grains Cold Pressed Mustard Oil bottle — red cap, yellow collar, amber oil and front label',
    featured: true,
  },
  {
    slug: 'ponni-rice',
    name: 'Ponni Rice',
    category: 'Rice',
    description:
      'Rice for everyday meals. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
  },
  {
    slug: 'basmati-rice',
    name: 'Basmati Rice',
    category: 'Rice',
    description:
      'Long-grain rice for biryanis, pulao and festive meals. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
  },
  {
    slug: 'sona-masoori-rice',
    name: 'Sona Masoori Rice',
    category: 'Rice',
    description:
      'A light, everyday rice for daily cooking. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
  },
  {
    slug: 'sharbati-wheat-flour',
    name: 'Sharbati Wheat Flour',
    category: 'Flours',
    description:
      'Wheat flour for soft daily rotis. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
  },
  {
    slug: 'lokwan-wheat-flour',
    name: 'Lokwan Wheat Flour',
    category: 'Flours',
    description:
      'Wheat flour for everyday rotis and parathas. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
  },
  {
    slug: 'multigrain-flour-without-wheat',
    name: 'Multigrain Flour Without Wheat',
    category: 'Flours',
    description:
      'A wheat-free multigrain flour for varied rotis. Contact CIVIM GRAINS for current pack sizes, prices and availability.',
    image: null,
  },
  {
    slug: 'pulses-and-dals',
    name: 'Pulses & Dals',
    category: 'Pulses',
    description:
      'Essential dals and pulses for everyday Indian kitchens. Contact CIVIM GRAINS for the current range, pack sizes and prices.',
    image: null,
  },
]

export function productsByCategory(cat: Category | 'All'): Product[] {
  if (cat === 'All') return PRODUCTS
  return PRODUCTS.filter((p) => p.category === cat)
}

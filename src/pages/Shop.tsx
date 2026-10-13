import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { ProductCard } from '../components/ProductCard'
import { Seo } from '../lib/seo'
import { CATEGORIES, productsByCategory, unitPrice, type Category } from '../lib/products'

const SHOP_FAQ = [
  {
    q: 'How do I order from the catalogue?',
    a: 'Add products to your cart and proceed to checkout. Prices and pack sizes are still being confirmed for online purchase — until they are published, our team confirms each order with you directly.',
  },
  {
    q: 'Where are prices, pack sizes and stock listed?',
    a: 'Wherever they are confirmed, they appear on the product page. Until then you will see a clear “Price to be confirmed” state — we never publish estimated or made-up prices.',
  },
  {
    q: 'Do you deliver to my area?',
    a: 'Delivery areas and charges depend on your location and order size. Share your area with us on the Contact page and we will confirm what is possible.',
  },
  {
    q: 'How do I pay?',
    a: 'Checkout supports online payment (activating with our payment provider) and Cash on Delivery once order processing is connected. Current payment options are confirmed with your order.',
  },
  {
    q: 'Some products show a placeholder tile — why?',
    a: 'Only the mustard oil bottle has a verified photograph so far. Other products use a clean placeholder rather than fabricated packaging, so nothing misrepresents the real product.',
  },
]

type Filter = Category | 'All'
type SortKey = 'featured' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'name-asc', label: 'Name: A–Z' },
  { key: 'name-desc', label: 'Name: Z–A' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

/** Shop: category filters + search + sort over the real catalogue. */
export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const rawCat = params.get('category')
  const initial = CATEGORIES.find((c) => c.name === rawCat)
  const [filter, setFilter] = useState<Filter>(initial ? initial.name : 'All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')

  const applyFilter = (next: Filter) => {
    setFilter(next)
    if (next === 'All') {
      setParams({})
    } else {
      setParams({ category: next })
    }
  }

  const list = useMemo(() => {
    const base = productsByCategory(filter)
    const q = query.trim().toLowerCase()
    const matched = q
      ? base.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        )
      : base

    const sorted = [...matched]
    const byName = (dir: 1 | -1) => sorted.sort((a, b) => a.name.localeCompare(b.name) * dir)
    const byPrice = (dir: 1 | -1) =>
      sorted.sort((a, b) => {
        const pa = unitPrice(a)
        const pb = unitPrice(b)
        // Unpriced items always sink to the end — never treated as ₹0.
        if (pa === null && pb === null) return 0
        if (pa === null) return 1
        if (pb === null) return -1
        return (pa - pb) * dir
      })

    switch (sort) {
      case 'name-asc':
        return byName(1)
      case 'name-desc':
        return byName(-1)
      case 'price-asc':
        return byPrice(1)
      case 'price-desc':
        return byPrice(-1)
      default:
        return sorted
    }
  }, [filter, query, sort])

  return (
    <>
      <Seo
        title="Shop CIVIM GRAINS — Mustard Oil, Rice, Flours & Pulses"
        description="Shop the CIVIM GRAINS catalogue: 100% Pure Mustard Oil, Ponni, Basmati and Sona Masoori rice, Sharbati, Lokwan and multigrain flours, plus pulses."
        path="/shop"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
        ]}
      />
      <section className="section page-hero" aria-labelledby="shop-h">
        <Reveal className="shell narrow">
          <span className="eyebrow" data-reveal>
            Shop · The Catalogue
          </span>
          <h1 id="shop-h" data-reveal>
            Everyday staples, <em>one shelf.</em>
          </h1>
          <p className="lede" data-reveal>
            Mustard oil, rice, flours and pulses. Prices and pack sizes appear
            where confirmed — everything else is honestly marked “to be
            confirmed”.
          </p>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="shop-list-h">
        <div className="shell">
          <h2 id="shop-list-h" className="sr-only">
            Product list
          </h2>
          <Reveal className="shop-tools">
            <div className="shop-filters" role="group" aria-label="Filter by category" data-reveal>
              {CATEGORIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`chip${filter === c.name ? ' is-active' : ''}`}
                  aria-pressed={filter === c.name}
                  onClick={() => applyFilter(c.name)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="shop-tools__inputs" data-reveal>
              <label className="sr-only" htmlFor="shop-search">
                Search products
              </label>
              <input
                id="shop-search"
                className="shop-search"
                type="search"
                placeholder="Search mustard oil, rice, flour…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <label className="sr-only" htmlFor="shop-sort">
                Sort products
              </label>
              <select
                id="shop-sort"
                className="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </Reveal>

          {list.length > 0 ? (
            <>
              <p className="shop-count" aria-live="polite">
                {list.length} product{list.length === 1 ? '' : 's'}
                {filter !== 'All' ? ` in ${filter}` : ''}
              </p>
              <div className="product-grid">
                {list.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>No products match your search</h2>
              <p>
                Try a different word, or contact us and we will help you find
                what your kitchen needs.
              </p>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setQuery('')
                  applyFilter('All')
                }}
              >
                Clear search &amp; filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section page-section page-section--tint" id="faq" aria-labelledby="shop-faq-h">
        <Reveal className="shell faq-wrap">
          <span className="eyebrow" data-reveal>
            Shop FAQ
          </span>
          <h2 id="shop-faq-h" data-reveal>
            Ordering questions
          </h2>
          <div data-reveal>
            <Faq items={SHOP_FAQ} idPrefix="shop-faq" />
          </div>
        </Reveal>
      </section>
    </>
  )
}
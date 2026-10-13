import { useMemo, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { ProductCard } from '../components/ProductCard'
import { Seo } from '../lib/seo'
import { CATEGORIES, productsByCategory, type Category } from '../lib/products'

const SHOP_FAQ = [
  {
    q: 'How do I order from the catalogue?',
    a: 'Tap “Ask on WhatsApp” on any product — WhatsApp opens with a prefilled message naming that product. Send it and we will reply with pack sizes, prices and availability.',
  },
  {
    q: 'Where are prices, pack sizes and stock listed?',
    a: 'They are not listed on this site because they change. WhatsApp (+91 8450912454) always has the current list — that is the fastest way to confirm.',
  },
  {
    q: 'Do you deliver to my area?',
    a: 'Delivery areas and charges depend on your location and order size. Ask on WhatsApp with your area and we will confirm what is possible.',
  },
  {
    q: 'How do I pay?',
    a: 'Payment methods are confirmed on WhatsApp when you order. We do not take online payment on this site.',
  },
  {
    q: 'Some products show a placeholder tile — why?',
    a: 'Only the mustard oil bottle has a verified photograph so far. Other products use a clean placeholder rather than fabricated packaging, so nothing misrepresents the real product.',
  },
]

type Filter = Category | 'All'

/** Shop: filterable catalogue + empty state + Shop FAQ. */
export function ShopPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const list = useMemo(() => {
    const base = productsByCategory(filter)
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }, [filter, query])

  return (
    <>
      <Seo
        title="Shop CIVIM GRAINS — Mustard Oil, Rice, Flours & Pulses"
        description="Shop the CIVIM GRAINS catalogue: 100% Pure Mustard Oil, Ponni, Basmati and Sona Masoori rice, Sharbati, Lokwan and multigrain flours, plus pulses. Order on WhatsApp."
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
            Mustard oil, rice, flours and pulses. Ask on WhatsApp for current
            pack sizes, prices and availability.
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
                  onClick={() => setFilter(c.name)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div data-reveal>
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
            </div>
          </Reveal>
          {list.length > 0 ? (
            <div className="product-grid">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No products match your search</h2>
              <p>
                Try a different word — or message us on WhatsApp and we will
                help you find what your kitchen needs.
              </p>
              <button type="button" className="btn btn--ghost" onClick={() => { setQuery(''); setFilter('All') }}>
                Clear search & filters
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

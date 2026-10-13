import { Link } from 'react-router-dom'
import { ProductCard } from './ProductCard'
import { Reveal } from './Reveal'
import { PRODUCTS } from '../lib/products'

const FEATURED_SLUGS = [
  'mustard-oil',
  'basmati-rice',
  'sharbati-wheat-flour',
  'multigrain-flour-without-wheat',
]

/** Featured product grid with real cards (price only when confirmed). */
export function FeaturedRow() {
  const featured = FEATURED_SLUGS.flatMap((s) => PRODUCTS.filter((p) => p.slug === s))

  return (
    <section className="section featured-row" aria-labelledby="feat-h">
      <Reveal className="shell">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow">From the shelf</span>
            <h2 id="feat-h">Featured products</h2>
          </div>
          <Link className="text-link" to="/shop">
            Shop everything →
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
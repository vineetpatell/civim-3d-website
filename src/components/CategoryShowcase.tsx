import { Link } from 'react-router-dom'
import { Carousel } from './Carousel'
import { Reveal } from './Reveal'
import type { Category } from '../lib/products'

const CATEGORY_TILES: {
  name: Category
  label: string
  blurb: string
  to: string
  variant: string
}[] = [
  {
    name: 'Mustard Oil',
    label: 'Mustard Oil',
    blurb: '100% Pure — Cold Pressed as per label',
    to: '/shop?category=Mustard%20Oil',
    variant: 'cat-tile--oil',
  },
  {
    name: 'Rice',
    label: 'Rice',
    blurb: 'Ponni · Basmati · Sona Masoori',
    to: '/shop?category=Rice',
    variant: 'cat-tile--rice',
  },
  {
    name: 'Wheat Flour',
    label: 'Wheat Flour',
    blurb: 'Sharbati · Lokwan',
    to: '/shop?category=Wheat%20Flour',
    variant: 'cat-tile--wheat',
  },
  {
    name: 'Multigrain Flour',
    label: 'Multigrain Flour',
    blurb: 'Without wheat',
    to: '/shop?category=Multigrain%20Flour',
    variant: 'cat-tile--multi',
  },
  {
    name: 'Pulses',
    label: 'Pulses & Dals',
    blurb: 'Everyday dals for the Indian thali',
    to: '/shop?category=Pulses',
    variant: 'cat-tile--pulse',
  },
]

/** Image-led category tiles → filtered shop results. */
export function CategoryShowcase() {
  return (
    <section className="section cat-showcase" aria-labelledby="cat-h">
      <Reveal className="shell">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow">Shop by category</span>
            <h2 id="cat-h">Featured categories</h2>
          </div>
          <Link className="text-link" to="/shop">
            View all products →
          </Link>
        </div>
        <Carousel label="Featured categories">
          {CATEGORY_TILES.map((c) => (
            <Link className={`carousel__item cat-tile ${c.variant}`} key={c.name} to={c.to}>
              {c.name === 'Mustard Oil' && (
                <img
                  className="cat-tile__img"
                  src="/bottle-front.png"
                  alt="CIVIM Grains 100% Pure Mustard Oil bottle"
                  loading="lazy"
                  decoding="async"
                  width={887}
                  height={1774}
                />
              )}
              <span className="cat-tile__body">
                <span className="cat-tile__name">{c.label}</span>
                <span className="cat-tile__blurb">{c.blurb}</span>
                <span className="cat-tile__cta">Shop →</span>
              </span>
            </Link>
          ))}
        </Carousel>
      </Reveal>
    </section>
  )
}
import { Link } from 'react-router-dom'
import { Carousel } from './Carousel'
import { ProductCard } from './ProductCard'
import { Reveal } from './Reveal'
import { STAPLE_GROUPS, productsByGroup } from '../lib/products'

/**
 * “Shop by staple” — visually distinct sections for rice, flours, pulses and
 * mustard oil, each with a horizontal product carousel and a link to the
 * filtered shop.
 */
export function StapleShop() {
  return (
    <section className="section staple-shop" aria-labelledby="staple-h">
      <div className="shell">
        <Reveal>
          <span className="eyebrow" data-reveal>
            The everyday shelf
          </span>
          <h2 id="staple-h" data-reveal>
            Shop by staple
          </h2>
        </Reveal>

        {STAPLE_GROUPS.map((g, i) => {
          const items = productsByGroup(g.group)
          if (items.length === 0) return null
          return (
            <Reveal className={`staple-block staple-block--${i % 2 === 0 ? 'a' : 'b'}`} key={g.group}>
              <div className="staple-block__head" data-reveal>
                <div>
                  <h3>{g.title}</h3>
                  <p>{g.blurb}</p>
                </div>
                <Link className="text-link" to={g.to}>
                  View all {g.title} →
                </Link>
              </div>
              <Carousel label={`${g.title} products`}>
                {items.map((p) => (
                  <div className="carousel__item" key={p.slug}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </Carousel>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
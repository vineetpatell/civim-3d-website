import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'

/**
 * Premium editorial campaign banner — “Kisaan Se Rasoi Tak”.
 * Uses the only genuine product photography we have (the real bottle).
 * Links to the About page; makes no farmer-partnership or sourcing claims.
 */
export function CampaignBanner() {
  return (
    <section className="campaign" aria-labelledby="campaign-h">
      <div className="shell campaign__grid">
        <Reveal className="campaign__copy">
          <span className="eyebrow eyebrow--light" data-reveal>
            Our promise
          </span>
          <h2 id="campaign-h" data-reveal>
            Kisaan Se <em>Rasoi Tak.</em>
          </h2>
          <p data-reveal>
            From the farmer to the kitchen — everyday staples carry a long
            journey, and that journey deserves care and honesty. Discover the
            philosophy behind CIVIM GRAINS.
          </p>
          <p data-reveal>
            <Link className="btn btn--gold" to="/about">
              Read our story
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </Reveal>
        <div className="campaign__media">
          <img
            src="/bottle-front.png"
            alt="CIVIM Grains 100% Pure Mustard Oil — the real product bottle"
            loading="lazy"
            decoding="async"
            width={887}
            height={1774}
          />
        </div>
      </div>
    </section>
  )
}
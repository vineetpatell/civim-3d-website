import { Carousel } from './Carousel'
import { Reveal } from './Reveal'

/* ------------------------------------------------------------------ *
 * Trust strip — truthful/general information only.
 * No FSSAI/ISO/organic/lab claims, no fake badges or certificate logos.
 * When real certification documents are supplied, append entries here
 * with the document reference — nothing is ever invented.
 * ------------------------------------------------------------------ */
const TRUST_ITEMS: { title: string; body: string }[] = [
  {
    title: 'Label-first information',
    body: 'Product information is available on the pack label.',
  },
  {
    title: '100% Pure Mustard Oil',
    body: 'The “100% Pure” claim as printed on our mustard oil pack.',
  },
  {
    title: 'Cold Pressed',
    body: '“Cold Pressed” as printed on the label of our mustard oil.',
  },
  {
    title: 'Talk to us directly',
    body: 'Call or email for product, pack size and price details — +91 8450912454.',
  },
  {
    title: 'Registered address',
    body: 'Bhopal, Madhya Pradesh — visits by appointment via the Contact page.',
  },
  {
    title: 'Secure online payments',
    body: 'Online payment activates with our verified payment provider at launch.',
  },
]

/** Honest trust-information carousel shown directly below the hero. */
export function TrustStrip() {
  return (
    <section className="trust-strip" aria-labelledby="trust-h">
      <div className="shell">
        <Reveal>
          <span className="eyebrow" data-reveal>
            Why CIVIM
          </span>
          <h2 id="trust-h" className="sr-only">
            Trusted product information
          </h2>
        </Reveal>
        <Carousel label="Trust and product information">
          {TRUST_ITEMS.map((t) => (
            <article className="carousel__item trust-card" key={t.title}>
              <span className="trust-card__dot" aria-hidden="true" />
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
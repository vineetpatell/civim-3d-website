import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'

/**
 * Mustard oil production story (general process, step by step) plus the
 * product-quality / brand-philosophy band.
 *
 * Content rules: general process only — no CIVIM-specific machinery,
 * temperatures, factory procedures or certifications are invented. The only
 * product claim referenced is “Cold Pressed”, as printed on the label.
 */
const STEPS = [
  { num: '01', title: 'Selection & cleaning', body: 'Mustard seed is selected and cleaned so only sound seed moves forward.' },
  { num: '02', title: 'Preparation', body: 'Cleaned seed is prepared for pressing — conditioning matters for a good extraction.' },
  { num: '03', title: 'Oil extraction', body: 'Oil is drawn from the seed. Our pack carries the “Cold Pressed” label claim.' },
  { num: '04', title: 'Settling & filtration', body: 'Fresh oil rests and is filtered or settled so it pours clear and golden.' },
  { num: '05', title: 'Quality checks', body: 'Everyday checks on taste, aroma and appearance keep each batch consistent.' },
  { num: '06', title: 'Hygienic packing', body: 'Oil is packed hygienically and sealed so it reaches your kitchen fresh.' },
]

const PHILOSOPHY = [
  {
    title: 'Honest labelling',
    body: 'We rely on what the pack actually says — “100% Pure” and “Cold Pressed” are label claims you can read on the bottle.',
  },
  {
    title: 'No unsupported claims',
    body: 'No organic, lab-tested or medical claims appear on this site. For documentation, ask us directly and we will share what exists.',
  },
  {
    title: 'Everyday staples, one shelf',
    body: 'Oil, rice, flours and pulses chosen with the same philosophy: Kisaan Se Rasoi Tak.',
  },
]

export function ProcessStory() {
  return (
    <>
      {/* --- Mustard oil production story ----------------------------- */}
      <section className="section process-story" aria-labelledby="process-h">
        <div className="shell">
          <Reveal className="section-head">
            <div data-reveal>
              <span className="eyebrow">Mustard oil, explained</span>
              <h2 id="process-h">From seed to bottle, step by step</h2>
              <p className="section-head__note">
                A general look at how mustard oil is made. Exact CIVIM
                manufacturing details are not published here — the pack label
                remains the source of truth.
              </p>
            </div>
            <Link className="text-link" to="/about#process">
              Detailed process on About →
            </Link>
          </Reveal>
          <ol className="steps-grid">
            {STEPS.map((s) => (
              <li className="steps-grid__item" key={s.num} data-reveal>
                <span className="steps-grid__num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- Quality & brand philosophy -------------------------------- */}
      <section className="section philosophy" aria-labelledby="phil-h">
        <div className="shell philosophy__grid">
          <Reveal className="philosophy__head">
            <span className="eyebrow eyebrow--light" data-reveal>
              Quality &amp; philosophy
            </span>
            <h2 id="phil-h" data-reveal>
              Pure goodness, <em>green &amp; clean.</em>
            </h2>
            <p data-reveal>
              Our approach to quality is practical and transparent: clear label
              information, careful handling, and claims we can actually stand
              behind.
            </p>
          </Reveal>
          <div className="philosophy__cards">
            {PHILOSOPHY.map((p) => (
              <article key={p.title} data-reveal>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
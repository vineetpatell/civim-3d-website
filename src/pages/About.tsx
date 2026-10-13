import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { Seo } from '../lib/seo'
import { SITE } from '../lib/site'

const ABOUT_FAQ = [
  {
    q: 'What is CIVIM GRAINS?',
    a: 'An Indian food brand built on Kisaan Se Rasoi Tak — mustard oil, rice, wheat and multigrain flours, and pulses for family kitchens.',
  },
  {
    q: 'What does Cold Pressed on the pack mean?',
    a: 'Cold Pressed is printed on our label and generally means oil drawn without added high heat. Exact CIVIM extraction details are not published here.',
  },
  {
    q: 'Do you work directly with specific farmers?',
    a: 'We do not name specific farmer partnerships here. Kisaan Se Rasoi Tak expresses our philosophy, not a verified partner list.',
  },
  {
    q: 'Are your products organic or lab-tested?',
    a: 'We make no organic, pesticide-free or lab-tested claims on this site. For current documentation, please ask us on WhatsApp.',
  },
  {
    q: 'How do I buy CIVIM GRAINS products?',
    a: 'Message us on WhatsApp at +91 8450912454 for the current list, pack sizes, prices and order confirmation.',
  },
]

const PROCESS = [
  { num: '01', title: 'Seed selection & cleaning', body: 'Sound mustard seed is selected and cleaned so only good seed moves forward.' },
  { num: '02', title: 'Preparation', body: 'Cleaned seed is conditioned and prepared for pressing.' },
  { num: '03', title: 'Oil extraction', body: 'Oil is drawn from the seed. Our pack carries the Cold Pressed label claim.' },
  { num: '04', title: 'Settling & filtration', body: 'Fresh oil rests and is filtered or settled for a clear, golden pour.' },
  { num: '05', title: 'Quality checks', body: 'Colour, aroma, taste and consistency are checked before packing.' },
  { num: '06', title: 'Hygienic packaging', body: 'Approved oil is packed hygienically and sealed in the CIVIM bottle.' },
]
/** About: brand story, staples, range, detailed process, quality, FAQ, CTA. */
export function AboutPage() {
  return (
    <>
      <Seo
        title="About CIVIM GRAINS — Kisaan Se Rasoi Tak | Mustard Oil & Staples"
        description="About CIVIM GRAINS: Kisaan Se Rasoi Tak. Everyday Indian staples — 100% Pure Mustard Oil, rice, flours and pulses — plus an honest look at how mustard oil is made."
        path="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      <section className="section page-hero" aria-labelledby="about-h">
        <Reveal className="shell narrow">
          <span className="eyebrow" data-reveal>
            About · {SITE.brandLine}
          </span>
          <h1 id="about-h" data-reveal>
            Good food begins <em>long before the kitchen.</em>
          </h1>
          <p className="lede" data-reveal>
            CIVIM GRAINS is built on a simple belief: the dal, roti, rice and
            tadka on your plate carry a long journey from field to rasoi.
          </p>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="about-staples-h">
        <Reveal className="shell split">
          <div>
            <span className="eyebrow" data-reveal>
              Everyday Staples
            </span>
            <h2 id="about-staples-h" data-reveal>
              The food India cooks <em>every day.</em>
            </h2>
          </div>
          <div className="flow">
            <p data-reveal>
              Staples do the real work: oil in the tadka, rice in the cooker,
              atta in the dabba, dal in the pot — cooked daily, eaten by all.
            </p>
            <p data-reveal>
              Consistency, honest packing and availability matter more than
              loud claims. That is the responsibility we take seriously.
            </p>
          </div>
        </Reveal>
      </section>
      <section className="section page-section page-section--tint" aria-labelledby="about-range-h">
        <Reveal className="shell">
          <span className="eyebrow" data-reveal>
            What We Offer
          </span>
          <h2 id="about-range-h" data-reveal>
            One shelf, the whole kitchen
          </h2>
          <div className="range-grid">
            <article data-reveal>
              <h3>Mustard Oil</h3>
              <p>Our signature — 100% Pure Mustard Oil for daily cooking.</p>
            </article>
            <article data-reveal>
              <h3>Rice</h3>
              <p>Ponni, Basmati and Sona Masoori for daily and festive meals.</p>
            </article>
            <article data-reveal>
              <h3>Flours</h3>
              <p>Sharbati, Lokwan and wheat-free multigrain for daily rotis.</p>
            </article>
            <article data-reveal>
              <h3>Pulses</h3>
              <p>Essential dals and pulses for the everyday thali.</p>
            </article>
          </div>
          <p data-reveal>
            <Link className="text-link" to="/shop">
              See the full catalogue →
            </Link>
          </p>
        </Reveal>
      </section>

      <section className="section page-section page-section--forest" aria-labelledby="about-process-h">
        <Reveal className="shell">
          <span className="eyebrow eyebrow--light" data-reveal>
            How Mustard Oil Is Made
          </span>
          <h2 id="about-process-h" data-reveal>
            From seed to bottle, step by step
          </h2>
          <p className="process-note" data-reveal>
            A general explanation. The exact CIVIM manufacturing method is not
            verified for this site — details stay at the pack label claim.
          </p>
          <ol className="steps steps--light">
            {PROCESS.map((s) => (
              <li className="steps__item" key={s.num} data-reveal>
                <span className="steps__num">{s.num}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
      <section className="section page-section" aria-labelledby="about-quality-h">
        <Reveal className="shell split">
          <div>
            <span className="eyebrow" data-reveal>
              Quality & Handling
            </span>
            <h2 id="about-quality-h" data-reveal>
              Care you can <em>taste daily.</em>
            </h2>
          </div>
          <div className="flow">
            <p data-reveal>
              Quality in staples is practical: clean raw material, careful
              handling, steady processes, hygienic packing.
            </p>
            <p data-reveal>
              We avoid claims we cannot evidence — no lab-test, organic or
              chemical-free slogans on this site.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="section page-section page-section--tint" id="faq" aria-labelledby="about-faq-h">
        <Reveal className="shell faq-wrap">
          <span className="eyebrow" data-reveal>
            About FAQ
          </span>
          <h2 id="about-faq-h" data-reveal>
            Questions about the brand
          </h2>
          <div data-reveal>
            <Faq items={ABOUT_FAQ} idPrefix="about-faq" />
          </div>
        </Reveal>
      </section>

      <section className="section cta-band" aria-labelledby="about-cta-h">
        <Reveal className="shell cta-band__inner">
          <h2 id="about-cta-h" data-reveal>
            Taste the <em>philosophy.</em>
          </h2>
          <div className="btn-row btn-row--center" data-reveal>
            <Link className="btn btn--gold" to="/shop">
              Visit Shop
            </Link>
            <Link className="btn btn--outline-light" to="/contact">
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}


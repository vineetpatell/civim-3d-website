import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { ProductCard } from '../components/ProductCard'
import { Seo } from '../lib/seo'
import { CONTACT, SITE } from '../lib/site'
import { CATEGORIES, PRODUCTS } from '../lib/products'
import { whatsappUrl, GENERAL_ENQUIRY_MESSAGE, productEnquiryMessage } from '../lib/whatsapp'

const HOME_FAQ = [
  {
    q: 'What does “Kisaan Se Rasoi Tak” mean?',
    a: 'It is the CIVIM GRAINS brand line — “from the farmer to the kitchen”. It expresses the idea that everyday staples travel from farms to family kitchens, and that this journey deserves care and honesty.',
  },
  {
    q: 'Is your mustard oil really 100% pure?',
    a: '“100% Pure Mustard Oil” is the claim printed on our pack, and purity is the heart of the brand. For batch, sourcing or testing questions, message us on WhatsApp and we will answer with current details.',
  },
  {
    q: 'What products does CIVIM GRAINS offer?',
    a: 'Mustard oil, rice (Ponni, Basmati, Sona Masoori), wheat and multigrain flours, and pulses/dals. See the Shop page for the full catalogue.',
  },
  {
    q: 'How do I order, and where do I find prices?',
    a: 'Ordering is over WhatsApp on +91 8450912454. Pack sizes, prices and availability change, so WhatsApp is the fastest way to get the current list — tap any “Order on WhatsApp” button to start with a prefilled message.',
  },
  {
    q: 'Where is CIVIM GRAINS located?',
    a: 'BUILDING NO 78, Bhawanidham Phase-1, Chhatrapati Nagar, AYODHAYA HUZUR, Ayodhya Nagar, Bhopal, Madhya Pradesh 462041. See the Contact page for phone, email and a maps link.',
  },
]

const JOURNEY = [
  { num: '01', title: 'Selection & cleaning', body: 'Mustard seed is selected and cleaned so only sound seed moves forward.' },
  { num: '02', title: 'Preparation', body: 'Cleaned seed is prepared for pressing — conditioning matters for a good extraction.' },
  { num: '03', title: 'Oil extraction', body: 'Oil is drawn from the seed. Our pack carries the “Cold Pressed” label claim.' },
  { num: '04', title: 'Settling & filtration', body: 'Fresh oil rests and is filtered or settled so it pours clear and golden.' },
  { num: '05', title: 'Quality checks', body: 'Everyday checks on taste, aroma and appearance keep each batch consistent.' },
  { num: '06', title: 'Hygienic packing', body: 'Oil is packed hygienically and sealed so it reaches your kitchen fresh.' },
]

const RANGE = [
  { name: 'Mustard Oil', body: '100% Pure Mustard Oil — the signature bottle for daily tadka, sabzi and pickles.' },
  { name: 'Rice', body: 'Ponni, Basmati and Sona Masoori for everyday meals and special dishes.' },
  { name: 'Flours', body: 'Sharbati and Lokwan wheat flours plus a wheat-free multigrain flour for daily rotis.' },
  { name: 'Pulses', body: 'Everyday dals and pulses — the quiet backbone of the Indian thali.' },
]

/**
 * Home: hero + brand intro + featured oil + categories + quality + journey +
 * why + range + FAQ + final CTA. Editorial, conversion-focused.
 */
export function HomePage() {
  const featured = PRODUCTS.find((p) => p.slug === 'mustard-oil-100-pure')!

  return (
    <>
      <Seo
        title="CIVIM GRAINS — 100% Pure Mustard Oil | Kisaan Se Rasoi Tak"
        description="CIVIM GRAINS — Pure Goodness, Green & Clean. 100% Pure Mustard Oil plus rice, wheat flour, multigrain flour and pulses for everyday Indian kitchens. Order on WhatsApp."
        path="/"
        image="/bottle-front.png"
      />
      <Hero />

      <section className="section page-section" aria-labelledby="home-intro-h">
        <Reveal className="shell split">
          <div>
            <span className="eyebrow" data-reveal>
              {SITE.brandLine}
            </span>
            <h2 id="home-intro-h" data-reveal>
              From the farm, <em>for the kitchen.</em>
            </h2>
          </div>
          <div className="flow">
            <p className="lede" data-reveal>
              CIVIM GRAINS exists for the everyday Indian kitchen — the dals,
              rotis, rice and tadkas that families cook every single day.
            </p>
            <p data-reveal>
              “Kisaan Se Rasoi Tak” is our way of saying the journey matters:
              good staples begin in the field and earn their place on your
              shelf through care, consistency and honesty — not shortcuts.
            </p>
            <p data-reveal>
              <Link className="text-link" to="/about">
                Read our story →
              </Link>
            </p>
          </div>
        </Reveal>
      </section>

      <section className="section feature-band" aria-labelledby="home-oil-h">
        <Reveal className="shell feature-band__grid">
          <div className="feature-band__media" data-reveal>
            <img
              src="/bottle-front.png"
              alt="CIVIM Grains Cold Pressed Mustard Oil bottle — red cap, yellow collar, amber oil and front label"
              loading="lazy"
              decoding="async"
              width={887}
              height={1774}
            />
          </div>
          <div className="flow">
            <span className="eyebrow eyebrow--light" data-reveal>
              Featured · Mustard Oil
            </span>
            <h2 id="home-oil-h" data-reveal>
              {SITE.claim}, for everyday cooking.
            </h2>
            <p data-reveal>
              Mustard oil is the soul of lakhs of Indian kitchens — the sharp,
              warming tadka in dal, the depth in sabzi, the crunch in parathas
              and the bite in pickles. Ours is made to carry that character in
              every drop.
            </p>
            <div className="btn-row" data-reveal>
              <Link className="btn btn--gold" to="/shop">
                View Product
              </Link>
              <a
                className="btn btn--outline-light"
                href={whatsappUrl(productEnquiryMessage(featured.name))}
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="home-cats-h">
        <Reveal className="shell">
          <span className="eyebrow" data-reveal>
            Our Range
          </span>
          <h2 id="home-cats-h" data-reveal>
            Explore our products
          </h2>
          <div className="cat-row">
            {CATEGORIES.filter((c) => c.name !== 'All').map((c) => (
              <Link className="cat-link" to="/shop" key={c.name} data-reveal>
                <span className="cat-link__name">{c.name}</span>
                <span className="cat-link__blurb">{c.blurb}</span>
                <span className="cat-link__go" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
          <p data-reveal>
            <Link className="text-link" to="/shop">
              Browse the full catalogue →
            </Link>
          </p>
        </Reveal>
      </section>
      <section className="section page-section page-section--tint" aria-labelledby="home-quality-h">
        <Reveal className="shell split">
          <div>
            <span className="eyebrow" data-reveal>
              Quality
            </span>
            <h2 id="home-quality-h" data-reveal>
              Our approach <em>to quality.</em>
            </h2>
          </div>
          <div className="flow">
            <p className="lede" data-reveal>
              Staples are eaten every day, so consistency matters more than
              promises. We focus on careful handling at every step.
            </p>
            <p data-reveal>
              We make no claims we cannot support: no laboratory-test boasts,
              no organic or pesticide-free labels. What we promise is
              attention — to the product, the pack and the kitchen it serves.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="home-journey-h">
        <Reveal className="shell">
          <span className="eyebrow" data-reveal>
            From Seed to Bottle
          </span>
          <h2 id="home-journey-h" data-reveal>
            The mustard oil journey
          </h2>
          <ol className="steps">
            {JOURNEY.map((s) => (
              <li className="steps__item" key={s.num} data-reveal>
                <span className="steps__num">{s.num}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p data-reveal className="steps__note">
            A general overview — our pack carries the “Cold Pressed” label
            claim. Exact CIVIM GRAINS manufacturing details are not published
            here.{' '}
            <Link className="text-link" to="/about">
              Read the detailed process →
            </Link>
          </p>
        </Reveal>
      </section>

      <section className="section page-section page-section--forest" aria-labelledby="home-why-h">
        <Reveal className="shell split split--light">
          <div>
            <span className="eyebrow eyebrow--light" data-reveal>
              Why CIVIM
            </span>
            <h2 id="home-why-h" data-reveal>
              Why CIVIM GRAINS?
            </h2>
          </div>
          <div className="flow">
            <p className="lede lede--light" data-reveal>
              One brand for the whole kitchen shelf — oil, rice, flour and
              dals — chosen with the same philosophy.
            </p>
            <ul className="tick-list" data-reveal>
              <li>A clear philosophy: Kisaan Se Rasoi Tak.</li>
              <li>A practical range covering daily cooking needs.</li>
              <li>Direct WhatsApp ordering on {CONTACT.phoneDisplay}.</li>
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="home-range-h">
        <Reveal className="shell">
          <span className="eyebrow" data-reveal>
            The Shelf
          </span>
          <h2 id="home-range-h" data-reveal>
            Featured product categories
          </h2>
          <div className="range-grid">
            {RANGE.map((r) => (
              <article key={r.name} data-reveal>
                <h3>{r.name}</h3>
                <p>{r.body}</p>
                <Link className="text-link" to="/shop">
                  Shop {r.name} →
                </Link>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section page-section page-section--tint" aria-labelledby="home-spot-h">
        <Reveal className="shell">
          <h2 id="home-spot-h" data-reveal>
            The bottle your kitchen knows
          </h2>
          <div className="spot-grid" data-reveal>
            <ProductCard product={featured} />
          </div>
        </Reveal>
      </section>

      <section className="section page-section" id="faq" aria-labelledby="home-faq-h">
        <Reveal className="shell faq-wrap">
          <span className="eyebrow" data-reveal>
            Good to Know
          </span>
          <h2 id="home-faq-h" data-reveal>
            Frequently asked questions
          </h2>
          <div data-reveal>
            <Faq items={HOME_FAQ} idPrefix="home-faq" />
          </div>
        </Reveal>
      </section>

      <section className="section cta-band" aria-labelledby="home-cta-h">
        <Reveal className="shell cta-band__inner">
          <h2 id="home-cta-h" data-reveal>
            Stock your kitchen the <em>CIVIM way.</em>
          </h2>
          <p data-reveal>
            Browse the range or message us on WhatsApp for pack sizes, prices
            and availability.
          </p>
          <div className="btn-row btn-row--center" data-reveal>
            <Link className="btn btn--gold" to="/shop">
              Explore Products
            </Link>
            <a
              className="btn btn--outline-light"
              href={whatsappUrl(GENERAL_ENQUIRY_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on WhatsApp
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}


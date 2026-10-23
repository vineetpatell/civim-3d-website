import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { TrustStrip } from '../components/TrustStrip'
import { CategoryShowcase } from '../components/CategoryShowcase'
import { MobileCategoryShortcuts } from '../components/MobileCategoryShortcuts'
import { FeaturedRow } from '../components/FeaturedRow'
import { CampaignBanner } from '../components/CampaignBanner'
import { StapleShop } from '../components/StapleShop'
import { ProcessStory } from '../components/ProcessStory'
import { Seo } from '../lib/seo'
import { CONTACT } from '../lib/site'

const HOME_FAQ = [
  {
    q: 'What does “Kisaan Se Rasoi Tak” mean?',
    a: 'It is the CIVIM GRAINS brand line — “from the farmer to the kitchen”. It expresses the idea that everyday staples travel from farms to family kitchens, and that this journey deserves care and honesty.',
  },
  {
    q: 'Is your mustard oil really 100% pure?',
    a: '“100% Pure Mustard Oil” is the claim printed on our pack, and purity is the heart of the brand. For batch, sourcing or testing questions, contact us and we will answer with current details.',
  },
  {
    q: 'What products does CIVIM GRAINS offer?',
    a: 'Mustard oil, rice (Ponni, Basmati, Sona Masoori), wheat flours (Sharbati, Lokwan), a wheat-free multigrain flour, and pulses/dals. See the Shop page for the full catalogue.',
  },
  {
    q: 'How do I order, and where do I find prices?',
    a: 'Add products to your cart and head to checkout. Pack sizes and prices are still being confirmed for online purchase — until prices are published, our team confirms your order directly. You can also reach us on ' + CONTACT.phoneDisplay + '.',
  },
  {
    q: 'Where is CIVIM GRAINS located?',
    a: 'BUILDING NO 78, Bhawanidham Phase-1, Chhatrapati Nagar, AYODHAYA HUZUR, Ayodhya Nagar, Bhopal, Madhya Pradesh 462041. See the Contact page for phone, email and a maps link.',
  },
]

/**
 * Home: approved hero (locked) + redesigned below-hero storefront:
 * trust strip → categories → featured products → campaign banner →
 * shop by staple → process story → quality → FAQ preview → final CTA.
 */
export function HomePage() {
  return (
    <>
      <Seo
        title="CIVIM GRAINS — 100% Pure Mustard Oil | Kisaan Se Rasoi Tak"
        description="CIVIM GRAINS — Pure Goodness, Green & Clean. 100% Pure Mustard Oil plus rice, wheat flour, multigrain flour and pulses for everyday Indian kitchens."
        path="/"
        image="/bottle-front.png"
      />
{/* Stock imagery: mustard fields, seeds, farming — free Unsplash licenses */}
      <section className="section page-section page-section--tint">
        <div className="shell" style={{ maxWidth: 1200, margin: 0 }}>
          <div className="stock-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509395176807-b4797d686d4f?w=1200&q=80')" }}></div>
          <div className="stock-medium" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531903024232-37e0c44d217d?w=800&q=80')" }}></div>
          <div className="stock-small" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495662161232-f9b6a2e2550d?w=800&q=80')" }}></div>
        </div>
      </section>

      {/* APPROVED HERO — do not modify this component or its styles. */}
      <Hero />

      {/* Mobile-only category shortcuts row */}
      <MobileCategoryShortcuts />

      <TrustStrip />
      <CategoryShowcase />
      <FeaturedRow />
      <CampaignBanner />
      <StapleShop />
      <ProcessStory />

      {/* --- FAQ preview ---------------------------------------------- */}
      <section className="section page-section page-section--tint" id="faq" aria-labelledby="home-faq-h">
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
          <p className="faq-wrap__more" data-reveal>
            More answers: <Link className="text-link" to="/about#faq">About FAQ</Link> ·{' '}
            <Link className="text-link" to="/shop#faq">Shop FAQ</Link> ·{' '}
            <Link className="text-link" to="/contact#faq">Contact FAQ</Link>
          </p>
        </Reveal>
      </section>

      {/* --- Final shop CTA ------------------------------------------- */}
      <section className="section cta-band" aria-labelledby="home-cta-h">
        <Reveal className="shell cta-band__inner">
          <h2 id="home-cta-h" data-reveal>
            Stock your kitchen the <em>CIVIM way.</em>
          </h2>
          <p data-reveal>
            Browse the full range — prices and pack sizes are confirmed before
            you buy.
          </p>
          <div className="btn-row btn-row--center" data-reveal>
            <Link className="btn btn--gold" to="/shop">
              Explore Products
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
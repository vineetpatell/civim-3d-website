import { useState, type FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { Seo } from '../lib/seo'
import { CONTACT } from '../lib/site'
import { whatsappUrl, contactFormMessage, GENERAL_ENQUIRY_MESSAGE } from '../lib/whatsapp'

const CONTACT_FAQ = [
  {
    q: 'What is the fastest way to reach you?',
    a: `Call ${CONTACT.phoneDisplay} for orders and urgent queries, or email ${CONTACT.email} — we reply with current product, price and availability details.`,
  },
  {
    q: 'Can I message instead of calling?',
    a: 'Yes — WhatsApp is available on this page as a secondary support channel, and the enquiry form below opens WhatsApp with your message prefilled.',
  },
  {
    q: 'What happens when I submit the contact form?',
    a: 'This site has no form backend. Submitting opens WhatsApp with your message prefilled — you review and send it. Nothing is sent automatically.',
  },
  {
    q: 'Where are you located?',
    a: 'BUILDING NO 78, Bhawanidham Phase-1, Chhatrapati Nagar, AYODHAYA HUZUR, Ayodhya Nagar, Bhopal, Madhya Pradesh 462041. The map below shows the location, with an “Open in Google Maps” link.',
  },
  {
    q: 'Do you take bulk or retail enquiries?',
    a: 'Both — choose Retail, Bulk or Other in the form. Share area and quantities for the fastest answer.',
  },
]

const ENQUIRY_TYPES = ['General', 'Retail order', 'Bulk enquiry', 'Product question', 'Other']

/** Contact: call, email, address + map, secondary WhatsApp, form, FAQ. */
export function ContactPage() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [type, setType] = useState(ENQUIRY_TYPES[0])
  const [message, setMessage] = useState('')

  const waHref = whatsappUrl(contactFormMessage(name, contact, type, message))
  const mailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    `CIVIM GRAINS enquiry — ${type}`,
  )}&body=${encodeURIComponent(
    `Name: ${name}\nContact: ${contact}\nEnquiry type: ${type}\n\n${message}`,
  )}`

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    window.open(waHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Seo
        title="Contact CIVIM GRAINS — Phone, Email & Bhopal Address"
        description="Contact CIVIM GRAINS: call +91 8450912454, email support@civimgrains.com, or visit us in Bhopal, Madhya Pradesh. Map and enquiry form inside."
        path="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <section className="section page-hero" aria-labelledby="contact-h">
        <Reveal className="shell narrow">
          <span className="eyebrow" data-reveal>
            Contact · We Reply
          </span>
          <h1 id="contact-h" data-reveal>
            Talk to <em>CIVIM GRAINS.</em>
          </h1>
          <p className="lede" data-reveal>
            Orders, products, prices, availability — call or email us and we
            will answer with current details.
          </p>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="contact-channels-h">
        <Reveal className="shell">
          <h2 id="contact-channels-h" data-reveal>
            Reach us directly
          </h2>
          <div className="contact-cards">
            <article data-reveal>
              <h3>Phone</h3>
              <p>
                <a className="text-link" href={CONTACT.phoneHref}>
                  {CONTACT.phoneDisplay}
                </a>
              </p>
              <p className="fine-print">Tap to call — orders &amp; support.</p>
            </article>
            <article data-reveal>
              <h3>Email</h3>
              <p>
                <a className="text-link" href={CONTACT.emailHref}>
                  {CONTACT.email}
                </a>
              </p>
              <p className="fine-print">Product, bulk &amp; business enquiries.</p>
            </article>
            <article data-reveal>
              <h3>WhatsApp (support)</h3>
              <p>
                <a
                  className="text-link"
                  href={whatsappUrl(GENERAL_ENQUIRY_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message us
                </a>
              </p>
              <p className="fine-print">Secondary support channel.</p>
            </article>
          </div>
        </Reveal>
      </section>

      <section className="section page-section page-section--tint" aria-labelledby="contact-addr-h">
        <Reveal className="shell split">
          <div>
            <span className="eyebrow" data-reveal>
              Visit
            </span>
            <h2 id="contact-addr-h" data-reveal>
              Our address
            </h2>
            <address className="address" data-reveal>
              {CONTACT.addressLines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p data-reveal>
              <a
                className="btn btn--ghost"
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </p>
          </div>
          <div className="contact-map" data-reveal>
            <iframe
              title="CIVIM GRAINS location on Google Maps"
              src={CONTACT.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <p className="fine-print">
              Map centred on our Bhopal address. If it does not load, use
              “Open in Google Maps”.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="section page-section" aria-labelledby="contact-form-h">
        <Reveal className="shell split">
          <div>
            <span className="eyebrow" data-reveal>
              Enquiry Form
            </span>
            <h2 id="contact-form-h" data-reveal>
              Send an enquiry
            </h2>
            <p data-reveal className="fine-print">
              No backend storage here. Submitting opens WhatsApp with your
              message prefilled — you review and send it. For orders, prefer
              calling or email.
            </p>
          </div>
          <form className="contact-form" onSubmit={onSubmit} data-reveal>
            <div className="field">
              <label htmlFor="cf-name">Name</label>
              <input
                id="cf-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label htmlFor="cf-contact">Phone or email</label>
              <input
                id="cf-contact"
                name="contact"
                type="text"
                autoComplete="tel"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="How do we reach you?"
              />
            </div>
            <div className="field">
              <label htmlFor="cf-type">Enquiry type</label>
              <select
                id="cf-type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {ENQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cf-msg">Message</label>
              <textarea
                id="cf-msg"
                name="message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you need…"
              />
            </div>
            <div className="btn-row">
              <button type="submit" className="btn btn--primary">
                Send via WhatsApp
              </button>
              <a className="btn btn--ghost" href={mailHref}>
                Send via Email
              </a>
            </div>
          </form>
        </Reveal>
      </section>

      <section className="section page-section page-section--tint" id="business-enquiries" aria-labelledby="business-enquiries-h">
        <Reveal className="shell">
          <h2 id="business-enquiries-h" data-reveal>
            Business & Wholesale Enquiries
          </h2>
          <p data-reveal>
            CIVIM GRAINS serves both individual households and business customers.
            Retailers, grocery stores, distributors and trade buyers can enquire about
            available products and supply requirements. Restaurants, food businesses
            and other commercial buyers are welcome to get in touch about product
            availability, pack sizes, pricing and minimum order quantities.
          </p>
          <p data-reveal>
            <a href="https://wa.me/918450912454?text=Business enquiry:" className="btn btn--gold" target="_blank" rel="noopener noreferrer">
              Enquire for Business Supply
            </a>
            — or call {CONTACT.phoneDisplay} and email {CONTACT.email}
          </p>
        </Reveal>
      </section>

      <section className="section page-section page-section--tint" id="faq" aria-labelledby="contact-faq-h">
        <Reveal className="shell faq-wrap">
          <span className="eyebrow" data-reveal>
            Contact FAQ
          </span>
          <h2 id="contact-faq-h" data-reveal>
            Before you message
          </h2>
          <div data-reveal>
            <Faq items={CONTACT_FAQ} idPrefix="contact-faq" />
          </div>
        </Reveal>
      </section>
    </>
  )
}
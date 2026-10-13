import { useState, type FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { Seo } from '../lib/seo'
import { CONTACT } from '../lib/site'
import { whatsappUrl, contactFormMessage } from '../lib/whatsapp'

const CONTACT_FAQ = [
  {
    q: 'What is the fastest way to reach you?',
    a: 'WhatsApp on +91 8450912454 — answered with current product, price and availability details.',
  },
  {
    q: 'Can I call instead of messaging?',
    a: 'Yes — tap the phone number to call. For product lists and prices, WhatsApp is usually faster.',
  },
  {
    q: 'What happens when I submit the contact form?',
    a: 'This site has no backend. Submitting opens WhatsApp with your message prefilled — you review and send it. Nothing is sent automatically.',
  },
  {
    q: 'Where are you located?',
    a: 'BUILDING NO 78, Bhawanidham Phase-1, Chhatrapati Nagar, AYODHAYA HUZUR, Ayodhya Nagar, Bhopal, Madhya Pradesh 462041.',
  },
  {
    q: 'Do you take bulk or retail enquiries?',
    a: 'Both — choose Retail, Bulk or Other in the form. Share area and quantities on WhatsApp for the fastest answer.',
  },
]

const ENQUIRY_TYPES = ['General', 'Retail order', 'Bulk enquiry', 'Product question', 'Other']
/** Contact: call, mailto, WhatsApp, address, Maps link, honest form, FAQ. */
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
        title="Contact CIVIM GRAINS — Phone, WhatsApp, Email & Bhopal Address"
        description="Contact CIVIM GRAINS: call or WhatsApp +91 8450912454, email support@civimgrains.com, or visit us in Bhopal, Madhya Pradesh. Maps link and enquiry form inside."
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
            Orders, products, prices, availability — message us and we will
            answer with current details.
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
              <h3>Phone & WhatsApp</h3>
              <p><a className="text-link" href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a></p>
              <p><a className="text-link" href={waHref} target="_blank" rel="noopener noreferrer">Start WhatsApp chat →</a></p>
            </article>
            <article data-reveal>
              <h3>Email</h3>
              <p><a className="text-link" href={CONTACT.emailHref}>{CONTACT.email}</a></p>
              <p>For detailed or non-urgent enquiries.</p>
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
          </div>
          <div className="flow">
            <address className="address" data-reveal>
              {CONTACT.addressLines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p data-reveal>
              <a className="btn btn--ghost" href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
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
              message prefilled — you review and send it.
            </p>
          </div>
          <form className="contact-form" onSubmit={onSubmit} data-reveal>
            <div className="field">
              <label htmlFor="cf-name">Name</label>
              <input id="cf-name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="cf-contact">Phone or email</label>
              <input id="cf-contact" name="contact" type="text" autoComplete="tel" required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="How do we reach you?" />
            </div>
            <div className="field">
              <label htmlFor="cf-type">Enquiry type</label>
              <select id="cf-type" name="type" value={type} onChange={(e) => setType(e.target.value)}>
                {ENQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cf-msg">Message</label>
              <textarea id="cf-msg" name="message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you need…" />
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


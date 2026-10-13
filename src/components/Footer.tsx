import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP } from '../lib/gsap'
import { CONTACT, SITE } from '../lib/site'
import { whatsappUrl, GENERAL_ENQUIRY_MESSAGE } from '../lib/whatsapp'

/**
 * Premium footer with a gentle curved upper edge (SVG, no overflow).
 * Brand + tagline + short description, page links, contact info, shop link
 * and the single WhatsApp order CTA.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // immediateRender:false — content stays visible until the trigger fires.
      // Scoped to this footer only; cleaned up automatically on unmount.
      gsap.from('[data-reveal]', {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
        },
      })
    },
    { scope: ref, revertOnUpdate: true },
  )

  return (
    <footer className="footer" ref={ref}>
      <div className="footer__curve" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" focusable="false">
          <path d="M0,72 L0,40 C240,8 480,0 720,12 C960,24 1200,32 1440,16 L1440,72 Z" />
        </svg>
      </div>
      <div className="shell">
        <div className="footer__top">
          <div>
            <div className="footer__brand-name" data-reveal>
              CIVIM GRAINS
            </div>
            <div className="footer__tag" data-reveal>
              {SITE.tagline} · {SITE.brandLine}
            </div>
            <p className="footer__claim" data-reveal>
              Everyday staples for Indian kitchens — mustard oil, rice, flours
              and pulses.
            </p>
            <a
              className="btn btn--whatsapp footer__cta"
              data-reveal
              href={whatsappUrl(GENERAL_ENQUIRY_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on WhatsApp
            </a>
          </div>

          <nav className="footer__links" aria-label="Explore">
            <span className="footer__links-title">Explore</span>
            <Link to="/" data-reveal>
              Home
            </Link>
            <Link to="/about" data-reveal>
              About
            </Link>
            <Link to="/shop" data-reveal>
              Shop
            </Link>
            <Link to="/contact" data-reveal>
              Contact
            </Link>
            <Link to="/#faq" data-reveal>
              FAQ
            </Link>
          </nav>

          <div className="footer__contact">
            <span className="footer__links-title">Contact</span>
            <a href={CONTACT.phoneHref} data-reveal>
              {CONTACT.phoneDisplay}
            </a>
            <a href={CONTACT.emailHref} data-reveal>
              {CONTACT.email}
            </a>
            <p data-reveal>{CONTACT.addressSingleLine}</p>
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              Open in Google Maps
            </a>
          </div>

          <nav className="footer__links" aria-label="Legal">
            <span className="footer__links-title">Legal</span>
            <Link to="/contact" data-reveal>
              Privacy &amp; Terms
            </Link>
            <Link to="/shop" data-reveal>
              Products
            </Link>
            <Link to="/about" data-reveal>
              Our Approach
            </Link>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} CIVIM GRAINS. All rights reserved.</span>
          <span>Kisaan Se Rasoi Tak.</span>
        </div>
      </div>
    </footer>
  )
}


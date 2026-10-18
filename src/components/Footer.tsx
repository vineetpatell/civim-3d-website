import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP } from '../lib/gsap'
import { CATEGORIES } from '../lib/products'
import { CREDIT, CONTACT, LOGO, SOCIALS, SITE } from '../lib/site'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V3h-2.5A3.5 3.5 0 0 0 11 6.5V8.5H9V11h2v10h3V11h2.2l.4-2.5H14z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M6.5 9.5H4V20h2.5V9.5zM5.25 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM20 13.9c0-2.6-1.4-3.9-3.3-3.9-1.5 0-2.2.8-2.6 1.4V9.5H11.6V20h2.5v-5.6c0-1.3.7-2.1 1.8-2.1s1.7.8 1.7 2.1V20H20v-6.1z"
        fill="currentColor"
      />
    </svg>
  )
}

interface SocialDef {
  name: string
  url: string | null
  icon: ReactNode
}

const SOCIAL_DEFS: SocialDef[] = [
  { name: 'Instagram', url: SOCIALS.instagram, icon: <InstagramIcon /> },
  { name: 'Facebook', url: SOCIALS.facebook, icon: <FacebookIcon /> },
  { name: 'LinkedIn', url: SOCIALS.linkedin, icon: <LinkedinIcon /> },
]

/**
 * Footer: curved upper edge, official logo, brand blurb, navigation, shop
 * categories, contact, legal policy links, social icons (real URLs only —
 * clearly marked placeholders otherwise) and the NES credit link.
 *
 * Compact forest-green treatment: tight gaps, balanced columns, no horizontal
 * overflow. The curved edge is preserved exactly as approved.
 */
const LEGAL_LINKS: { to: string; label: string }[] = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-and-conditions', label: 'Terms & Conditions' },
  { to: '/return-refund-policy', label: 'Return & Refund Policy' },
  { to: '/data-protection', label: 'Data Protection' },
]

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
          <div className="footer__brandcol">
            <img
              className="footer__logo"
              src={LOGO.src}
              alt="CIVIM GRAINS official logo"
              width={LOGO.width}
              height={LOGO.height}
              style={{ aspectRatio: LOGO.aspectRatio }}
              data-reveal
            />
            <div className="footer__brand-name" data-reveal>
              CIVIM GRAINS
            </div>
            <div className="footer__tag" data-reveal>
              {SITE.tagline} · {SITE.brandLine}
            </div>
            <p className="footer__note" data-reveal>
              Everyday staples for Indian kitchens — 100% Pure Mustard Oil, rice,
              wheat and multigrain flours, and pulses.
            </p>
            <div className="footer__socials" data-reveal>
              {SOCIAL_DEFS.map((s) =>
                s.url ? (
                  <a
                    key={s.name}
                    className="footer__social"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CIVIM GRAINS on ${s.name}`}
                  >
                    {s.icon}
                  </a>
                ) : (
                  <span
                    key={s.name}
                    className="footer__social footer__social--pending"
                    role="img"
                    aria-label={`${s.name} profile URL not configured yet`}
                    title={`${s.name} profile URL not configured — add it in src/lib/site.ts (SOCIALS)`}
                  >
                    {s.icon}
                  </span>
                ),
              )}
            </div>
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

          <nav className="footer__links" aria-label="Shop categories">
            <span className="footer__links-title">Shop</span>
            {CATEGORIES.filter((c) => c.name !== 'All').map((c) => (
              <Link key={c.name} to={`/shop?category=${encodeURIComponent(c.name)}`} data-reveal>
                {c.name}
              </Link>
            ))}
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
            <Link to="/contact#faq" data-reveal>
              FAQ &amp; Support
            </Link>
          </div>

          {/* --- Legal & policies (dedicated, directly accessible pages) --- */}
          <nav className="footer__links footer__links--legal" aria-label="Policies">
            <span className="footer__links-title">Policies</span>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} data-reveal>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} CIVIM GRAINS. All rights reserved.</span>
          <span className="footer__credit">
            Designed &amp; Developed by{' '}
            {CREDIT.url ? (
              <a href={CREDIT.url} target="_blank" rel="noopener noreferrer">
                {CREDIT.company}
              </a>
            ) : (
              <span
                className="footer__credit-pending"
                title="NES website URL not configured — add it in src/lib/site.ts (CREDIT.url)"
              >
                {CREDIT.company}
              </span>
            )}
          </span>
        </div>
      </div>
    </footer>
  )
}


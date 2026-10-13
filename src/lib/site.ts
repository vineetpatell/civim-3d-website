/**
 * Central site configuration — single place to update before launch.
 *
 * IMPORTANT — production domain:
 * The live domain has NOT been confirmed. `siteUrl` below is a placeholder.
 * Replace it with the real canonical origin (e.g. https://www.civimgrains.com)
 * and set `siteUrlConfirmed: true` once verified. The sitemap
 * (`public/sitemap.xml`) and robots.txt reference this same value — keep them
 * in sync. Do NOT publish localhost URLs in the sitemap.
 */
export const SITE = {
  name: 'CIVIM GRAINS',
  brandLine: 'Kisaan Se Rasoi Tak',
  tagline: 'Pure Goodness, Green & Clean.',
  claim: '100% Pure Mustard Oil',
  // TODO(LAUNCH): replace with the confirmed production origin.
  siteUrl: 'https://www.civimgrains.com',
  // TODO(LAUNCH): flip to true only after the domain is verified in production.
  // Canonical/og:url tags are emitted only when this is true (see seo.tsx).
  siteUrlConfirmed: false,
  description:
    'CIVIM GRAINS — Kisaan Se Rasoi Tak. 100% Pure Mustard Oil plus rice, wheat flour, multigrain flour and pulses for everyday Indian kitchens.',
} as const

/**
 * Official brand logo.
 * Drop the supplied official logo file (as attached in the brief) into
 * `public/logo.png` — the site references this exact file in the header and
 * footer. Never substitute a redrawn/text-only version.
 */
export const LOGO = {
  src: '/logo.png',
  /** Intrinsic ratio of the supplied logo (square, 1024×1024). */
  aspectRatio: '1 / 1',
} as const

export const CONTACT = {
  phoneDisplay: '+91 8450912454',
  // wa.me requires digits only, no plus/spaces.
  whatsappNumber: '918450912454',
  phoneHref: 'tel:+918450912454',
  email: 'support@civimgrains.com',
  emailHref: 'mailto:support@civimgrains.com',
  addressLines: [
    'BUILDING NO 78, Bhawanidham Phase-1,',
    'Chhatrapati Nagar, AYODHAYA HUZUR,',
    'Ayodhya Nagar, Bhopal,',
    'Madhya Pradesh 462041',
  ],
  addressSingleLine:
    'BUILDING NO 78, Bhawanidham Phase-1, Chhatrapati Nagar, AYODHAYA HUZUR, Ayodhya Nagar, Bhopal, Madhya Pradesh 462041',
  /** Supplied Google Maps short link — used for the "Open in Google Maps" button. */
  mapsUrl: 'https://share.google/YGApaOxk34JzmACed',
  /**
   * Embeddable map URL for the <iframe> on the Contact page.
   * The supplied share.google link does not expose an embeddable form, so this
   * embeds Google Maps geocoded from the exact verified address above.
   * TODO(LAUNCH): replace with the exact place-embed URL
   * (https://www.google.com/maps/embed?pb=...) once the client supplies it —
   * configuration only, no coordinates are ever invented here.
   */
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=' +
    encodeURIComponent(
      'BUILDING NO 78, Bhawanidham Phase-1, Chhatrapati Nagar, AYODHAYA HUZUR, Ayodhya Nagar, Bhopal, Madhya Pradesh 462041',
    ) +
    '&z=15&output=embed',
} as const

/**
 * Social profiles.
 * TODO(LAUNCH): set each real profile URL (e.g. 'https://instagram.com/…').
 * While null the footer renders a clearly marked placeholder — profiles are
 * never invented.
 */
export const SOCIALS = {
  instagram: null as string | null,
  facebook: null as string | null,
  linkedin: null as string | null,
} as const

/**
 * Agency credit.
 * TODO(LAUNCH): set the official Never Ending Services website URL — the name
 * becomes a clickable link as soon as it is configured. No domain is invented.
 */
export const CREDIT = {
  label: 'Designed & Developed by Never Ending Services',
  company: 'Never Ending Services',
  url: null as string | null,
} as const

export const ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/shop', label: 'Shop' },
  { path: '/contact', label: 'Contact' },
] as const

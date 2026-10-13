/**
 * Central site configuration — single place to update before launch.
 *
 * IMPORTANT — production domain:
 * The live domain has NOT been confirmed. `siteUrl` below is a placeholder.
 * Replace it with the real canonical origin (e.g. https://www.civimgrains.com)
 * before launch. The sitemap (`public/sitemap.xml`) and robots.txt reference
 * this same value — keep them in sync via `npm run build:seo` (see README).
 * Do NOT publish localhost URLs in the sitemap.
 */
export const SITE = {
  name: 'CIVIM GRAINS',
  brandLine: 'Kisaan Se Rasoi Tak',
  tagline: 'Pure Goodness, Green & Clean.',
  claim: '100% Pure Mustard Oil',
  // TODO(LAUNCH): replace with the confirmed production origin.
  siteUrl: 'https://www.civimgrains.com',
  description:
    'CIVIM GRAINS — Kisaan Se Rasoi Tak. 100% Pure Mustard Oil plus rice, wheat flour, multigrain flour and pulses for everyday Indian kitchens.',
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
  mapsUrl: 'https://share.google/YGApaOxk34JzmACed',
} as const

export const ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/shop', label: 'Shop' },
  { path: '/contact', label: 'Contact' },
] as const

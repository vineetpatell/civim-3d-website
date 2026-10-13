import { useEffect } from 'react'
import { CONTACT, SITE } from './site'

export interface Breadcrumb {
  name: string
  path: string
}

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  /** Set for cart/checkout (and any non-public route). */
  noindex?: boolean
  breadcrumbs?: Breadcrumb[]
  jsonLd?: Record<string, unknown>[]
}

/**
 * Per-route SEO for the SPA.
 *
 * Sets unique title / meta description / Open Graph tags on navigation.
 * Canonical + og:url are emitted ONLY when SITE.siteUrlConfirmed is true —
 * we never publish a canonical pointing at an unverified domain or localhost.
 * `noindex` marks transactional routes (cart/checkout) as noindex,nofollow.
 * JSON-LD is limited to accurate entities: Organization, WebSite,
 * BreadcrumbList (and caller-supplied verified blocks such as Product —
 * never with invented price/rating/availability data).
 */
export function Seo({ title, description, path, image, noindex, breadcrumbs, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title

    setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', SITE.name, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    if (image) {
      const abs = image.startsWith('http') ? image : `${SITE.siteUrl}${image}`
      setMeta('og:image', abs, 'property')
      setMeta('twitter:image', abs)
    }

    // Canonical — only from the confirmed production domain.
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (SITE.siteUrlConfirmed) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = `${SITE.siteUrl}${path === '/' ? '/' : path}`
      setMeta('og:url', `${SITE.siteUrl}${path === '/' ? '/' : path}`, 'property')
    } else if (canonical) {
      canonical.remove()
    }

    // Structured data: replace previous route's blocks.
    document
      .querySelectorAll('script[data-seo-jsonld]')
      .forEach((el) => el.remove())
    const blocks: Record<string, unknown>[] = [
      organizationJsonLd(),
      websiteJsonLd(),
      ...(breadcrumbs ? [breadcrumbJsonLd(breadcrumbs)] : []),
      ...(jsonLd ?? []),
    ]
    for (const block of blocks) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', 'true')
      script.text = JSON.stringify(block)
      document.head.appendChild(script)
    }
  }, [title, description, image, noindex, path, breadcrumbs, jsonLd])

  return null
}

function setMeta(key: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    slogan: SITE.tagline,
    // TODO(LAUNCH): SITE.siteUrl is a placeholder until the domain is confirmed.
    url: SITE.siteUrl,
    email: CONTACT.email,
    telephone: '+91-8450912454',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'BUILDING NO 78, Bhawanidham Phase-1, Chhatrapati Nagar, AYODHAYA HUZUR, Ayodhya Nagar',
      addressLocality: 'Bhopal',
      addressRegion: 'Madhya Pradesh',
      postalCode: '462041',
      addressCountry: 'IN',
    },
  }
}

function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    // TODO(LAUNCH): placeholder URL — replace when the domain is confirmed.
    url: SITE.siteUrl,
  }
}

function breadcrumbJsonLd(items: Breadcrumb[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      // Relative-safe: resolved against SITE.siteUrl at launch.
      item: `${SITE.siteUrl}${item.path}`,
    })),
  }
}

/**
 * Product structured data — VERIFIED fields only.
 * Deliberately omits offers/price/availability/rating unless the caller
 * passes a confirmed price, so no fabricated commerce data is ever published.
 */
export function productJsonLd(input: {
  name: string
  description: string
  path: string
  image?: string | null
  price?: number | null
  category?: string
}): Record<string, unknown> {
  const block: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    brand: { '@type': 'Brand', name: SITE.name },
    url: `${SITE.siteUrl}${input.path}`,
  }
  if (input.category) block.category = input.category
  if (input.image) {
    block.image = input.image.startsWith('http')
      ? input.image
      : `${SITE.siteUrl}${input.image}`
  }
  // Only publish an offer when a real price exists — never invent one.
  if (typeof input.price === 'number') {
    block.offers = {
      '@type': 'Offer',
      price: input.price,
      priceCurrency: 'INR',
      url: `${SITE.siteUrl}${input.path}`,
    }
  }
  return block
}

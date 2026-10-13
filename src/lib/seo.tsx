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
  breadcrumbs?: Breadcrumb[]
  jsonLd?: Record<string, unknown>[]
}

/**
 * Per-route SEO for the SPA.
 *
 * Sets unique title / meta description / Open Graph tags on navigation.
 * Canonical + og:url are intentionally OMITTED until the production domain
 * is confirmed (see SITE.siteUrl) — we never publish localhost URLs.
 * JSON-LD is limited to accurate entities: Organization, WebSite and
 * BreadcrumbList. No Product / review / price / availability markup, because
 * those details are unverified.
 */
export function Seo({ title, description, image, breadcrumbs, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title

    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', SITE.name, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    if (image) {
      setMeta('og:image', image, 'property')
      setMeta('twitter:image', image)
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
  }, [title, description, image, breadcrumbs, jsonLd])

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

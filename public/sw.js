// CIVIM GRAINS — Service Worker
// Caches app shell and static assets only.
// Excludes checkout/customer/payment data and dynamic cart state.

const CACHE_NAME = 'civim-grains-v1'
const APP_SHELL = [
  '/',
  '/shop',
  '/cart',
  '/about',
  '/contact',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-maskable-512x512.png',
  '/civim-grains-logo.png',
  '/bottle-front.png',
  '/bottle-back.png',
]

// Static asset patterns to cache on install
const STATIC_PATTERNS = [
  /\.(js|css)$/,
  /\.(png|jpg|jpeg|webp|ico|svg)$/,
  /\.(woff2?|ttf|otf|eot)$/,
]

// Never cache these routes (checkout, payment, customer data)
const EXCLUDED_PATHS = [
  '/checkout',
  '/cart/checkout',
  '/payment',
  '/customer',
  '/api/',
]

function isExcluded(url) {
  return EXCLUDED_PATHS.some((p) => url.pathname.startsWith(p))
}

function isStaticAsset(url) {
  return STATIC_PATTERNS.some((re) => re.test(url.pathname))
}

// Install — cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch — cache-first for static assets, network-first for pages, offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and excluded paths
  if (request.method !== 'GET' || isExcluded(url)) return

  // Skip external requests
  if (url.origin !== self.location.origin) return

  // HTML pages: network-first with cache fallback
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
        }
        return response
      }).catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/'))
      )
    )
    return
  }

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((c) => c.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // Everything else: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})
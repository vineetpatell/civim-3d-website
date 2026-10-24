/**
 * Client-side studio-background removal for the real product photo.
 *
 * The supplied photo (`/bottle-front.png`) is opaque: the bottle sits on a
 * pure-white studio backdrop. CSS `mix-blend-mode: multiply` cannot melt that
 * box away (any `filter` on the image isolates the blending, and the opaque
 * rectangle also breaks silhouette drop-shadows). Instead we cut the
 * background out once, at runtime, with an edge-seeded flood fill:
 *
 * - Only white connected to the image border is removed, so interior whites
 *   (the label paper, highlight stripes inside the glass) are preserved.
 * - A pixel counts as background only when all channels are high AND the
 *   spread is low, so saturated amber edges and the red cap stop the fill.
 * - Boundary pixels are feathered by whiteness for a smooth 1px edge.
 *
 * No pixels of the bottle itself are redrawn or cropped — cap, collar, amber
 * body, reflections and label artwork survive exactly as photographed.
 */
const SEED = { r: 242, g: 242, b: 240 }
const GROW = { min: 225, bMin: 218, spread: 40 }

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`could not load ${url}`))
    img.src = url
  })
}

const cache = new Map<string, Promise<string>>()

export function cutoutBottle(url = '/bottle-front.png'): Promise<string> {
  if (!cache.has(url)) {
    cache.set(url, doCutout(url).catch(() => url))
  }
  return cache.get(url)!
}

async function doCutout(url: string): Promise<string> {
  const img = await loadImage(url)
  const w = img.naturalWidth
  const h = img.naturalHeight
  if (!w || !h) return url

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return url
  ctx.drawImage(img, 0, 0)

  const data = ctx.getImageData(0, 0, w, h)
  const px = data.data
  const visited = new Uint8Array(w * h)
  const stack: number[] = []

  const isSeed = (i: number) =>
    px[i] >= SEED.r && px[i + 1] >= SEED.g && px[i + 2] >= SEED.b
  const isBg = (i: number) => {
    const r = px[i]
    const g = px[i + 1]
    const b = px[i + 2]
    if (r < GROW.min || g < GROW.min || b < GROW.bMin) return false
    const mx = Math.max(r, g, b)
    const mn = Math.min(r, g, b)
    return mx - mn <= GROW.spread
  }

  // Seed from every border pixel (background touches all four edges).
  for (let x = 0; x < w; x++) {
    const t = x * 4
    const b = (w * (h - 1) + x) * 4
    if (isSeed(t)) {
      visited[x] = 1
      stack.push(x)
    }
    if (isSeed(b)) {
      const bi = w * (h - 1) + x
      if (!visited[bi]) {
        visited[bi] = 1
        stack.push(bi)
      }
    }
  }
  for (let y = 0; y < h; y++) {
    const l = y * w
    const r = y * w + (w - 1)
    if (isSeed(l * 4) && !visited[l]) {
      visited[l] = 1
      stack.push(l)
    }
    if (isSeed(r * 4) && !visited[r]) {
      visited[r] = 1
      stack.push(r)
    }
  }

  while (stack.length) {
    const p = stack.pop()!
    const x = p % w
    const y = (p - x) / w
    // 4-neighbours
    if (x > 0) {
      const n = p - 1
      if (!visited[n] && isBg(n * 4)) {
        visited[n] = 1
        stack.push(n)
      }
    }
    if (x < w - 1) {
      const n = p + 1
      if (!visited[n] && isBg(n * 4)) {
        visited[n] = 1
        stack.push(n)
      }
    }
    if (y > 0) {
      const n = p - w
      if (!visited[n] && isBg(n * 4)) {
        visited[n] = 1
        stack.push(n)
      }
    }
    if (y < h - 1) {
      const n = p + w
      if (!visited[n] && isBg(n * 4)) {
        visited[n] = 1
        stack.push(n)
      }
    }
  }

  // Apply: connected background → transparent; boundary pixels contract
  // inward by whiteness so no pale fringe survives on the amber edges.
  for (let p = 0; p < w * h; p++) {
    const i = p * 4
    if (visited[p]) {
      px[i + 3] = 0
      continue
    }
    const x = p % w
    const y = (p - x) / w
    const touchesBg =
      (x > 0 && visited[p - 1]) ||
      (x < w - 1 && visited[p + 1]) ||
      (y > 0 && visited[p - w]) ||
      (y < h - 1 && visited[p + w])
    if (touchesBg) {
      const mn = Math.min(px[i], px[i + 1], px[i + 2])
      const white = Math.min(1, Math.max(0, (mn - 165) / 90))
      if (white > 0) px[i + 3] = Math.round(255 * (1 - white))
    }
  }
  ctx.putImageData(data, 0, 0)

  const blob: Blob | null = await new Promise((resolve) => {
    try {
      canvas.toBlob(resolve, 'image/png')
    } catch {
      resolve(null)
    }
  })
  if (blob) return URL.createObjectURL(blob)
  // Headless / restricted canvas: toBlob can resolve null. toDataURL is
  // synchronous and succeeds in the same situations — use it as fallback.
  try {
    const url2 = canvas.toDataURL('image/png')
    if (url2 && url2.length > 1000) return url2
  } catch {
    /* fall through to original url */
  }
  return url
}

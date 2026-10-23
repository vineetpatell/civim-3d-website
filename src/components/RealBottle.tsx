import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { cutoutBottle } from '../lib/cutout'

/**
 * Real CIVIM product photo as the hero visual.
 *
 * Front (`/bottle-front.png`, 887×1774) and back (`/bottle-back.png`)
 * product photos crossfade with a subtle scale/rotation illusion. Only one
 * bottle image is ever fully visible at a time — the flip cycles between the
 * two labels so both faces of the bottle are seen without showing two bottles
 * simultaneously.
 *
 * The front photo renders immediately; once `lib/cutout.ts` finishes its
 * border-connected flood fill the src upgrades to the transparent version,
 * so glass edges, highlights and amber reflections survive untouched.
 *
 * Motion is layered to avoid transform conflicts:
 *   outer (.hero__bottle)      — scroll-linked drift (GSAP scrub)
 *   middle (.hero__bottle-mouse) — mouse parallax (quickTo)
 *   inner (.hero__bottle-float)  — gentle idle float (yoyo)
 *   images (.hero__bottle-images) — front↔back crossfade (every 7s)
 */
export function RealBottle({ reduced }: { reduced: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  // Original photo first (instant paint); transparent cut-out swaps in async.
  // The wrapper reserves the exact aspect-ratio box so layout never shifts.
  const [src, setSrc] = useState<string>('/bottle-front.png')
  const [isCutout, setIsCutout] = useState(false)

  useEffect(() => {
    let live = true
    cutoutBottle()
      .then((u) => {
        // Only swap when we got a real transparent result (blob:/data:);
        // the plain photo stays as the interim/fallback otherwise.
        if (live && u && u !== '/bottle-front.png') {
          setSrc(u)
          setIsCutout(true)
        }
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  useGSAP(
    () => {
      const scrollEl = scrollRef.current
      const mouseEl = mouseRef.current
      const floatEl = floatRef.current
      if (!scrollEl || !mouseEl || !floatEl) return

      if (reduced) {
        gsap.set([scrollEl, mouseEl, floatEl], { clearProps: 'transform' })
        return
      }

      // Gentle idle float — single-unit, preserves photo integrity.
      const float = gsap.to(floatEl, {
        y: -10,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Subtle mouse parallax.
      const qx = gsap.quickTo(mouseEl, 'x', { duration: 0.7, ease: 'power3.out' })
      const qy = gsap.quickTo(mouseEl, 'y', { duration: 0.7, ease: 'power3.out' })
      const qr = gsap.quickTo(mouseEl, 'rotation', { duration: 0.9, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        qx(nx * 18)
        qy(ny * 12)
        qr(nx * 1.4)
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      // Scroll-linked drift across the hero. The bottle stays framed inside
      // the sticky stage — it never drifts into sections below.
      const drift = gsap.to(scrollEl, {
        y: -36,
        rotation: -1.2,
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      // Front ↔ back crossfade timeline — runs indefinitely with holds between
      // fades so each label is readable for several seconds. Uses autoAlpha so
      // the inactive image also gets `visibility: hidden` (no paint, no flash).
      const frontImg = document.querySelector('.hero__bottle-image--front')
      const backImg = document.querySelector('.hero__bottle-image--back')
      if (frontImg && backImg) {
        gsap.set(backImg, { autoAlpha: 0 })
        const flip = gsap.timeline({ repeat: -1 })
        flip
          .to(frontImg, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, 0)
          .to(backImg, { autoAlpha: 1, duration: 0.8, ease: 'power2.inOut' }, 0)
          .to({}, { duration: 6 }) // hold back label visible
          .to(frontImg, { autoAlpha: 1, duration: 0.8, ease: 'power2.inOut' })
          .to(backImg, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' })
          .to({}, { duration: 6 }) // hold front label visible
      }

      return () => {
        float.kill()
        drift.scrollTrigger?.kill()
        drift.kill()
        window.removeEventListener('pointermove', onMove)
      }
    },
    { dependencies: [reduced] },
  )

  const frontSrc = isCutout ? src : '/bottle-front.png'
  const backSrc = '/bottle-back.png'

  return (
    <div
      ref={scrollRef}
      className={`hero__bottle${isCutout ? ' is-cutout' : ''}`}
      role="img"
      aria-label={`CIVIM Grains Cold Pressed Mustard Oil — product bottle`}
    >
      <div ref={mouseRef} className="hero__bottle-mouse">
        <div ref={floatRef} className="hero__bottle-float">
          <div className="hero__bottle-images">
            <img
              src={frontSrc}
              alt="CIVIM Grains Cold Pressed Mustard Oil bottle — front label"
              className={`hero__bottle-image hero__bottle-image--front`}
              width={887}
              height={1774}
              decoding="async"
              fetchPriority="high"
              draggable={false}
            />
            <img
              src={backSrc}
              alt="CIVIM Grains Cold Pressed Mustard Oil bottle — back label"
              className={`hero__bottle-image hero__bottle-image--back`}
              width={887}
              height={1774}
              decoding="async"
              draggable={false}
            />
          </div>
          <div className="hero__bottle-shadow" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { cutoutBottle } from '../lib/cutout'

/**
 * Real CIVIM product photo as the hero visual.
 *
 * Uses the complete original photograph (`/bottle-front.png`, 887×1774,
 * opaque) — full silhouette, red cap, yellow collar, amber body, reflections
 * and label artwork preserved exactly. No cropping of cap/base, no redraw.
 *
 * The photo renders immediately; once `lib/cutout.ts` finishes its
 * border-connected flood fill the src upgrades to the transparent version,
 * so glass edges, highlights and amber reflections survive untouched.
 *
 * Motion is layered to avoid transform conflicts:
 *   outer (.hero__bottle)      — scroll-linked drift (GSAP scrub)
 *   middle (.hero__bottle-mouse) — mouse parallax (quickTo)
 *   inner (.hero__bottle-float)  — gentle idle float (yoyo)
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

      // Scroll-linked drift across the tall hero. NOTE: no `scope` is set on
      // this useGSAP call, so the '.hero' trigger resolves globally here.
      // Kept small on purpose: the bottle must stay framed and never drift
      // into the sections below — the sticky stage clips at its own bounds.
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

      return () => {
        float.kill()
        drift.scrollTrigger?.kill()
        drift.kill()
        window.removeEventListener('pointermove', onMove)
      }
    },
    { dependencies: [reduced] },
  )

  return (
    <div
      ref={scrollRef}
      className={`hero__bottle${isCutout ? ' is-cutout' : ''}`}
      role="img"
      aria-label="CIVIM Grains Cold Pressed Mustard Oil — real front-facing product bottle"
    >
      <div ref={mouseRef} className="hero__bottle-mouse">
        <div ref={floatRef} className="hero__bottle-float">
          <img
            src={src}
            alt="CIVIM Grains Cold Pressed Mustard Oil bottle — red cap, yellow collar, amber oil and front label"
            className="hero__bottle-img"
            width={887}
            height={1774}
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />
          <div className="hero__bottle-shadow" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

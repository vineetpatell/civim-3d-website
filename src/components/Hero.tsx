import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { heroProgress } from '../lib/heroProgress'
import { useInView } from '../lib/useInView'
import { useReducedMotion } from '../lib/useReducedMotion'
import { Scene } from '../three/Scene'
import { RealBottle } from './RealBottle'

/**
 * Cinematic hero: a tall scroll container drives a sticky stage.
 *
 * The product is the untouched original photograph (`/bottle-front.png`)
 * rendered by <RealBottle> — full silhouette, red cap, yellow collar, amber
 * body, reflections and label preserved exactly, animated as a single unit.
 * The WebGL canvas behind it renders only drifting harvest dust (plus warm
 * studio light); ScrollTrigger scrubs the shared `heroProgress` (0→1) which
 * both layers read.
 *
 * The editorial column (eyebrow, headline, claim, copy, CTAs) is the
 * persistent brand message; a "pour" accent fades in mid-scroll.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { threshold: 0 })
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const rootEl = root.current
      if (!rootEl) return

      if (reduced) {
        // No scroll choreography: show the composed hero as a still frame.
        gsap.set('.hero__editorial > *', { autoAlpha: 1, y: 0 })
        gsap.set('.hero__bottle', { autoAlpha: 1, y: 0 })
        gsap.set('.hero__pour', { autoAlpha: 0 })
        gsap.set('.hero__scroll-hint', { autoAlpha: 0 })
        heroProgress.value = 0.3
        return
      }

      // Entrance: `immediateRender: false` so the pre-mount CSS state (fully
      // visible) stays until the tween actually starts — no frozen FOUC if
      // GSAP ticks late (e.g. headless/virtual-time environments).
      gsap.from('.hero__editorial > *', {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.15,
        immediateRender: false,
      })
      // Bottle entrance is opacity-only: <RealBottle> owns this element's
      // transform (scroll drift), so animating y here would fight the scrub.
      gsap.from('.hero__bottle', {
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.25,
        immediateRender: false,
      })

      // Drive the ambient narrative purely from scroll progress.
      ScrollTrigger.create({
        trigger: rootEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          heroProgress.value = self.progress
        },
      })

      // Overlay copy: a scrubbed timeline keyed to the same scroll span.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      // Editorial column drifts up gently and softens as the pour takes over,
      // but stays clearly readable (it carries the brand message + CTAs).
      tl.to('.hero__editorial', { y: -24, opacity: 0.6, ease: 'none' }, 0)
      tl.to('.hero__scroll-hint', { autoAlpha: 0, duration: 0.2 }, 0)

      // "Kisaan Se Rasoi Tak" pour accent arrives mid-scroll beside the bottle.
      tl.fromTo(
        '.hero__pour',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.5,
      ).to('.hero__pour', { autoAlpha: 0, y: -20, duration: 0.25 }, 0.86)
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: false },
  )

  return (
    <div className="hero" id="top" ref={root}>
      <div className="hero__stage">
        <div className="hero__canvas" aria-hidden="true">
          <Scene reduced={reduced} inView={inView} />
        </div>

        <div className="hero__overlay">
          <div className="shell hero__grid">
            <div className="hero__editorial">
              <span className="hero__eyebrow">
                <span className="hero__eyebrow-dot" />
                Kisaan Se Rasoi Tak
              </span>

              <h1 className="hero__title">
                Pure <em>Goodness,</em>
                <br />
                Green &amp; Clean.
              </h1>

              <p className="hero__sub">
                Stone-cold purity in every drop — our mustard oil carries the
                warmth of the field straight to your kitchen.
              </p>

              <div className="hero__actions">
                <a className="btn btn--primary" href="#story">
                  Our Story
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <a className="btn btn--ghost" href="#process">
                  The Process
                </a>
              </div>

              <span className="hero__claim">
                <span className="hero__claim-dot" />
                100% Pure Mustard Oil
              </span>
            </div>

            {/* The real product photograph — the hero centerpiece. */}
            <RealBottle reduced={reduced} />

            {/* Pour accent, appears beside the bottle mid-scroll. */}
            <div className="hero__pour" aria-hidden="true">
              <span className="hero__pour-mark" />
              <h2>Kisaan Se Rasoi Tak.</h2>
              <p>Poured golden — from harvest to kitchen.</p>
            </div>
          </div>
        </div>

        <div className="hero__scroll-hint" aria-hidden="true">
          <span>Scroll to pour</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </div>
  )
}

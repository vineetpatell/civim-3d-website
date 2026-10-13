import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { heroProgress } from '../lib/heroProgress'
import { useInView } from '../lib/useInView'
import { useReducedMotion } from '../lib/useReducedMotion'
import { whatsappUrl, GENERAL_ENQUIRY_MESSAGE } from '../lib/whatsapp'
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
 * No floating overlay copy: the editorial column is the single message, so
 * nothing can collide with the bottle mid-scroll. The sticky stage ends
 * cleanly before the next section (see nav-hero.css: .hero has no negative
 * margins; sections stack in normal flow).
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
      const progress = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          heroProgress.value = self.progress
        },
      })

      // Editorial column drifts up gently as the stage exits — small travel,
      // stays readable, never leaves the sticky stage to overlap sections.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
      tl.to('.hero__editorial', { y: -24, opacity: 0.85, ease: 'none' }, 0)
      tl.to('.hero__scroll-hint', { autoAlpha: 0, duration: 0.2 }, 0)

      return () => {
        progress.kill()
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
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
                <span className="hero__eyebrow-dot" aria-hidden="true" />
                Kisaan Se Rasoi Tak
              </span>

              <h1 className="hero__title">
                Pure <em>Goodness,</em>
                <br />
                Green &amp; Clean.
              </h1>

              <p className="hero__sub">
                100% Pure Mustard Oil for everyday Indian cooking — from the
                field to your kitchen.
              </p>

              <div className="hero__actions">
                <a
                  className="btn btn--primary"
                  href={whatsappUrl(GENERAL_ENQUIRY_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order on WhatsApp
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <Link className="btn btn--ghost" to="/shop">
                  Explore Products
                </Link>
              </div>

              <span className="hero__claim">
                <span className="hero__claim-dot" aria-hidden="true" />
                100% Pure Mustard Oil
              </span>
            </div>

            {/* The real product photograph — the hero centerpiece. */}
            <RealBottle reduced={reduced} />
          </div>
        </div>

        <div className="hero__scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </div>
  )
}


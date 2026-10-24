import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP } from '../lib/gsap'
import { heroProgress } from '../lib/heroProgress'
import { useInView } from '../lib/useInView'
import { useReducedMotion } from '../lib/useReducedMotion'
import { whatsappUrl, GENERAL_ENQUIRY_MESSAGE } from '../lib/whatsapp'
import { Scene } from '../three/Scene'
import { BottleStager } from './BottleStager'

export function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { threshold: 0 })
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const rootEl = root.current
      const stageEl = stage.current
      if (!rootEl || !stageEl) return

      if (reduced) {
        gsap.set('.hero__editorial > *', { autoAlpha: 1, y: 0 })
        gsap.set('.bottle-stage', { autoAlpha: 1, y: 0 })
        gsap.set('.hero__scroll-hint', { autoAlpha: 0 })
        gsap.set('.hero__story-line--side, .hero__story-line--back', { autoAlpha: 0 })
        gsap.set('.hero__story-line--front', { autoAlpha: 1 })
        heroProgress.value = 0.3
        return
      }

      gsap.from('.hero__editorial > *', {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.15,
        immediateRender: false,
      })
      gsap.from('.bottle-stage', {
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.25,
        immediateRender: false,
      })

      const endDistance = () => {
        const mobile = window.matchMedia('(max-width: 767px)').matches
        const mult = mobile ? 2.0 : 2.5
        return '+=' + Math.round(window.innerHeight * mult)
      }

      gsap.set('.bottle-stage__image--front', { autoAlpha: 1 })
      gsap.set('.bottle-stage__image--side, .bottle-stage__image--back', { autoAlpha: 0 })
      gsap.set('.hero__story-line--front', { autoAlpha: 1 })
      gsap.set('.hero__story-line--side, .hero__story-line--back', { autoAlpha: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'top top',
          end: endDistance,
          pin: stageEl,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            heroProgress.value = self.progress
          },
        },
      })

      tl.to('.hero__scroll-hint', { autoAlpha: 0, duration: 0.15 }, 0)

      tl.to('.bottle-stage__image--front', { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, 0.3)
      tl.to('.bottle-stage__image--side', { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, 0.3)
      tl.to('.hero__story-line--front', { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, 0.3)
      tl.to('.hero__story-line--side', { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, 0.3)

      tl.to('.bottle-stage__image--side', { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, 0.63)
      tl.to('.bottle-stage__image--back', { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, 0.63)
      tl.to('.hero__story-line--side', { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, 0.63)
      tl.to('.hero__story-line--back', { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, 0.63)

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <div className="hero" id="top" ref={root}>
      <div className="hero__stage" ref={stage}>
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

              <div className="hero__story">
                <p className="hero__sub hero__story-line hero__story-line--front">
                  100% Pure Mustard Oil for everyday Indian cooking — from the
                  field to your kitchen.
                </p>
                <p className="hero__sub hero__story-line hero__story-line--side">
                  From kisaan to rasoi — mustard seeds sourced and pressed with
                  care, the way it has always been done.
                </p>
                <p className="hero__sub hero__story-line hero__story-line--back">
                  Quality you can trust on every pack — 100% Pure Mustard Oil,
                  ready for your kitchen.
                </p>
              </div>

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

            <BottleStager />
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
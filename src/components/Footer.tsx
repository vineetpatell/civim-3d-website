import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // immediateRender:false — content stays visible until the trigger fires.
      gsap.from('[data-reveal]', {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
        },
      })
    },
    { scope: ref },
  )

  return (
    <footer className="footer" ref={ref}>
      <div className="shell">
        <div className="footer__top">
          <div>
            <div className="footer__brand-name" data-reveal>
              CIVIM GRAINS
            </div>
            <div className="footer__tag" data-reveal>
              Pure Goodness, Green &amp; Clean
            </div>
            <p className="footer__claim" data-reveal>
              Kisaan Se Rasoi Tak — 100% Pure Mustard Oil.
            </p>
            <p className="footer__note" data-reveal>
              This is a concept site. Product details, availability and any
              certifications shown here are illustrative and should be verified
              before public launch.
            </p>
          </div>

          <nav className="footer__links" aria-label="Footer">
            <a href="#story" data-reveal>
              Our Story
            </a>
            <a href="#purity" data-reveal>
              Purity Promise
            </a>
            <a href="#process" data-reveal>
              From Field to Kitchen
            </a>
            <a href="#top" data-reveal>
              Back to top
            </a>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} CIVIM GRAINS. All rights reserved.</span>
          <span>Kisaan Se Rasoi Tak.</span>
        </div>
      </div>
    </footer>
  )
}

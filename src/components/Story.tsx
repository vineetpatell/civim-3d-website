import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

export function Story() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // immediateRender:false — content stays visible until each trigger fires.
      gsap.from('[data-reveal]', {
        y: 36,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        immediateRender: false,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 72%',
        },
      })
    },
    { scope: ref },
  )

  return (
    <section className="section story" id="story" ref={ref}>
      <div className="shell story__grid">
        <div>
          <span className="eyebrow" data-reveal>
            Our Story
          </span>
          <h2 className="story__heading" data-reveal>
            Kisaan Se <em>Rasoi Tak.</em>
          </h2>
        </div>

        <div className="story__body">
          <p className="lede" data-reveal>
            CIVIM GRAINS begins in the field, not the factory. We work directly
            with farmers to bring you mustard oil that is pure, clean and
            honest — from the soil to your kitchen.
          </p>
          <p data-reveal>
            Every batch is crafted to preserve the natural pungency, aroma and
            golden richness that define real mustard oil. No shortcuts. No
            compromise. Just pure goodness, carried from the kisaan's harvest to
            the rasoi where your food comes alive.
          </p>

          <div className="story__stats" data-reveal>
            <div className="stat">
              <div className="stat__value">100%</div>
              <div className="stat__label">Pure mustard oil</div>
            </div>
            <div className="stat">
              <div className="stat__value">Farm</div>
              <div className="stat__label">Direct sourcing</div>
            </div>
            <div className="stat">
              <div className="stat__value">Clean</div>
              <div className="stat__label">Green process</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

const STEPS = [
  {
    num: '01',
    title: 'The Harvest',
    body: 'Mustard seeds are gathered from trusted farms at peak season, when their natural oils are richest.',
  },
  {
    num: '02',
    title: 'The Press',
    body: 'Cold-pressed with care to lock in aroma, pungency and the deep golden colour of real mustard oil.',
  },
  {
    num: '03',
    title: 'The Rasoi',
    body: 'Sealed fresh and carried straight to your kitchen — Kisaan Se Rasoi Tak, goodness intact.',
  },
]

export function Process() {
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
    <section className="section process" id="process" ref={ref}>
      <div className="shell">
        <div className="process__head">
          <div>
            <span className="eyebrow" data-reveal>
              From Field to Kitchen
            </span>
            <h2 className="process__heading" data-reveal>
              The journey of every drop.
            </h2>
          </div>
        </div>

        <div className="process__list">
          {STEPS.map((s) => (
            <div className="process__step" key={s.num} data-reveal>
              <span className="process__step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

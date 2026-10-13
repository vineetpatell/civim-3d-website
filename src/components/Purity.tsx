import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

const PILLARS = [
  {
    num: '01',
    title: '100% Pure',
    body: 'Single-origin mustard oil, nothing added and nothing taken away. Purity you can taste in every drop.',
  },
  {
    num: '02',
    title: 'Green & Clean',
    body: 'A cleaner process that respects the grain and the earth — goodness that stays true to its source.',
  },
  {
    num: '03',
    title: 'Kisaan First',
    body: 'Sourced straight from farmers, so freshness travels the shortest path from field to kitchen.',
  },
]

export function Purity() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // immediateRender:false — content stays visible until each trigger fires.
      gsap.from('[data-reveal]', {
        y: 40,
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
    <section className="section purity" id="purity" ref={ref}>
      <div className="shell">
        <div className="purity__head">
          <span className="eyebrow" data-reveal>
            The CIVIM Promise
          </span>
          <h2 className="purity__heading" data-reveal>
            Pure Goodness, Green &amp; Clean.
          </h2>
        </div>

        <div className="purity__grid">
          {PILLARS.map((p) => (
            <article className="purity__cell" key={p.num} data-reveal>
              <span className="purity__cell-num">{p.num}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

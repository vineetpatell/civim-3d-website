import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

const LINKS = [
  { label: 'Story', href: '#story' },
  { label: 'Purity', href: '#purity' },
  { label: 'Process', href: '#process' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // entrance (immediateRender:false: stays visible until tween starts)
  useGSAP(
    () => {
      gsap.from(navRef.current, {
        y: -24,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
        immediateRender: false,
      })
    },
    { scope: navRef },
  )

  return (
    <header ref={navRef} className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="shell nav__inner">
        <a className="nav__brand" href="#top" aria-label="CIVIM GRAINS home">
          <span className="nav__brand-name">CIVIM</span>
          <span className="nav__brand-tag">Grains · Since Purity</span>
        </a>

        <nav aria-label="Primary">
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--primary nav__cta" href="#purity">
          100% Pure
        </a>
      </div>
    </header>
  )
}

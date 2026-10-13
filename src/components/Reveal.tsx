import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/**
 * Scoped scroll reveal wrapper.
 * Each instance animates ONLY its own children ([data-reveal] inside `ref`),
 * refreshes its trigger after layout/fonts settle, and cleans up on unmount —
 * this is what stops sections from overlapping or freezing mid-scroll.
 */
export function Reveal({
  children,
  className,
  y = 32,
}: {
  children: ReactNode
  className?: string
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const targets = el.querySelectorAll('[data-reveal]')
      if (!targets.length) return
      const tween = gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: ref, revertOnUpdate: true },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

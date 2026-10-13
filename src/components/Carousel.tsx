import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Accessible horizontal carousel.
 * - Working previous/next buttons (disabled at the ends)
 * - Native touch/mouse scrolling (scroll-snap) — no autoplay, ever
 * - Left/Right arrow-key navigation when the track is focused
 * - Responsive: each direct child of the track is one item (give it
 *   `.carousel__item` so widths stay consistent across breakpoints)
 */
export function Carousel({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const first = el.querySelector<HTMLElement>(':scope > *')
    const step = first ? first.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollBy(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollBy(-1)
    }
  }

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        className="carousel__track"
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
      <div className="carousel__controls">
        <button
          type="button"
          className="carousel__btn"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label={`Previous items in ${label}`}
        >
          ←
        </button>
        <button
          type="button"
          className="carousel__btn"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label={`Next items in ${label}`}
        >
          →
        </button>
      </div>
    </div>
  )
}
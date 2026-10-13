import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Observes an element and reports when it intersects the viewport.
 * Used to pause the WebGL render loop once the hero scrolls out of view.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit = { threshold: 0.01 },
): boolean {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      setInView(entries.some((e) => e.isIntersecting))
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  return inView
}

/** Stable ref that always points at the latest value (for rAF loops). */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  ref.current = value
  return ref
}

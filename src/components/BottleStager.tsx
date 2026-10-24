import { useState, useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { cutoutBottle } from '../lib/cutout'

export function BottleStager() {
  const [frontSrc, setFrontSrc] = useState('/bottle-front.png')
  const [sideSrc, setSideSrc] = useState('/bottle-side.png')
  const [backSrc, setBackSrc] = useState('/bottle-back.png')
  const [isCutout, setIsCutout] = useState(false)

  useEffect(() => {
    let live = true
    Promise.all([
      cutoutBottle('/bottle-front.png'),
      cutoutBottle('/bottle-side.png'),
      cutoutBottle('/bottle-back.png'),
    ])
      .then(([f, s, b]) => {
        if (!live) return
        if (f && f !== '/bottle-front.png') setFrontSrc(f)
        if (s && s !== '/bottle-side.png') setSideSrc(s)
        if (b && b !== '/bottle-back.png') setBackSrc(b)
        setIsCutout(true)
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  return (
    <div
      className={`bottle-stage${isCutout ? ' is-cutout' : ''}`}
      role="img"
      aria-label="CIVIM Grains Cold Pressed Mustard Oil bottle"
    >
      <div className="bottle-stage__images">
        <img
          src={frontSrc}
          alt="CIVIM Grains Cold Pressed Mustard Oil bottle — front label"
          className="bottle-stage__image bottle-stage__image--front"
          width={887}
          height={1774}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          draggable={false}
        />
        <img
          src={sideSrc}
          alt="CIVIM Grains Cold Pressed Mustard Oil bottle — side"
          className="bottle-stage__image bottle-stage__image--side"
          width={1936}
          height={3232}
          loading="eager"
          decoding="async"
          draggable={false}
        />
        <img
          src={backSrc}
          alt="CIVIM Grains Cold Pressed Mustard Oil bottle — back label"
          className="bottle-stage__image bottle-stage__image--back"
          width={1936}
          height={3232}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>
      <div className="bottle-stage__shadow" aria-hidden="true" />
    </div>
  )
}
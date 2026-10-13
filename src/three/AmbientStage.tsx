import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { heroProgress } from '../lib/heroProgress'
import { COLORS } from './palette'

/**
 * Ambient 3D stage behind the real product photograph.
 *
 * The hero product is the untouched original photo (see <RealBottle>); this
 * WebGL layer renders only atmosphere — drifting golden harvest dust — with
 * mouse parallax and scroll-linked motion, reduced-motion aware. The warm
 * glow behind the bottle is a CSS radial wash (see nav-hero.css), which
 * feathers softly unlike a hard-edged plane.
 */
export function AmbientStage({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Points>(null!)
  const rig = useRef<THREE.Group>(null!)

  const { positions, seeds } = useMemo(() => {
    const N = 140
    const positions = new Float32Array(N * 3)
    const seeds = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9
      positions[i * 3 + 1] = Math.random() * 5 - 0.6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5
      seeds[i] = Math.random() * Math.PI * 2
    }
    return { positions, seeds }
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(COLORS.mustardLight),
        size: 0.035,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  )

  /* Warm glow is CSS-only (.hero__stage::before); WebGL renders dust alone. */

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const p = heroProgress.value

    if (!reduced) {
      // Mouse parallax on the whole rig.
      const px = state.pointer.x
      const py = state.pointer.y
      if (rig.current) {
        rig.current.rotation.y += (px * 0.12 - rig.current.rotation.y) * 0.04
        rig.current.rotation.x += (py * 0.07 - rig.current.rotation.x) * 0.04
        rig.current.position.y = p * 0.6
      }
      // Drift each mote upward; wrap around.
      if (points.current) {
        const attr = points.current.geometry.getAttribute('position') as THREE.BufferAttribute
        const arr = attr.array as Float32Array
        for (let i = 0; i < seeds.length; i++) {
          arr[i * 3 + 1] += d * (0.06 + 0.05 * Math.sin(seeds[i]))
          arr[i * 3] += Math.sin(t * 0.4 + seeds[i]) * d * 0.05
          if (arr[i * 3 + 1] > 4.6) arr[i * 3 + 1] = -0.6
        }
        attr.needsUpdate = true
      }
    } else {
      if (rig.current) {
        rig.current.rotation.y *= 0.95
        rig.current.rotation.x *= 0.95
      }
    }
  })

  return (
    <group ref={rig}>
      {/* Drifting harvest dust. */}
      <points ref={points} geometry={geo} material={mat} />
    </group>
  )
}

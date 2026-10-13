import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './palette'
import { quality } from './quality'
import { AmbientStage } from './AmbientStage'

type SceneProps = {
  reduced: boolean
  inView: boolean
}

/**
 * Ambient WebGL backdrop for the hero.
 *
 * The product itself is the untouched original photograph (<RealBottle> in
 * the DOM) — this canvas renders only drifting golden dust over warm studio
 * light, with scroll + mouse motion.
 */
export function Scene({ reduced, inView }: SceneProps) {
  return (
    <Canvas
      frameloop={inView ? 'always' : 'never'}
      dpr={[1, quality.value === 'low' ? 1.25 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.8, 7], fov: 32, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          quality.value = 'low'
        }}
      />

      {/* Warm studio wash — light only, the product comes from the photo. */}
      <ambientLight intensity={0.65} color={COLORS.cream} />
      <directionalLight position={[3.5, 6, 5]} intensity={1.1} color="#fff6e3" />
      <directionalLight
        position={[-5, 2.5, 2]}
        intensity={0.5}
        color={COLORS.mustardLight}
      />
      <directionalLight position={[0, 2, -6]} intensity={0.3} />

      <Suspense fallback={null}>
        <AmbientStage reduced={reduced} />
      </Suspense>
    </Canvas>
  )
}

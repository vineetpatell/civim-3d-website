/**
 * Small, allocation-light math helpers used by the scroll-driven narrative.
 * All functions are pure and safe to call every frame inside useFrame.
 */

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)

/** Classic smoothstep remap of `x` from [edge0, edge1] → [0, 1]. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1e-6))
  return t * t * (3 - 2 * t)
}

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t

/**
 * Narrative phases driven by hero scroll progress `p` (0 → 1):
 *   1. cap seals        (p: 0      → 0.42)  cap unscrews & lifts
 *   2. tilt to pour     (p: 0.34   → 0.66)  bottle leans forward
 *   3. golden stream    (p: 0.46   → 0.78)  oil pours, then eases
 */
export const capOpenAt = (p: number): number => smoothstep(0.16, 0.42, p)
export const tiltAt = (p: number): number => smoothstep(0.34, 0.66, p)
export const pourAt = (p: number): number => smoothstep(0.46, 0.78, p)

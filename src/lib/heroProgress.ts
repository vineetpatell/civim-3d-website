/**
 * Shared, mutable scroll-progress store for the hero narrative.
 *
 * GSAP ScrollTrigger writes `value` (0 → 1) as the user scrolls the hero;
 * React Three Fiber reads it inside `useFrame` without triggering re-renders.
 * A plain singleton object is intentional — the 3D loop needs a stable,
 * allocation-free reference each frame.
 */
export const heroProgress = { value: 0 }

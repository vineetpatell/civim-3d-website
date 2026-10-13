/** Mutable quality tier, flipped at runtime by <PerformanceMonitor>. */
export type Quality = 'high' | 'low'
export const quality: { value: Quality } = { value: 'high' }

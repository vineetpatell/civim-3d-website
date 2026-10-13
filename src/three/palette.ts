/**
 * Single source of truth for the CIVIM brand palette, shared by the WebGL
 * scene and (mirrored) in index.css. Keep these in sync.
 *
 * Brand tokens (per brief):
 *   Warm ivory #F7F4EB · Deep forest green #173D2B ·
 *   Mustard gold #D9A52E · Charcoal #262820
 */
export const COLORS = {
  ivory: '#F7F4EB',
  forest: '#173D2B',
  forestDeep: '#102A1F',
  mustard: '#D9A52E',
  mustardLight: '#E4B95A',
  amber: '#C77A15',
  amberDeep: '#8A4E0A',
  charcoal: '#262820',
  cream: '#FCFAF4',
  // Physical bottle accents sampled from the real product photo.
  capRed: '#C1272D',
  capRedDeep: '#8E181C',
  collar: '#E3AE1C',
  glassTint: '#D98A1F',
} as const

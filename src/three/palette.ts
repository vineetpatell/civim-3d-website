/**
 * Single source of truth for the CIVIM brand palette, shared by the WebGL
 * scene and (mirrored) in index.css. Keep these in sync.
 */
export const COLORS = {
  ivory: '#F7F3EA',
  forest: '#1C3A2B',
  forestDeep: '#132A1F',
  mustard: '#C2912B',
  mustardLight: '#E0B44F',
  amber: '#C77A15',
  amberDeep: '#8A4E0A',
  charcoal: '#22221F',
  cream: '#FBF8F1',
  // Physical bottle accents sampled from the real product photo.
  capRed: '#C1272D',
  capRedDeep: '#8E181C',
  collar: '#E3AE1C',
  glassTint: '#D98A1F',
} as const

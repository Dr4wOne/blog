// Design system colors - single source of truth
// Aligns with src/styles/design-system.css

export const COLORS = {
  // Primary palette
  primary: '#6C63FF',        // purple/blue
  primarySoft: '#8080FF',    // lighter variant
  primaryDeep: '#4A42CC',    // darker variant

  // Accent colors
  accent: '#00D9FF',         // cyan
  accentSoft: '#33E0FF',     // lighter cyan
  warm: '#FF6B35',           // orange

  // Background palette
  bg: '#0A0A0F',             // dark background
  bgSurface: '#111118',      // elevated surface
  bgElevated: '#1A1A26',     // more elevated
  bgLight: '#F5F5F7',        // light theme background

  // Text palette
  text: '#F0F0FF',           // primary text
  textMuted: '#8888AA',      // secondary text
  textDim: '#4A4A6A',        // tertiary text
  textDark: '#0A0A0F',       // light theme text

  // Diagram-specific
  white: '#FFFFFF',
  diagramBg: '#F5F5F7',      // light bg for diagram SVGs
  diagramText: '#0A0A0F',    // dark text in diagrams
} as const;

export type ColorKey = keyof typeof COLORS;

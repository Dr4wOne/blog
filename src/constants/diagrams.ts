// Diagram constants - typography, sizing, colors
// Used by Diagrams.astro component

import { COLORS } from './colors';

export const DIAGRAM_TYPOGRAPHY = {
  fontMain: 14,      // main labels in diagrams
  fontLabel: 12,     // secondary labels
  fontSmall: 11,     // small text
  fontCaption: 10,   // captions
} as const;

export const DIAGRAM_SIZING = {
  strokeStandard: 2,         // normal line width
  strokeThick: 2.5,          // emphasized lines
  markerSize: 10,            // arrow marker
  markerRefX: 9,
  markerRefY: 3,
  borderRadius: 3,           // corner radius for rectangles
  circleRadius: 30,          // standard circle size
} as const;

export const DIAGRAM_SPACING = {
  padding: 30,               // general padding
  gap: 50,                   // spacing between elements
  labelOffset: 25,           // distance from element to label
} as const;

// Color theme for diagrams
export const DIAGRAM_COLORS = {
  bg: COLORS.diagramBg,      // #F5F5F7
  text: COLORS.diagramText,  // #0A0A0F
  border: COLORS.primary,    // #6C63FF (purple)
  accent: COLORS.accent,     // #00D9FF (cyan)
  warm: COLORS.warm,         // #FF6B35 (orange)
  white: COLORS.white,       // #FFFFFF
  softBg: COLORS.bgLight,    // #E8E8FF (light purple tint)
  softBgWarm: '#FFE8D9',     // light orange tint
  softBgCyan: '#D9F5F5',     // light cyan tint
} as const;

// Diagram metadata and layout
export enum DiagramType {
  D1 = 'D1',   // Autocomplete loop
  D2 = 'D2',   // Three phases
  D3 = 'D3',   // Tokenizer
  D4 = 'D4',   // Embeddings
  D5 = 'D5',   // Context window
  D9 = 'D9',   // Temperature
  D11 = 'D11', // Transformers attention
  D12 = 'D12', // Agent loop
  D13 = 'D13', // Harness architecture
  D15 = 'D15', // Directory structure
  D16 = 'D16', // System map
}

export const DIAGRAM_VIEWBOX = {
  [DiagramType.D1]: '0 0 750 400',
  [DiagramType.D2]: '0 0 800 350',
  [DiagramType.D3]: '0 0 750 320',
  [DiagramType.D4]: '0 0 800 400',
  [DiagramType.D5]: '0 0 800 420',
  [DiagramType.D9]: '0 0 600 300',
  [DiagramType.D11]: '0 0 800 450',
  [DiagramType.D12]: '0 0 700 400',
  [DiagramType.D13]: '0 0 800 400',
  [DiagramType.D15]: '0 0 700 400',
  [DiagramType.D16]: '0 0 700 350',
} as const;

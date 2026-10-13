// Layout and spacing constants
// Aligns with src/styles/design-system.css

export const LAYOUT = {
  // Typography
  baseFontSize: '18px',
  lineHeight: 1.7,

  // Spacing
  maxWidth: '72ch',         // max-width for body text
  gapLarge: '2rem',         // primary spacing
  gapSmall: '1rem',         // secondary spacing
  gapTiny: '0.5rem',        // minimal spacing

  // Component heights
  scrollMarginTop: '100px', // for anchor navigation offset

  // Background effects
  gridSize: '50px',         // background grid size
  orbSize: '800px',         // floating orb dimensions
  orbBlur: '100px',         // blur radius for orbs
  orbOpacity: 0.08,         // opacity for accent orb
  orbAnimationDuration: '20s',

  // Border and radius
  borderRadius: '12px',     // standard corner radius
  borderRadiusSm: '4px',    // small corner radius

  // Transitions
  transitionFast: '0.2s',
} as const;

export const BREAKPOINTS = {
  mobile: '360px',
  tablet: '768px',
  desktop: '1440px',
} as const;

export const Z_INDEX = {
  background: 0,
  content: 1,
  navBar: 10,
  modal: 100,
  tooltip: 1000,
} as const;

export const ANIMATION = {
  orbFloat: 'float-orb 20s ease-in-out infinite',
  fadeIn: 'fade-in 0.3s ease-in',
  slideUp: 'slide-up 0.5s ease-out',
} as const;

// Typography scale (for potential use)
export const FONT_SIZES = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
} as const;

// Spacing scale
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '4xl': '4rem',
} as const;

// Every typeface the site (and the design prototypes) may use: self-hosted Latin-subset variable
// woff2 files from @fontsource-variable, declared through Astro's Fonts API, which also generates
// metric-matched fallback faces so the swap to the web font causes no layout shift.
import { fontProviders } from 'astro/config'

const fs = (pkg, file) => `./node_modules/@fontsource-variable/${pkg}/files/${file}`
const face = (name, cssVariable, pkg, base, weight, fallbacks, italic = true) => ({
  name,
  cssVariable,
  provider: fontProviders.local(),
  fallbacks,
  // No late swap: the web font is used if it arrives within ~100 ms (it's preloaded), else the
  // metric-matched fallback stays for this page view. Keeps CLS at 0 and LCP independent of the font.
  display: 'optional',
  options: {
    variants: [
      { src: [fs(pkg, `${base}-normal.woff2`)], weight, style: 'normal' },
      ...(italic ? [{ src: [fs(pkg, `${base}-italic.woff2`)], weight, style: 'italic' }] : []),
    ],
  },
})

export const fonts = [
  face(
    'Source Serif 4',
    '--font-source-serif',
    'source-serif-4',
    'source-serif-4-latin-wght',
    '200 900',
    ['Georgia', 'serif'],
  ),
  face(
    'Schibsted Grotesk',
    '--font-schibsted',
    'schibsted-grotesk',
    'schibsted-grotesk-latin-wght',
    '400 900',
    ['Arial', 'sans-serif'],
  ),
  face(
    'Hanken Grotesk',
    '--font-hanken',
    'hanken-grotesk',
    'hanken-grotesk-latin-wght',
    '100 900',
    ['Arial', 'sans-serif'],
  ),
  face(
    'JetBrains Mono',
    '--font-jetbrains',
    'jetbrains-mono',
    'jetbrains-mono-latin-wght',
    '100 800',
    ['monospace'],
    false,
  ),
  face('Fraunces', '--font-fraunces', 'fraunces', 'fraunces-latin-wght', '100 900', [
    'Georgia',
    'serif',
  ]),
  face('Public Sans', '--font-public-sans', 'public-sans', 'public-sans-latin-wght', '100 900', [
    'Arial',
    'sans-serif',
  ]),
  face('EB Garamond', '--font-garamond', 'eb-garamond', 'eb-garamond-latin-wght', '400 800', [
    'Georgia',
    'serif',
  ]),
  face('Literata', '--font-literata', 'literata', 'literata-latin-wght', '200 900', [
    'Georgia',
    'serif',
  ]),
  face('Inter', '--font-inter', 'inter', 'inter-latin-wght', '100 900', ['Arial', 'sans-serif']),
  face('Newsreader', '--font-newsreader', 'newsreader', 'newsreader-latin-wght', '200 800', [
    'Georgia',
    'serif',
  ]),
  face(
    'Space Grotesk',
    '--font-space-grotesk',
    'space-grotesk',
    'space-grotesk-latin-wght',
    '300 700',
    ['Arial', 'sans-serif'],
    false,
  ),
  face(
    'Instrument Sans',
    '--font-instrument',
    'instrument-sans',
    'instrument-sans-latin-wght',
    '400 700',
    ['Arial', 'sans-serif'],
  ),
]

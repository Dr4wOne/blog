import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0F',
          surface: '#111118',
          elevated: '#1A1A26',
        },
        primary: '#6C63FF',
        accent: '#00D9FF',
        warm: '#FF6B35',
        text: {
          DEFAULT: '#F0F0FF',
          muted: '#8888AA',
          dim: '#4A4A6A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config

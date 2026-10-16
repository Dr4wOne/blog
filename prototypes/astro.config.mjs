// Design prototypes (Phase 1). Separate build so the real site stays clean:
//   pnpm proto:dev   /   pnpm proto:build  → prototypes/dist
import { fileURLToPath } from 'node:url'
import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'
import { fonts } from '../fonts.config.mjs'
import subsetFonts from '../integrations/subset-fonts.mjs'

export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  srcDir: './prototypes/src',
  publicDir: './prototypes/public',
  outDir: './prototypes/dist',
  site: 'https://blog.dr4w.io',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [mdx(), subsetFonts()],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  server: { port: 4330 },
  fonts,
})

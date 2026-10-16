import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import { fonts } from './fonts.config.mjs'
import subsetFonts from './integrations/subset-fonts.mjs'

export default defineConfig({
  site: 'https://blog.dr4w.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  // The Essay design uses one family; the others in fonts.config.mjs exist for the design archive.
  fonts: fonts.filter((f) => f.cssVariable === '--font-source-serif'),
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/drafts/') && !page.endsWith('/404/') }),
    subsetFonts({
      // Weights the Essay design uses: 400–700 upright, 400 italic (docs/design-system.md → Type).
      axes: {
        'source-serif-4-latin-wght-normal': { wght: { min: 400, max: 700 } },
        'source-serif-4-latin-wght-italic': { wght: 400 },
      },
    }),
  ],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
})

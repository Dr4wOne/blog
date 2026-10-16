// Screenshots of each prototype: node prototypes/scripts/shoot.mjs <baseUrl> <outDir> [p01,p02…] [--full]
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const [base, out, only = '', ...flags] = process.argv.slice(2)
const ids = only
  ? only.split(',')
  : Array.from({ length: 10 }, (_, i) => `p${String(i + 1).padStart(2, '0')}`)
const full = flags.includes('--full')
const browser = await chromium.launch({ channel: 'chrome' })
mkdirSync(out, { recursive: true })
for (const id of ids) {
  for (const scheme of ['light', 'dark']) {
    for (const width of [360, 768, 1440]) {
      const ctx = await browser.newContext({
        viewport: { width, height: width === 360 ? 780 : 900 },
        colorScheme: scheme,
        deviceScaleFactor: 1,
      })
      const page = await ctx.newPage()
      for (const [kind, path] of [
        ['home', `/${id}/`],
        ['article', `/${id}/01-ai-from-the-ground-up/`],
      ]) {
        await page.goto(base + path, { waitUntil: 'networkidle' })
        await page.evaluate(() => document.fonts.ready)
        await page.screenshot({
          path: `${out}/${id}-${kind}-${width}-${scheme}.jpg`,
          fullPage: full,
          quality: 70,
          type: 'jpeg',
        })
      }
      await ctx.close()
    }
  }
}
await browser.close()

// node prototypes/scripts/axe-detail.mjs <url> [light|dark] [width] — print each axe violation node.
import { AxeBuilder } from '@axe-core/playwright'
import { chromium } from '@playwright/test'

const [url, scheme = 'light', width = '1440'] = process.argv.slice(2)
const b = await chromium.launch({ channel: 'chrome' })
const ctx = await b.newContext({ viewport: { width: +width, height: 900 }, colorScheme: scheme })
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'networkidle' })
const r = await new AxeBuilder({ page: p })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
  .analyze()
for (const v of r.violations)
  for (const n of v.nodes)
    console.log(
      v.id,
      n.target.join(' '),
      '|',
      n.failureSummary?.split('\n').slice(1, 2).join(' '),
      '|',
      n.html.slice(0, 120),
    )
await b.close()

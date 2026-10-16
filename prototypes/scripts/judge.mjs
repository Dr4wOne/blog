// Outside judges for every prototype: Lighthouse (mobile), axe (light + dark, two widths),
// the taste-skill gate (inspect.mjs) and palette contrast. Writes prototypes/results.json.
//   node prototypes/scripts/judge.mjs http://localhost:4331 [p01,p02]
import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { AxeBuilder } from '@axe-core/playwright'
import { chromium } from '@playwright/test'

const run = promisify(execFile)
const [base, only = ''] = process.argv.slice(2)
const ids = only
  ? only.split(',')
  : Array.from({ length: 10 }, (_, i) => `p${String(i + 1).padStart(2, '0')}`)
const pages = { home: (id) => `/${id}/`, article: (id) => `/${id}/01-ai-from-the-ground-up/` }
// Allowed taste-skill rules, with the reason recorded in docs/decisions (prototypes only):
// few-pictures / no-footage: an explanatory article has no honest photographs or footage of its
// subject; its pictures are original diagrams, which the gate does not count.
const ALLOW = ['few-pictures', 'no-footage']
// p09 deliberately uses the dr4w.io brand violet; taste-skill allows a brand-owned colour (SKILL.md → Special cases).
const EXTRA = { p09: ['palette-purple'] }
const out = 'prototypes/results.json'
const results = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : {}
const work = join(tmpdir(), 'proto-judge')
mkdirSync(work, { recursive: true })

async function lighthouse(url) {
  const file = join(work, 'lh.json')
  await run(
    'node_modules/.bin/lighthouse',
    [
      url,
      '--quiet',
      '--output=json',
      `--output-path=${file}`,
      '--chrome-flags=--headless=new --no-sandbox',
      '--form-factor=mobile',
    ],
    { maxBuffer: 1 << 26 },
  )
  const r = JSON.parse(readFileSync(file, 'utf8'))
  const c = r.categories
  const a = r.audits
  return {
    performance: Math.round(c.performance.score * 100),
    accessibility: Math.round(c.accessibility.score * 100),
    bestPractices: Math.round(c['best-practices'].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp: a['largest-contentful-paint'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    bytes: a['total-byte-weight'].numericValue,
  }
}

async function taste(url, id) {
  const outDir = join(work, 'inspect')
  try {
    const { stdout } = await run(
      'node',
      [
        '.claude/skills/design-taste-frontend/scripts/inspect.mjs',
        url,
        '--json',
        '--out',
        outDir,
        '--allow',
        [...ALLOW, ...(EXTRA[id] ?? [])].join(','),
      ],
      { maxBuffer: 1 << 26 },
    )
    return summarise(stdout)
  } catch (e) {
    return summarise(e.stdout ?? '')
  }
}
function summarise(stdout) {
  const j = JSON.parse(stdout.slice(stdout.indexOf('{')))
  const f = j.findings ?? []
  const ids = (level) => [...new Set(f.filter((x) => x.level === level).map((x) => x.id))]
  return {
    fail: ids('FAIL'),
    warn: ids('WARN'),
    messages: f.map((x) => `${x.level} ${x.id}: ${x.message}`),
  }
}

const browser = await chromium.launch({ channel: 'chrome' })
async function axe(url) {
  const out = {}
  for (const scheme of ['light', 'dark']) {
    for (const width of [390, 1440]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: scheme,
      })
      const page = await ctx.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 30))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(400)
      const r = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze()
      out[`${scheme}-${width}`] = r.violations.map((v) => `${v.id} (${v.nodes.length})`)
      await ctx.close()
    }
  }
  return out
}

function lum(hex) {
  const n = hex.replace('#', '')
  const c = [0, 2, 4]
    .map((i) => Number.parseInt(n.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return Math.round(((x + 0.05) / (y + 0.05)) * 10) / 10
}
async function palette(url) {
  const out = {}
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme })
    const page = await ctx.newPage()
    await page.goto(url)
    const t = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement)
      return Object.fromEntries(
        ['--bg', '--surface', '--ink', '--muted', '--accent', '--accent-ink', '--link'].map((k) => [
          k.slice(2),
          s.getPropertyValue(k).trim(),
        ]),
      )
    })
    out[scheme] = {
      tokens: t,
      ink: ratio(t.ink, t.bg),
      muted: ratio(t.muted, t.bg),
      link: ratio(t.link, t.bg),
      inkOnSurface: ratio(t.ink, t.surface),
      onAccent: ratio(t['accent-ink'], t.accent),
    }
    await ctx.close()
  }
  return out
}

for (const id of ids) {
  results[id] = { pages: {} }
  for (const [kind, path] of Object.entries(pages)) {
    const url = base + path(id)
    process.stdout.write(`${id} ${kind}: lighthouse… `)
    const lh = await lighthouse(url)
    process.stdout.write('axe… ')
    const ax = await axe(url)
    process.stdout.write('taste… ')
    const ts = await taste(url, id)
    results[id].pages[kind] = { lighthouse: lh, axe: ax, taste: ts }
    console.log(
      `P${lh.performance} A${lh.accessibility} BP${lh.bestPractices} S${lh.seo} | axe ${Object.values(ax).flat().length} | taste FAIL ${ts.fail.join(',') || '0'} WARN ${ts.warn.join(',') || '0'}`,
    )
  }
  results[id].palette = await palette(base + pages.article(id))
  writeFileSync(out, `${JSON.stringify(results, null, 2)}\n`)
}
await browser.close()

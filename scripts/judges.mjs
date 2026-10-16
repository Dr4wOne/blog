// pnpm judges            — every quality judge against a local build (dist/, served like Cloudflare)
// pnpm judges --live URL — the same judges against a deployed site, plus external links and the W3C feed validator
// Targets and how each is measured: docs/judges.md. Exit code 1 if any judge fails.
import { execFile, spawn } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { promisify } from 'node:util'
import { brotliCompressSync } from 'node:zlib'
import { AxeBuilder } from '@axe-core/playwright'
import { chromium } from '@playwright/test'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { HtmlValidate } from 'html-validate'
import { LinkChecker } from 'linkinator'
import sharp from 'sharp'

const run = promisify(execFile)
const args = process.argv.slice(2)
const liveIdx = args.indexOf('--live')
const LIVE = liveIdx >= 0
const only = (args.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean)
const OUT = '.judges'
mkdirSync(OUT, { recursive: true })

const registry = JSON.parse(readFileSync('issues.json', 'utf8')).issues
const articles = registry.map((e) => `/${String(e.issue).padStart(2, '0')}-${e.slug}/`)
const latest = articles.at(-1)
const ALLOW = ['few-pictures', 'no-footage'] // ADR 0006

// ---- server ---------------------------------------------------------------
let base = LIVE ? args[liveIdx + 1]?.replace(/\/$/, '') : undefined
let server
if (!base) {
  if (!existsSync('dist/index.html')) throw new Error('dist/ is missing: run pnpm build first')
  const port = 4400 + Math.floor(Math.random() * 400)
  server = spawn('node', ['scripts/serve.mjs', 'dist', String(port)], { stdio: 'ignore' })
  base = `http://localhost:${port}`
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(base)).ok) break
    } catch {}
    await new Promise((r) => setTimeout(r, 100))
  }
}

const results = []
const record = (judge, target, ok, detail) => {
  results.push({ judge, target, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${judge}: ${detail}`)
}
const want = (name) => !only.length || only.includes(name)
const htmlFiles = (dir) =>
  readdirSync(dir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(dir, f))
const pagePaths = LIVE
  ? ['/', ...articles, '/about/', '/404.html']
  : htmlFiles('dist').map(
      (f) =>
        `/${relative('dist', f)
          .replace(/index\.html$/, '')
          .replace(/\\/g, '/')}`,
    )

// ---- 1. Lighthouse (mobile, simulated throttling) --------------------------
async function lighthouse(url) {
  const file = join(OUT, 'lh.json')
  await run(
    'node_modules/.bin/lighthouse',
    [
      url,
      '--quiet',
      '--output=json',
      `--output-path=${file}`,
      '--form-factor=mobile',
      '--chrome-flags=--headless=new --no-sandbox',
    ],
    { maxBuffer: 1 << 26 },
  )
  const r = JSON.parse(readFileSync(file, 'utf8'))
  const s = (k) => Math.round(r.categories[k].score * 100)
  const a = r.audits
  return {
    perf: s('performance'),
    a11y: s('accessibility'),
    bp: s('best-practices'),
    seo: s('seo'),
    lcp: a['largest-contentful-paint'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    bytes: a['total-byte-weight'].numericValue,
  }
}
if (want('lighthouse')) {
  for (const path of ['/', ...articles]) {
    let lh = await lighthouse(base + path)
    // One retry on a perf-only miss: simulated runs vary by a few points on a busy machine.
    if (lh.perf < 100 || lh.lcp >= 1000) {
      const again = await lighthouse(base + path)
      if (again.perf > lh.perf || (again.perf === lh.perf && again.lcp < lh.lcp)) lh = again
    }
    const cats = `perf ${lh.perf}, a11y ${lh.a11y}, best practices ${lh.bp}, SEO ${lh.seo}`
    record(
      `Lighthouse ${path}`,
      'all 100',
      [lh.perf, lh.a11y, lh.bp, lh.seo].every((x) => x === 100),
      cats,
    )
    record(`LCP ${path}`, '< 1.0 s', lh.lcp < 1000, `${(lh.lcp / 1000).toFixed(2)} s`)
    record(`CLS ${path}`, '0', lh.cls === 0, lh.cls.toFixed(3))
    record(`TBT ${path}`, '0 ms (INP proxy)', lh.tbt === 0, `${Math.round(lh.tbt)} ms`)
    if (path !== '/')
      record(
        `Page weight ${path}`,
        '< 250 KB',
        lh.bytes < 250 * 1024,
        `${Math.round(lh.bytes / 1024)} KB transferred on load`,
      )
  }
}

// ---- 2. axe (WCAG 2.2 AA + best practice), light/dark, 390/1440 ------------
const browser = await chromium.launch({ channel: 'chrome' })
if (want('axe')) {
  for (const path of pagePaths) {
    const found = []
    for (const colorScheme of ['light', 'dark'])
      for (const width of [390, 1440]) {
        const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme })
        const page = await ctx.newPage()
        await page.goto(base + path, { waitUntil: 'networkidle' })
        const r = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        for (const v of r.violations)
          for (const n of v.nodes)
            found.push(`${colorScheme}-${width} ${v.id} ${n.target.join(' ')}`)
        await ctx.close()
      }
    record(
      `axe ${path}`,
      '0 violations',
      found.length === 0,
      found.length ? found.slice(0, 5).join('; ') : '0 violations',
    )
  }
}

// ---- 3. Body text contrast at AAA ------------------------------------------
const lum = (rgb) => {
  const [r, g, b] = rgb
    .match(/\d+/g)
    .slice(0, 3)
    .map((v) => +v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
if (want('contrast')) {
  for (const colorScheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme })
    const page = await ctx.newPage()
    await page.goto(base + latest)
    const [fg, bg] = await page.evaluate(() => {
      const p = document.querySelector('.prose > p')
      return [getComputedStyle(p).color, getComputedStyle(document.body).backgroundColor]
    })
    const r = ratio(fg, bg)
    record(`Body text contrast (${colorScheme})`, '≥ 7:1 (AAA)', r >= 7, `${r.toFixed(1)}:1`)
    await ctx.close()
  }
}

// ---- 4. INP proxy: widget interactions under 4× CPU slowdown ---------------
if (want('inp')) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.addInitScript(() => {
    window.__inp = 0
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (e.interactionId) window.__inp = Math.max(window.__inp, e.duration)
    }).observe({ type: 'event', durationThreshold: 16, buffered: true })
  })
  await page.goto(base + latest, { waitUntil: 'networkidle' })
  for (const sel of [
    '[data-widget=tokenizer]',
    '[data-widget=temperature]',
    '[data-widget=agent]',
  ]) {
    if (!(await page.$(sel))) continue
    await page.locator(sel).scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
  }
  if (await page.$('#w-tok-in'))
    await page.locator('#w-tok-in').pressSequentially(' interaction test', { delay: 30 })
  if (await page.$('#w-temp-in')) await page.locator('#w-temp-in').fill('1.6')
  if (await page.$('[data-sample]')) await page.locator('[data-sample]').click()
  for (let i = 0; i < 4; i++)
    if (await page.locator('[data-next]').isVisible()) await page.locator('[data-next]').click()
  await page.waitForTimeout(500)
  const inp = await page.evaluate(() => window.__inp)
  record(
    'INP (widgets, 4× slower CPU)',
    '< 100 ms',
    inp < 100,
    `${Math.round(inp)} ms worst interaction`,
  )
  await ctx.close()
}

// ---- 5. JavaScript budget from the build output ----------------------------
if (want('js') && !LIVE) {
  const jsFor = (html) => {
    const files = new Set()
    const add = (f) => {
      if (files.has(f) || !existsSync(f)) return
      files.add(f)
      const src = readFileSync(f, 'utf8')
      // static imports only; dynamic import() chunks are the lazily loaded widgets
      for (const m of src.matchAll(
        /(?:^|[;\n}])\s*import\s*(?:[^'"()]*?from\s*)?["']([^"']+)["']/g,
      ))
        add(join(f, '..', m[1]))
    }
    for (const m of readFileSync(html, 'utf8').matchAll(/<script[^>]*\bsrc="([^"]+)"/g))
      add(join('dist', m[1]))
    const inline = [
      ...readFileSync(html, 'utf8').matchAll(
        /<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ]
      .map((m) => m[1])
      .join('')
    return (
      [...files].reduce((n, f) => n + brotliCompressSync(readFileSync(f)).length, 0) +
      (inline ? brotliCompressSync(inline).length : 0)
    )
  }
  const home = jsFor('dist/index.html')
  record('JS on home', '0 KB', home === 0, `${home} B`)
  for (const a of articles) {
    const b = jsFor(join('dist', a, 'index.html'))
    record(
      `JS before widgets ${a}`,
      '≤ 20 KB',
      b <= 20 * 1024,
      `${(b / 1024).toFixed(1)} KB (brotli)`,
    )
  }
}

// ---- 6. HTML validity -------------------------------------------------------
if (want('html') && !LIVE) {
  const hv = new HtmlValidate({
    extends: ['html-validate:recommended'],
    rules: {
      'no-inline-style': 'off',
      'long-title': 'off',
      'no-trailing-whitespace': 'off',
      'attribute-boolean-style': 'off',
      'void-style': 'off',
      'svg-focusable': 'off',
      'no-redundant-role': 'off',
    },
  })
  let errors = []
  for (const f of htmlFiles('dist')) {
    const r = await hv.validateFile(f)
    for (const res of r.results)
      for (const m of res.messages)
        errors.push(`${relative('dist', f)}:${m.line} ${m.ruleId} ${m.message}`)
  }
  errors = errors.filter((e) => !e.includes('/drafts/'))
  record(
    'HTML validity',
    '0 errors',
    errors.length === 0,
    errors.length ? errors.slice(0, 6).join(' | ') : `${htmlFiles('dist').length} files, 0 errors`,
  )
}

// ---- 7. Links -----------------------------------------------------------------
if (want('links')) {
  const checker = new LinkChecker()
  const broken = []
  await checker
    .check({
      path: `${base}/`,
      recurse: true,
      timeout: 15000,
      retry: true,
      linksToSkip: LIVE ? ['^mailto:'] : [`^(?!${base.replace(/[.]/g, '\\.')})`],
      concurrency: 8,
    })
    .then((r) => {
      for (const l of r.links)
        if (l.state === 'BROKEN') broken.push(`${l.status} ${l.url} (on ${l.parent})`)
    })
  record(
    LIVE ? 'Links (internal + external)' : 'Links (internal)',
    '0 broken',
    broken.length === 0,
    broken.length ? broken.slice(0, 5).join('; ') : '0 broken',
  )
}

// ---- 8. Redirects -------------------------------------------------------------
if (want('redirects')) {
  const rules = readFileSync('public/_redirects', 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/))
  const bad = []
  for (const [from, to, status] of rules) {
    const r = await fetch(base + from, { redirect: 'manual' })
    const loc = r.headers.get('location') ?? ''
    const target = new URL(loc, base)
    if (String(r.status) !== status || !(target.pathname + target.hash).endsWith(to))
      bad.push(`${from} → ${r.status} ${loc}`)
    else if (!(await fetch(target)).ok) bad.push(`${from} → ${to} does not answer 200`)
  }
  record(
    'Redirects',
    `all ${rules.length} are 301 to the right place`,
    bad.length === 0,
    bad.length ? bad.join('; ') : `${rules.length} rules OK`,
  )
}

// ---- 9. Feeds -----------------------------------------------------------------
if (want('feeds')) {
  const xml = await (await fetch(`${base}/rss.xml`)).text()
  const valid = XMLValidator.validate(xml)
  const errs = valid === true ? [] : [`XML: ${valid.err.msg}`]
  if (valid === true) {
    const rss = new XMLParser().parse(xml).rss?.channel
    if (!rss?.title || !rss?.link || !rss?.description)
      errs.push('channel title/link/description missing')
    const items = [rss?.item ?? []].flat()
    if (items.length !== registry.length)
      errs.push(`${items.length} items for ${registry.length} issues`)
    for (const it of items)
      if (!it.title || !it.link || !it.guid || Number.isNaN(Date.parse(it.pubDate)))
        errs.push(`item "${it.title}" incomplete`)
  }
  if (LIVE) {
    const soap = await (
      await fetch(
        `https://validator.w3.org/feed/check.cgi?output=soap12&url=${encodeURIComponent(`${base}/rss.xml`)}`,
      )
    ).text()
    const n = Number(soap.match(/<m:errorcount>(\d+)<\/m:errorcount>/)?.[1] ?? 'NaN')
    if (n !== 0) errs.push(`W3C feed validator: ${Number.isNaN(n) ? 'no answer' : `${n} errors`}`)
  }
  record(
    'RSS feed',
    LIVE ? 'valid (W3C validator)' : 'well-formed, complete',
    errs.length === 0,
    errs.length ? errs.join('; ') : `${registry.length} items`,
  )
  const { jsonFeedErrors } = await import('../src/lib/feed.ts')
  const feed = await (await fetch(`${base}/feed.json`)).json()
  const jerr = jsonFeedErrors(feed)
  if (feed.items?.length !== registry.length)
    jerr.push(`${feed.items?.length} items for ${registry.length} issues`)
  record(
    'JSON Feed 1.1',
    'valid',
    jerr.length === 0,
    jerr.length ? jerr.join('; ') : `${feed.items.length} items`,
  )
}

// ---- 10. Sharing metadata: canonical, OG image, JSON-LD -----------------------
if (want('seo')) {
  const bad = []
  for (const path of ['/', ...articles]) {
    const html = await (await fetch(base + path)).text()
    const meta = (p) =>
      html.match(new RegExp(`<meta (?:property|name)="${p}" content="([^"]*)"`))?.[1]
    if (!html.includes('<link rel="canonical" href="https://blog.dr4w.io'))
      bad.push(`${path}: canonical`)
    for (const p of ['og:title', 'og:description', 'og:image', 'twitter:card'])
      if (!meta(p)) bad.push(`${path}: ${p}`)
    const img = new URL(meta('og:image') ?? '/', 'https://blog.dr4w.io').pathname
    const res = await fetch(base + img)
    if (!res.ok) bad.push(`${path}: og:image ${img} ${res.status}`)
    else {
      const m = await sharp(Buffer.from(await res.arrayBuffer())).metadata()
      if (m.width !== 1200 || m.height !== 630)
        bad.push(`${path}: og:image is ${m.width}×${m.height}`)
    }
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
      (m) => JSON.parse(m[1]),
    )
    const type = path === '/' ? 'Blog' : 'Article'
    if (!ld.some((x) => x['@type'] === type && x.author?.['@type'] === 'Person'))
      bad.push(`${path}: JSON-LD ${type} + Person`)
  }
  record(
    'Canonical, Open Graph, JSON-LD',
    'present and valid',
    bad.length === 0,
    bad.length ? bad.join('; ') : 'OK on home and every issue',
  )
}

// ---- 11. taste-skill gate --------------------------------------------------------
if (want('taste')) {
  for (const path of ['/', latest]) {
    let out = ''
    try {
      out = (
        await run(
          'node',
          [
            '.claude/skills/design-taste-frontend/scripts/inspect.mjs',
            base + path,
            '--json',
            '--out',
            join(OUT, 'taste', path.replace(/\W+/g, '_') || 'home'),
            '--allow',
            ALLOW.join(','),
          ],
          { maxBuffer: 1 << 26 },
        )
      ).stdout
    } catch (e) {
      out = e.stdout ?? ''
    }
    const j = JSON.parse(out.slice(out.indexOf('{')))
    const fails = [
      ...new Set((j.findings ?? []).filter((f) => f.level === 'FAIL').map((f) => f.id)),
    ]
    const warns = [
      ...new Set((j.findings ?? []).filter((f) => f.level === 'WARN').map((f) => f.id)),
    ]
    record(
      `taste-skill gate ${path}`,
      '0 FAIL',
      fails.length === 0,
      `${fails.length ? `FAIL ${fails.join(', ')}` : '0 FAIL'}${warns.length ? `; WARN ${warns.join(', ')}` : ''}`,
    )
  }
}

// ---- 12. Screenshots for the pixel review (360 / 768 / 1440, light / dark) ------
if (want('screens')) {
  const dir = join(OUT, 'screens')
  mkdirSync(dir, { recursive: true })
  for (const path of ['/', latest])
    for (const colorScheme of ['light', 'dark'])
      for (const width of [360, 768, 1440]) {
        const ctx = await browser.newContext({
          viewport: { width, height: width === 360 ? 780 : 900 },
          colorScheme,
        })
        const page = await ctx.newPage()
        await page.goto(base + path, { waitUntil: 'networkidle' })
        await page.screenshot({
          path: join(dir, `${path === '/' ? 'home' : 'article'}-${width}-${colorScheme}.png`),
        })
        await ctx.close()
      }
  record('Screenshots', 'saved for review', true, `${dir}/ (12 files)`)
}

await browser.close()
server?.kill()

const failed = results.filter((r) => !r.ok)
const md = [
  `# Judge results (${LIVE ? `live: ${base}` : 'local build'}, ${new Date().toISOString().slice(0, 16)}Z)`,
  '',
  '| Judge | Target | Result | |',
  '|---|---|---|---|',
  ...results.map(
    (r) =>
      `| ${r.judge} | ${r.target} | ${r.detail.replace(/\|/g, '\\|')} | ${r.ok ? '✅' : '❌'} |`,
  ),
  '',
  `**${results.length - failed.length}/${results.length} passed.**`,
].join('\n')
writeFileSync(join(OUT, LIVE ? 'live.md' : 'local.md'), `${md}\n`)
writeFileSync(join(OUT, LIVE ? 'live.json' : 'local.json'), `${JSON.stringify(results, null, 2)}\n`)
console.log(
  `\n${results.length - failed.length}/${results.length} passed. Report: ${OUT}/${LIVE ? 'live' : 'local'}.md`,
)
process.exit(failed.length ? 1 : 0)

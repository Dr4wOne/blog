// Builds prototypes/gallery.html from screenshots, prototypes/results.json and prototypes/notes.json.
//   node prototypes/scripts/gallery.mjs <shotsDir>
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const shots = process.argv[2]
const results = JSON.parse(readFileSync('prototypes/results.json', 'utf8'))
const notes = JSON.parse(readFileSync('prototypes/notes.json', 'utf8'))
const out = 'prototypes/public/gallery'
mkdirSync(out, { recursive: true })

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ok = (b) => (b ? 'pass' : 'fail')
const ms = (v) => `${(v / 1000).toFixed(2)} s`

const cards = notes.protos
  .map((n) => {
    const r = results[n.id]
    const imgs = []
    for (const kind of ['article', 'home'])
      for (const scheme of ['light', 'dark'])
        for (const w of [1440, 768, 360]) {
          const f = `${n.id}-${kind}-${w}-${scheme}.jpg`
          if (existsSync(join(shots, f))) copyFileSync(join(shots, f), join(out, f))
          imgs.push(
            `<figure class="shot w${w}"><a href="gallery/${f}"><img src="gallery/${f}" alt="${esc(n.name)}, ${kind}, ${w} px, ${scheme}" loading="lazy" width="${w}" height="${w === 360 ? 780 : 900}"></a><figcaption>${kind} · ${w} · ${scheme}</figcaption></figure>`,
          )
        }
    const rows = ['home', 'article']
      .map((k) => {
        const p = r.pages[k]
        const l = p.lighthouse
        const axeCount = Object.values(p.axe).flat().length
        return `<tr><th scope="row">${k}</th><td class="${ok(l.performance === 100)}">${l.performance}</td><td class="${ok(l.accessibility === 100)}">${l.accessibility}</td><td class="${ok(l.bestPractices === 100)}">${l.bestPractices}</td><td class="${ok(l.seo === 100)}">${l.seo}</td><td class="${ok(l.lcp < 1000)}">${ms(l.lcp)}</td><td class="${ok(l.cls === 0)}">${l.cls.toFixed(3)}</td><td>${Math.round(l.bytes / 1024)} KB</td><td class="${ok(axeCount === 0)}">${axeCount}</td><td class="${ok(p.taste.fail.length === 0)}">${p.taste.fail.length ? `FAIL: ${esc(p.taste.fail.join(', '))}` : 'pass'}${p.taste.warn.length ? `<br><small>warn: ${esc(p.taste.warn.join(', '))}</small>` : ''}</td></tr>`
      })
      .join('')
    const pal = ['light', 'dark']
      .map((s) => {
        const p = r.palette[s]
        const sw = Object.entries(p.tokens)
          .map(
            ([k, v]) =>
              `<span class="sw"><i style="background:${v}"></i>${k} <code>${v}</code></span>`,
          )
          .join('')
        return `<div class="pal"><strong>${s}</strong> ${sw}<p>Contrast: body ${p.ink}:1 (${p.ink >= 7 ? 'AAA' : 'below AAA'}) · secondary ${p.muted}:1 · links ${p.link}:1 · text on accent ${p.onAccent}:1</p></div>`
      })
      .join('')
    return `<section class="proto" id="${n.id}">
  <h2>${esc(n.name)} <a href="/${n.id}/">home</a> <a href="/${n.id}/01-ai-from-the-ground-up/">article</a></h2>
  <p class="why">${n.rationale.map(esc).join('<br>')}</p>
  <dl>
    <dt>Typefaces</dt><dd>${esc(n.type)}</dd>
    <dt>Brand link to dr4w.io</dt><dd>${esc(n.brand)}</dd>
    <dt>taste-skill</dt><dd>${esc(n.skills.join(', '))}; dials: variance ${n.dials.variance}, motion ${n.dials.motion}, density ${n.dials.density}</dd>
    <dt>Weakest point</dt><dd>${esc(n.weakest)}</dd>
  </dl>
  ${pal}
  <div class="table-scroll"><table><thead><tr><th></th><th>Perf</th><th>A11y</th><th>BP</th><th>SEO</th><th>LCP</th><th>CLS</th><th>Weight</th><th>axe</th><th>taste gate</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="shots">${imgs.join('')}</div>
</section>`
  })
  .join('\n')

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog prototypes: gallery</title>
<style>
:root{--bg:#fafafa;--ink:#141414;--muted:#555;--surface:#ececee;--ok:#0b6b36;--bad:#a1121b;color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#0a0a0f;--ink:#ececf0;--muted:#a9a9b3;--surface:#1a1a21;--ok:#6fd39b;--bad:#ff8a8f}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,sans-serif}
main{width:min(100% - 2rem,90rem);margin:auto;padding:2rem 0 5rem}
h1{font-size:clamp(2rem,5vw,3.5rem);line-height:1;margin:1rem 0}
.proto{padding:3rem 0;border-top:4px solid var(--ink)}
.proto h2{font-size:1.8rem;margin:0 0 .5rem}.proto h2 a{font-size:1rem;margin-left:.75rem}
a{color:inherit}.why{font-size:1.1rem;max-width:70ch}
dl{display:grid;grid-template-columns:max-content 1fr;gap:.3rem 1.25rem}dt{font-weight:650}dd{margin:0}
.pal{margin:.75rem 0}.sw{display:inline-flex;align-items:center;gap:.3rem;margin:.2rem .7rem .2rem 0;font-size:.85rem}
.sw i{width:1.1rem;height:1.1rem;border-radius:3px;outline:1px solid #8888}
table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;margin:1rem 0}
th,td{padding:.4rem .6rem;text-align:left;border-bottom:1px solid var(--surface)}
.pass{color:var(--ok)}.fail{color:var(--bad);font-weight:650}
.table-scroll{overflow-x:auto}
.shots{display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:.75rem}
.shot{margin:0}.shot img{width:100%;height:auto;display:block;background:var(--surface)}
.shot figcaption{font-size:.8rem;color:var(--muted)}
.rank li{margin-bottom:1rem;max-width:80ch}
</style></head><body><main>
<h1>Ten directions for blog.dr4w.io</h1>
<p>Every prototype is a working build of the real home page and the real article, with all figures and widgets, in light and dark. Scores come from outside judges: Lighthouse ${notes.lighthouse} (mobile, simulated throttling), axe-core (WCAG 2.2 AA + best practice, light and dark, 390 and 1440 px), and the taste-skill gate (<code>inspect.mjs</code>, commit f624f37) with only the allowances in ADR 0006. Judged ${notes.judged}.</p>
<nav aria-label="Prototypes"><ol>${notes.protos.map((n) => `<li><a href="#${n.id}">${esc(n.name)}</a></li>`).join('')}</ol></nav>
${cards}
<section class="proto" id="ranking"><h2>Decision</h2><p>${esc(notes.rankingBy)}</p><ol class="rank">${notes.ranking.map((x) => `<li><strong>${esc(x.name)}.</strong> ${esc(x.reason)}</li>`).join('')}</ol></section>
</main></body></html>
`
writeFileSync('prototypes/public/gallery.html', html)
console.log('wrote prototypes/public/gallery.html')

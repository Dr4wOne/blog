# Judges

`pnpm build && pnpm judges` runs every check below against the built site, served the way Cloudflare
serves it (`scripts/serve.mjs`: brotli, `_redirects`, `_headers`). `pnpm judges --live https://blog.dr4w.io`
runs them against production and adds external links and the W3C feed validator. CI runs both
(`ci.yml` on PRs, `deploy.yml` after each deploy). Report: `.judges/local.md` / `.judges/live.md`, also
in the GitHub run summary. Run one judge: `pnpm judges --only=axe,feeds`.

| Judge | Target | Tool |
|---|---|---|
| `lighthouse` | 100 in all four categories, LCP < 1.0 s, CLS 0, TBT < 50 ms, article < 250 KB | Lighthouse 13, mobile, simulated throttling; article LCP with devtools throttling ([ADR 0009](decisions/0009-article-lcp-measurement.md)) |
| `axe` | 0 violations, every page, light + dark, 390 + 1440 px | axe-core (WCAG 2.2 AA + best practice) via Playwright |
| `contrast` | body text ≥ 7:1 (AAA), light and dark | computed colours |
| `inp` | worst widget interaction < 100 ms at 4× slower CPU | Event Timing API |
| `js` | 0 KB on the home page, ≤ 20 KB (brotli) before widgets on an article | build output, static imports only |
| `html` | 0 errors | html-validate (recommended rules) |
| `links` | 0 broken (internal; external in `--live`) | linkinator |
| `redirects` | every `public/_redirects` rule answers 301 to a page that answers 200 | fetch |
| `feeds` | RSS well-formed and complete (W3C validator in `--live`); JSON Feed 1.1 valid | fast-xml-parser, `src/lib/feed.ts` |
| `seo` | canonical, Open Graph, 1200×630 OG image, JSON-LD `Blog`/`Article` + `Person` | fetch + sharp |
| `taste` | 0 FAIL from the taste-skill gate (allowances: ADR 0006) | `.claude/skills/design-taste-frontend/scripts/inspect.mjs` |
| `screens` | screenshots at 360/768/1440, light/dark, for review | Playwright → `.judges/screens/` |

Not automated: the **cold-reader test** (a fresh agent reads the post as a newcomer and lists what
confused it) and the **pixel review** of `.judges/screens/` by someone who did not build the page.
`/publish-post` asks for both.

## Article LCP: how it is measured
Lighthouse's simulated throttling assumes the whole HTML document downloads before the first paint; a
long article (issue 1: 27 KB compressed) then measures 1.2–1.35 s. With real packet-level throttling
(Slow 4G, 4× CPU), where the browser streams HTML as it does for readers, it paints at 0.90 s. Articles
are therefore judged with `--throttling-method=devtools`; the simulated value is still printed.
Decision: [ADR 0009](decisions/0009-article-lcp-measurement.md).

## When a judge fails
- **Lighthouse perf a few points short:** rerun; simulated runs vary on a busy machine (the judge
  already retries once). A real regression usually shows in `total-byte-weight` or a new request.
- **axe:** `node prototypes/scripts/axe-detail.mjs <url> dark 390` prints each node.
- **taste:** read `.judges/taste/<page>/report.json` and the screenshots next to it.

# Discovery (Phase 0, 2026-10-15)

What the blog, the landing page and the live sites looked like before the relaunch, and what had to change.
Evidence for the old blog refers to commit `3a52d70` (last commit before the relaunch).

## Inventory

| | Blog (`Dr4wOne/blog`, public) | Landing (`Dr4wOne/dr4w-landpage`, private) | dr4w routine (target) |
|---|---|---|---|
| Stack | Astro `^5` (resolved via `npm`), React 18 (unused), Tailwind (`latest`), TypeScript `latest` | Vite 5 + React 18 SPA, Tailwind 3, framer-motion 11 | pnpm 12.11.2, Node 24, Biome 2.5, TS 7 |
| Package manager | npm, `package-lock.json`, many `latest` ranges | npm, `^` ranges | pnpm, exact versions, release-age policy |
| Hosting | `wrangler.toml` with `pages_build_output_dir` (Cloudflare **Pages**), envs `blog` / `blog-sbx` | Cloudflare **Worker** `dr4w-landpage` with static assets (`assets.directory = dist`, SPA fallback); custom domain set in the dashboard, not in config | Workers + static assets, domain declared in `wrangler.jsonc` |
| CI | Generic `ci.yml` (Node 22, `make lint/test/build` that only echo) | none | lint, typecheck, tests, build on every PR |
| Deploy | Generic `deploy.yml`: sandbox on push, prod by manual dispatch with an unused Terraform/AWS path; secrets only in a `sandbox` environment | `deploy.yml` on push: Node 20, `npm install -g wrangler` (unpinned), `wrangler deploy`, repo-level secrets | merge = deploy, `production` environment, smoke test |
| Actions | tags (`@v4`), not SHAs | tags, not SHAs | SHA-pinned |
| Branch protection | none on `main` | not available (private repo on GitHub Free) | `main` protected |
| Docs | ~10 planning files at the root, `docs/` with stale plans | README + Portuguese tutorials | `README`, `CLAUDE.md`, `docs/STATUS.md`, ADRs |

## Live state

| Check | Result |
|---|---|
| `blog.dr4w.io` | **Does not resolve** (NXDOMAIN). The blog was never live on its domain. |
| `blog-sbx.dr4w.io` | Resolves to Cloudflare (proxied), returns **404**: the Pages custom domain was never attached. |
| Pages deployment | `https://b3291982.blog-sbx.pages.dev` serves the old site (200). |
| `dr4w.io`, `www.dr4w.io` | 200, served by the `dr4w-landpage` Worker. |
| Blog GitHub secrets | env `sandbox`: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID`; env `prod`: none; vars `AWS_REGION`, `BASE_DOMAIN` |
| Landing GitHub secrets | repo: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| Last runs | blog `ci` + `deploy` green (sandbox only); landing deploy green |

Consequence: the cutover adds a new Worker and its custom domain; nothing currently serving
`blog.dr4w.io` has to be moved. Only the `blog-sbx` Pages project and its DNS record are left to remove
([cutover.md](cutover.md)).

## Pipeline issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | High | Targets Cloudflare Pages; dr4w deploys Workers with static assets | `wrangler.toml`: `pages_build_output_dir` | `wrangler.jsonc` with `assets`, Worker `dr4w-blog` ([ADR 0004](decisions/0004-workers-static-assets.md)) |
| 2 | High | Production never deployed; secrets only in `sandbox` | GitHub environments; NXDOMAIN | `production` environment + deploy on merge |
| 3 | High | The article exists twice and they differ | `src/content/blog/1-ai-from-the-ground/index.md` vs hard-coded `src/pages/transmission.astro` → `SignalTransmission.astro` (623 lines of copied HTML) | One MDX source; `/transmission` and `/1-ai-from-the-ground/` 301 to `/01-ai-from-the-ground-up/` |
| 4 | High | Light mode unreadable: dark text on grey cards, 254 contrast failures | axe on `/transmission` | New design, 0 violations |
| 5 | Medium | npm and `latest` ranges; dr4w uses pnpm with exact versions | `package.json` | pnpm 12.11.2, exact versions, lockfile |
| 6 | Medium | Two content configs; the home page queries a collection `blog` defined nowhere consistent | `src/content/config.ts` (`''`), `src/content.config.ts` (`blog`) | One `src/content.config.ts` |
| 7 | Medium | CI is a no-op: `make lint` and `make test` only echo | `Makefile` | Real lint, typecheck, tests, build and judges |
| 8 | Medium | Unpinned actions, Terraform/AWS steps for a static site | `.github/workflows/deploy.yml` | dr4w-shaped workflows, SHA-pinned, no AWS |
| 9 | Medium | Docs contradict code: dev port 5173 vs 4321; red vs purple palette; Pages vs Workers | `README.md`, `REDESIGN_PLAN.md`, `REFACTOR_PLAN.md` | New `README.md`, `CLAUDE.md`, `docs/` |
| 10 | Medium | Docs point to another workspace path and files not in this repo | `CURRENT_STATE.md`, `PHASE_D_RESUMPTION.md` (`…/agents_pipeline/projects/blog`, `scripts/deploy.sh`) | Removed; what still matters moved to `docs/` |
| 11 | Low | ~10 planning files at the root, no single source of truth | repo root | Removed; `docs/STATUS.md` is the source of truth |
| 12 | Low | Preview environment `blog-sbx` configured but not wanted | `wrangler.toml` `[env.preview]` | Removed ([ADR 0003](decisions/0003-no-sandbox.md)) |
| 13 | Low | 5.5 MB of sprites, comics and reference PNGs | `public/assets/` | Removed with the theme |
| 14 | Low | Fonts declared but never loaded (fallbacks rendered) | taste-skill inspector `font-fallback` | Self-hosted, subset fonts |
| 15 | Low | "No hard-coding" lint rule forced every SVG coordinate into constants | `.eslintrc.cjs`, `src/constants/` | Biome; design tokens in CSS |

## Gap table: blog vs the dr4w routine

Covered item by item in [dr4w-directives.md](dr4w-directives.md); every row there was a gap except
the GitHub repo itself and the Cloudflare account.

## Baselines (Lighthouse 13.4, mobile; axe 4.13, WCAG 2.2 AA + best practice)

| Page | Perf | A11y | Best pr. | SEO | LCP | axe violations |
|---|---|---|---|---|---|---|
| `dr4w.io` | 71 | 96 | 100 | 92 | 5.2 s | 1 (contrast) |
| old blog home (pages.dev) | 97 | 93 | 100 | 58\* | 2.6 s | 1 (2 nodes) |
| old `/transmission` | 71 | 94 | 96 | 58\* | 5.2 s | 2 (255 nodes) |
| old `/1-ai-from-the-ground/` | 100 | 93 | 100 | 58\* | 1.2 s | 1 (9 nodes) |

\* `pages.dev` previews send `noindex`, which costs SEO points. The new site must beat every number.

## UI audit (redesign-existing-projects + design-taste-frontend gate)

- **Gate on `/transmission`: 13 FAIL, 11 WARN**; home: 4 FAIL, 9 WARN; `lint.mjs` on `src/`: 84 FAIL, 45 WARN.
- Typography: Inter / Space Grotesk declared but never loaded; 11–12 font sizes; 15 px body; 13-word headline.
- Colour: violet/cyan "AI gradient" palette, gradient headline text, low-contrast muted text (3:1).
- Surfaces: 28 backdrop-blur glass cards, 1 px outlined boxes, hairlines, grid background, glows.
- Layout: rows of identical cards; floating pill navigation; diagrams with overlapping labels.
- Content: "LOG 01" mission language, emoji in meta, a numbered table of contents in monospace.
- States: no skip link, no visible focus style in places, duplicate landmark names.
- Must-fix (all addressed by the rebuild): contrast, unloaded fonts, overlapping diagram labels, glass and gradients, duplicate article.

## Content inventory: "AI From the Ground Up"

- 8 parts + conclusion; 6,613 words in Markdown (about 26 minutes); the hard-coded page had a trimmed copy.
- Diagrams in the old page: D1 autocomplete loop, D2 three training phases, D3 tokenizer strip,
  D4 semantic space, D5 context window, D9 temperature, D11 attention layers, D13 harness, D16 system
  architecture (plus an ASCII diagram in the Markdown). Labels overlapped at 1440 px.
- Widgets: tokenizer (counted words × 1.33, not tokens), temperature slider (three hard-coded word
  lists), agent stepper. All three needed JavaScript to show anything.
- Images: one banner SVG; sprites and comics belonged to the theme, not the article.
- Outdated claims found: see [sources.md](sources.md) and the change summary in `docs/STATUS.md`.

## Landing page

- **Design language:** dark ground `#0A0A0F`, violet `#6C63FF`, cyan `#00D9FF`, Space Grotesk + Inter +
  JetBrains Mono, glass cards, monospace section labels, framer-motion fade-ups, a robot illustration.
- **Sections:** Hero, About, Experience, Skills, Projects, AI & Agents, Game demo, Story, Support,
  Interests, Resume, Contact. Nav has 8 anchor links plus a Resume button.
- **Where Writing fits:** right after "AI & Agents" (the blog's subject) and before the game demo;
  nav link "Writing" after "AI". The section reads `feed.json` at build time ([ADR 0007](decisions/0007-landing-feed.md)).
- **Found on the way:** `index.html` meta description says "Based in Niterói, RJ" while the hero says
  Brisbane; fonts load from Google Fonts at runtime; Lighthouse Performance 71 (5.8 MB page).

## Design research: what the best technical writing sites do

Studied for principles, not looks: Practical Typography (Butterick), Tufte CSS, Gwern.net, Distill,
Bartosz Ciechanowski, Stripe Press, The Pudding, Robin Sloan, Craig Mod, Increment.

- **Measure** 60–75 characters; body 18–21 px for serif text on desktop, 17–18 px for sans.
- **Leading** 1.5–1.7 for long reading; headings tight (0.95–1.15) and set close to the text they own.
- **Rhythm:** space above a heading at least twice the space below; one size jump per level.
- **Figures** sit where they are first discussed, are allowed wider than the text, and carry a
  numbered caption that says what to notice, not what the picture is.
- **Sidenotes** (Tufte, Gwern) keep digressions next to their sentence on wide screens and fall back
  inline on phones.
- **Interactive figures** (Ciechanowski, Distill) explain by doing, start in a meaningful state, and
  never block reading.
- **Code** in the same column, quiet background, no line numbers for short snippets.
- **Navigation** stays out of the way: a table of contents, anchors on headings, previous/next issue.

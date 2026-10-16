# Stack

Pinned in the repo. Last checked: **2026-10-15** (`package.json`, `pnpm-lock.yaml`, `.nvmrc`, workflow SHAs).

| Tool | Version | Why |
|---|---|---|
| Node.js | 24 (`.nvmrc`, `engines`) | same as dr4w |
| pnpm | 12.11.2 (`packageManager`) | same as dr4w; minimum release age policy |
| Astro (+ MDX, sitemap, RSS) | 7.3.8 (+ 8.0.3, 3.7.4, 4.0.19) | static site, content collections, Fonts API |
| TypeScript | 6.0.3 | `astro check` does not support TypeScript 7 yet (dr4w uses 7.0.2) |
| Biome | 2.5.15 | lint + format, same config as dr4w |
| Vitest | 5.0.4 | unit tests for registry, tokenizer, temperature, feeds, scripts |
| wrangler | 4.151.0 | deploys the static assets Worker (CI only) |
| Lighthouse, axe-core, Playwright, html-validate, linkinator | 13.5.0, 4.13.0, 1.64.1, 11.16.2, 8.1.0 | judges |
| satori + resvg | 0.57, 2.6 | Open Graph images at build |
| subset-font | 2.9 | cuts fonts to the characters the site uses |
| gpt-tokenizer | 4.0 | real token IDs in issue 1's figure (build time only) |
| Source Serif 4 | @fontsource-variable 5.3 | the one typeface of the Essay design |

GitHub Actions (SHA-pinned, same as dr4w): actions/checkout v7.0.1, actions/setup-node v7.1.0,
pnpm/action-setup v6.1.0.

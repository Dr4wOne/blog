# Design archive: the ten prototypes

Ten working directions for the blog, built at G1 (2026-10-15) from the real issue 1. **Essay (`p01`)
was chosen** and became the site ([docs/design-system.md](../docs/design-system.md)). The other nine
stay here, runnable, for future reference or a redesign.

## See them
```bash
pnpm install
pnpm proto:build && pnpm proto:serve      # http://localhost:4331/gallery.html
```
- Gallery with screenshots, scores, palettes and the ranking: `http://localhost:4331/gallery.html`
  (source: `prototypes/public/gallery.html`).
- Each direction: `http://localhost:4331/p01/` (home) and `/p01/01-ai-from-the-ground-up/` (article),
  up to `p10`. Light/dark follow your system setting.
- Live-editing: `pnpm proto:dev` (port 4330).

| Id | Direction | Typefaces |
|---|---|---|
| p01 | **Essay** (chosen) | Source Serif 4 |
| p02 | Swiss grid | Schibsted Grotesk |
| p03 | Engineer's notebook | Hanken Grotesk |
| p04 | Longform magazine | Fraunces + Source Serif 4 |
| p05 | Monochrome + one accent | Public Sans |
| p06 | Book | EB Garamond |
| p07 | Research paper | Literata + Inter |
| p08 | Warm paper | Newsreader |
| p09 | Dark-first editorial | Space Grotesk + Inter |
| p10 | Index-first | Instrument Sans |

## Judge them again
```bash
pnpm proto:serve &                         # keep it running
pnpm proto:judge                           # Lighthouse, axe, taste-skill gate, contrast → prototypes/results.json (~50 min)
pnpm proto:judge p04,p09                   # just some
pnpm proto:gallery                         # screenshots + rebuild gallery.html from results.json and notes.json
```

## How they're built
- They render the **real** posts, figures and widgets from `src/`; only the look differs.
- `src/pages/pNN/` are thin routes; each direction is `src/themes/pNN/` = `Home.astro`, `Article.astro`,
  `theme.css` (tokens + layout) and `fonts.ts` (which fonts from `../fonts.config.mjs` it loads).
- Separate Astro config (`prototypes/astro.config.mjs`) so none of this ships with the site.
- CI builds the prototypes on every PR, so the archive keeps working as the site changes.

## Reuse one
Copy `src/themes/pNN/theme.css` into `src/styles/theme.css`, adjust class names to the site's
layouts (`src/layouts/Base.astro`, `src/pages/`), switch the font in `astro.config.mjs`, then update
`docs/design-system.md` and write an ADR.

# Design system: Essay

Chosen at G1 on 2026-10-15 from ten prototypes ([design archive](../prototypes/README.md)). One serif
column at reading width; optional detail lives in the margin. The writing carries the page.
Code: `src/styles/theme.css` (tokens + layout), `src/styles/base.css` (shared foundation),
`src/styles/figures.css` (figures and widgets). The rules below are enforced by `pnpm judges`
([judges.md](judges.md)) and summarised for agents in `.claude/skills/blog-design/SKILL.md`.

## Tokens
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#fafafa` | `#0a0a0f` (dr4w.io's ground) | page ground |
| `--surface` / `--surface-2` | `#efeff0` / `#e3e3e6` | `#16161d` / `#22222b` | figures, widgets, notes on phones, pager |
| `--ink` | `#17171a` (17.1:1) | `#ebe9e4` (16.3:1) | all running text: AAA |
| `--muted` | `#55545a` | `#a8a6a1` | dates, meta, captions only (≥ 7:1) |
| `--accent` / `--link` | `#1b4d89` | `#9cbcf2` | links, focus, figure highlights, quote bar |

Rules: every colour comes from a token; the accent marks links, focus and the one thing a figure
highlights; nothing else is coloured. No gradients, shadows, glass, hairline boxes or emoji.
Light and dark follow the reader's system setting (no toggle, so the home page needs no JavaScript).

## Type
One family: **Source Serif 4** (self-hosted, variable weight, subset at build: 400–700 upright, 400 italic,
about 35 KB). The upright face is preloaded and uses `font-display: optional`: it shows from the first
paint, and if it ever arrives late the metric-matched fallback stays for that page (no layout shift).
Don't remove the preload: without it most first visits render in the fallback. Code uses the system monospace. Five steps only:

| Step | Size | Use |
|---|---|---|
| `--step-display` | 41–80 px | the page's one `h1` |
| `--step-head` | 26–36 px | `##` section headings |
| `--step-lead` | 20–24 px | `###`, summary under the title, home intro |
| `--step-body` | 18–20 px, leading 1.62 | running text, measure 35 rem (about 68 characters) |
| `--step-small` | 14–15 px | meta, captions, notes, footer |

Headlines and section titles: **two lines at most at every width** (about 32 characters is always safe).
Sentence case. Weight 600 for headings, 400 for text, no bold paragraphs.

## Layout
- One centred frame: text column 35 rem + 3.5 rem gap + 15 rem margin column.
- `<Aside>` (deep dives) float into the margin from 72 rem wide, and sit inline on a `--surface` panel
  below that. Keep each under about 120 words so it stays beside its paragraph.
- Figures and widgets stay in the text column (max 34 rem), with a caption that says what to notice.
- Space above a heading is at least twice the space below it.

## Components (MDX)
| Component | When |
|---|---|
| `## Heading` | each section; forms the table of contents (shown when there are 3+) |
| `> **Analogy:** …` | an analogy or a key sentence; set italic with an accent bar |
| `<Aside title="Deep dive: …">` | optional detail a reader can skip |
| `[^name]` footnote | the source of a claim; rendered as "Notes" at the end |
| `src/components/figures/*.astro` | diagrams: inline SVG, `role="img"`, `<title>` + `<desc>`, colours from `--fig-*` tokens |
| `src/components/widgets/*.astro` | interactive pieces: full static version without JS, code loaded only near the viewport |

## Motion
Transform only, never opacity on text: sections' figures, notes and headings rise 1.5 rem as they
scroll in (CSS scroll-driven animation); the home page rises once on load. Everything is still with
`prefers-reduced-motion`. No animation library.

## Do and don't
- ✅ One idea per section, a one-line takeaway at the end ("**In one line:** …").
- ✅ Real figures drawn for the post; real, credited photographs only where they show the subject.
- ❌ Labels above headings ("eyebrows"), numbered section titles, monospace outside code.
- ❌ Cards for lists of posts; the home page is a list.
- ❌ JavaScript on the home page; more than 20 KB before widgets on an article.

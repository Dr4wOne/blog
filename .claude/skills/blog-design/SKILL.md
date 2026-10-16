---
name: blog-design
description: House design and writing rules for blog.dr4w.io (the "Essay" design). Use whenever you write, edit or review a post, add a figure or widget, or change anything under src/styles, src/components, src/layouts or src/pages.
---

# Blog design rules (Essay)

The full system is `docs/design-system.md`; read it before changing styles. These are the rules that
matter most when writing or reviewing a post:

1. **Structure.** Title ≤ 2 lines (about 32 characters is safe). Summary ≤ 25 words. `##` per section
   (they build the table of contents), `###` inside. End each section with `**In one line:** …`.
2. **Optional detail** goes in `<Aside title="Deep dive: …">` (≤ ~120 words). It floats into the margin on
   wide screens. Never put essential steps in an aside.
3. **Analogies and key sentences** are blockquotes: `> **Analogy:** …`.
4. **Sources.** Every technical or factual claim gets a footnote `[^key]` with author, title, year and a
   primary-source URL. Check facts against today's sources, not memory.
5. **Figures** are Astro components in `src/components/figures/` built on `Figure.astro`: inline SVG,
   `viewBox` about 420 wide, `role="img"` + `<title>` + `<desc>` that says what the figure shows, colours
   only from the `--fig-*` classes (`box`, `box-accent`, `wire`, `t-muted`, …), a caption that says what
   to notice. Labels must not overlap at 360 px.
6. **Widgets** render a complete static version on the server; their code is a `*.client.ts` module
   registered in `src/scripts/islands.ts` and loaded only near the viewport. Keyboard operable, labelled,
   `aria-live` for results.
7. **Never:** labels above headings, numbered headings, monospace outside code, gradients, shadows,
   glass, emoji, new colours or fonts, JavaScript on the home page.
8. **Check:** `pnpm build && pnpm judges` must pass (Lighthouse 100 ×4, LCP < 1 s, CLS 0, axe 0,
   taste-skill gate 0 FAIL). Then run a fresh cold-reader subagent on the post text and fix what it finds.

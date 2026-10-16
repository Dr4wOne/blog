# Status

**Last updated:** 2026-10-16 · branch `feat/relaunch` (not merged yet)
Update this file with `/handoff` at the end of every session.

## Live
| What | URL | Since |
|---|---|---|
| Blog (Essay design, issue 1) | https://blog.dr4w.io — **not live yet**: waiting for the cutover ([cutover.md](cutover.md)) | — |
| Old sandbox (to retire) | `b3291982.blog-sbx.pages.dev` | 2026-10-13 |

## Issues
| No. | Title | Published |
|---|---|---|
| 1 | [AI From the Ground Up](../src/content/posts/ai-from-the-ground-up/index.mdx) | 2026-10-15 |

## In progress
- Relaunch PR from `feat/relaunch`: new site, Essay design, dr4w-style pipeline, judges, docs.
- Landing page: three Writing-section options on `Dr4wOne/dr4w-landpage` branch `feat/writing-section`,
  waiting for a pick (G3).

## Next up
1. Create the two tokens and the `production` environment ([cutover.md](cutover.md) §1–2), then merge the relaunch PR.
2. Verify live with `pnpm judges --live https://blog.dr4w.io`, then retire `blog-sbx` (separate "go").
3. Pick a landing Writing option; launch it through the landing repo's deploy.

## Known issues
| Item | Impact | Where |
|---|---|---|
| `card-rows`, `size-count` and `still-page` warnings from the taste-skill gate (not fails) | Cosmetic: figures and widgets add font sizes; the home page has little motion by design | `src/components/figures/` |
| Prototype archive: p03 article and p06 home each keep one gate FAIL | Archive only; the chosen design passes | [prototypes/README.md](../prototypes/README.md) |

## Recent decisions
1. [0009 Article LCP is judged with real throttling](decisions/0009-article-lcp-measurement.md)
2. [0008 English only](decisions/0008-english-only.md)
3. [0007 The landing page reads `feed.json` at build time](decisions/0007-landing-feed.md)
4. [0006 Design rules from taste-skill, pinned to a commit](decisions/0006-taste-skill.md)
5. [0005 A clean editorial design replaces the "signal log" theme](decisions/0005-editorial-design.md) (Essay chosen 2026-10-15)
6. [0004 Cloudflare Workers static assets, deployed like dr4w](decisions/0004-workers-static-assets.md)
7. [0003 No preview or sandbox environment](decisions/0003-no-sandbox.md)
8. [0002 URLs use issue numbers](decisions/0002-issue-number-urls.md)
9. [0001 The blog stays its own repo](decisions/0001-own-repo.md)

# Status

**Last updated:** 2026-10-16 · `main` live on https://blog.dr4w.io
Update this file with `/handoff` at the end of every session.

## Live
| What | URL | Since |
|---|---|---|
| Blog (Essay design) | https://blog.dr4w.io | 2026-10-16 |
| Writing section on the landing page (rebuilds on every blog deploy) | https://dr4w.io/#writing | 2026-10-16 |
| Old sandbox, to retire | `b3291982.blog-sbx.pages.dev` | 2026-10-13 |

## Issues
| No. | Title | Published |
|---|---|---|
| 1 | [AI From the Ground Up](../src/content/posts/ai-from-the-ground-up/index.mdx) | 2026-10-15 |

## Next up
1. Exclude `blog.dr4w.io` from Cloudflare Web Analytics' automatic setup: the injected beacon is blocked by
   the CSP, logs a console error and holds Best Practices at 92 (the only failing live judge).
2. Retire the sandbox on a "go": [cutover.md](cutover.md) §5 (Pages project `blog-sbx`, its DNS record,
   GitHub environments `sandbox` and `prod`, variables `AWS_REGION` and `BASE_DOMAIN`).
3. Write issue 2: `pnpm post:new <slug> "<title>"` ([guides/new-post.md](guides/new-post.md)).

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

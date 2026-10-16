# blog.dr4w.io — agent guide

## Stack
- Astro 7 (static output, MDX) on a Cloudflare Worker with static assets (`wrangler.jsonc`, Worker `dr4w-blog`).
- pnpm 12 + Node 24, TypeScript, Biome. Versions: `docs/stack.md`. No server code, no API, no AWS.
- Follows the dr4w platform rules: `docs/dr4w-directives.md`.

## Never
- Merge to `main` (= deploy), run `wrangler deploy`, or change Cloudflare/DNS/GitHub settings without an explicit "go".
- Edit an existing entry in `issues.json` or renumber/delete a published post (ADR 0002).
- Commit secrets, `.env*`, `.dev.vars`. The repo is **public**.
- Add `minimumReleaseAgeExclude`: pin an older version instead.
- Add client JavaScript to the home page, or more than 20 KB before widgets load on an article.

## Commands
`pnpm dev` · `pnpm check` (lint, typecheck, tests, build) · `pnpm judges` (every quality judge, `docs/judges.md`)
· `pnpm preview` · `pnpm post:publish <slug>`.
Ship: branch → PR (`check` must pass) → squash-merge = deploy (`docs/guides/deploy.md`).
Push: `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -u origin <branch>`.

## Read X when Y
| When | Read |
|---|---|
| Starting a session | `docs/STATUS.md` (or `/start`) |
| Writing or publishing a post | `docs/guides/new-post.md`, `/new-post`, `/publish-post` |
| Changing the look | `docs/design-system.md` |
| A judge fails | `docs/judges.md` |
| Deploying, rolling back | `docs/guides/deploy.md`, `docs/guides/rollback.md`, `docs/cutover.md` |
| "Why is it like this?" | `docs/decisions/README.md` |
| Checking a fact in issue 1 | `docs/sources.md` |

## Caveman + ponytail (plugins; `.claude/settings.json`)
- Caveman voice is for **chat only**. Posts, docs, ADRs, PR descriptions and commit bodies stay plain English.
- **Never cut:** accessibility, the issue-registry checks, tests for logic, the judges.
- Design work follows taste-skill (`.claude/skills/`, pinned in ADR 0006).

## Session protocol
`/start` first · `/doc-check` before merging · `/handoff` at the end.
**The repo is the memory:** `docs/STATUS.md`, `docs/decisions/`, the right doc.

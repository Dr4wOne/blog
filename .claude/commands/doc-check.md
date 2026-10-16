---
description: Before merging — find docs made stale by the current diff and fix them
---

1. `git diff --name-only main...HEAD` (plus uncommitted changes).
2. For each changed area, check the docs that describe it:
   - `package.json`, `pnpm-lock.yaml`, `.nvmrc`, workflow SHAs → `docs/stack.md` (versions + "last checked").
   - `.github/workflows/**`, `wrangler.jsonc`, `public/_redirects`, `public/_headers` → `docs/guides/deploy.md`, `docs/cutover.md`.
   - `src/content.config.ts`, `issues.json`, `src/lib/issues.ts` → `docs/guides/new-post.md`, ADR 0002.
   - `src/styles/**`, `src/components/**` → `docs/design-system.md`.
   - `scripts/**`, `package.json` scripts → `README.md` commands, `docs/judges.md`.
   - `.claude/commands/**` → `README.md`, `CLAUDE.md`.
3. Check that quoted snippets and paths still match the code. Fix what's stale (plain English, one
   home per fact) and list what you changed and why.

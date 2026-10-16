# 0003 · No preview or sandbox environment

**Date:** 2026-10-15

## Context
The old pipeline deployed every merge to `blog-sbx` (Cloudflare Pages) and production by hand. dr4w
decided against preview environments ([dr4w ADR 0014](https://github.com/Dr4wOne/dr4w/blob/main/docs/decisions/0014-no-pr-previews.md)).

## Decision
Two places only: local (`pnpm dev`, `pnpm preview`) and `blog.dr4w.io`. CI runs every judge on the PR
against a local build; merging deploys. The `blog-sbx` Pages project and its DNS record are removed
after the cutover ([cutover.md](../cutover.md)).

## Consequences
One less environment to secure and keep in sync. A bad merge is fixed by rollback
([guides/rollback.md](../guides/rollback.md)), which takes about a minute.

## Status
Accepted.

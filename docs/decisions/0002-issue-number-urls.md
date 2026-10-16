# 0002 · URLs use issue numbers

**Date:** 2026-10-15

## Context
Readers cite posts by link. Dates in URLs age badly; bare slugs say nothing about order.

## Decision
A published post gets the next issue number, and its URL is the two-digit padded number plus the slug:
`/01-ai-from-the-ground-up/` (issue 100 becomes `/100-…/`). `issues.json` is the append-only registry.
Drafts have no number. Nothing is ever renumbered or removed. The build fails on a duplicate number,
a gap, a changed slug or a deleted published post (`src/lib/issues.ts`), and CI fails if the
registry on a branch changes an entry that exists on `main`. Old URLs (`/1-ai-from-the-ground/`,
`/transmission`) redirect with a 301.

## Consequences
Links never break and the site reads like a numbered publication. Publishing needs one step that
assigns the number (`/publish-post`).

## Status
Accepted.

# 0007 · The landing page reads `feed.json` at build time

**Date:** 2026-10-15

## Context
`dr4w.io` should show the latest posts without a runtime dependency on the blog.

## Decision
The blog publishes `feed.json` (JSON Feed 1.1) and `rss.xml`. The landing page fetches
`https://blog.dr4w.io/feed.json` when it builds, falls back to a committed copy if the fetch fails, and
shows the latest three issues. After each blog deploy, the blog's workflow sends a
`repository_dispatch` event (`blog-published`) to `Dr4wOne/dr4w-landpage`, which rebuilds and deploys.
The token is fine-grained, limited to that repository, with **Contents: read and write** (the
minimum GitHub requires for `POST /repos/{owner}/{repo}/dispatches`).

## Consequences
No client-side fetch on the landing page and no coupling at request time. A failed dispatch only
delays the landing update until its next build.

## Status
Accepted.

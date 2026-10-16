# 0001 · The blog stays its own repo

**Date:** 2026-10-15

## Context
The dr4w monorepo hosts projects that each pair a React app with a Lambda API. The blog is a static
site with its own release rhythm (a post is published when it is ready) and no API.

## Decision
Keep the blog in `Dr4wOne/blog`, outside the monorepo, and follow the dr4w routine through
[docs/dr4w-directives.md](../dr4w-directives.md). The dr4w README lists it as an external project.

## Consequences
Blog CI is small and fast, and a post never waits for platform changes. Shared rules are copied, not
imported, so the directives page must be re-checked when dr4w changes them.

## Status
Accepted.

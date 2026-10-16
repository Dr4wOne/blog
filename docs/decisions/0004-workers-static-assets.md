# 0004 · Host on Cloudflare Workers static assets, deployed like dr4w

**Date:** 2026-10-15

## Context
The old blog targeted Cloudflare Pages through a generic workflow with npm, unpinned actions and
optional Terraform. dr4w deploys Workers with static assets through pinned, minimal workflows.

## Decision
Build static HTML with Astro and deploy it as the Worker `dr4w-blog` with static assets only (no
script), custom domain `blog.dr4w.io` declared in `wrangler.jsonc`. Redirects and headers use the
assets `_redirects` and `_headers` files. pnpm, Node 24, Biome, SHA-pinned actions, the `production`
environment for secrets, and a post-deploy check against the live site, as in dr4w.

## Consequences
Free hosting, no server code, and the same deploy and rollback routine as every dr4w project.

## Status
Accepted.

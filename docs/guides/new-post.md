# Write and publish a post

**Short version:** `/new-post <slug> "<title>"` → write → `/publish-post <slug>` → merge the PR.

## 1. Start a draft
```bash
git checkout main && git pull
git checkout -b post/<slug>
mkdir -p src/content/posts/<slug>
# create src/content/posts/<slug>/index.mdx from the template below
pnpm dev        # http://localhost:4321/drafts/<slug>/ (drafts are never built for production)
```

## 2. Template
```mdx
---
slug: my-post
title: A short title, two lines at most
summary: "One sentence, 40–300 characters; about 25 words reads best on cards and in feeds."
tags: [ai, engineering]
draft: true
---

import Aside from '../../../components/Aside.astro'

Opening paragraph: the claim, then why it matters.

## First section

<Aside title="Deep dive: something optional">

Detail a reader can skip.

</Aside>

A claim that needs a source.[^src]

[^src]: Author, "Title", year. https://example.org
```
Rules: no `issue` and no `published` in a draft (the build fails otherwise); `##` for sections (they
form the table of contents); every technical claim gets a footnote with a primary source; figures are
components in `src/components/figures/` with `<title>`, `<desc>` and a caption.

## 3. Publish
`/publish-post <slug>` runs `pnpm post:publish <slug>`, which takes the next issue number
(`issues.json` length + 1), appends it to `issues.json`, and sets `issue`, `published`, `updated` and
`draft: false`. Then it runs `pnpm check` and `pnpm judges` and opens a PR. The URL becomes
`/NN-<slug>/` and never changes.

## 4. Merge = deploy
Squash-merge the PR. `deploy.yml` deploys to `blog.dr4w.io`, re-runs the judges against production and
tells `dr4w.io` to rebuild its Writing section.

## Fix a typo in a published post
Edit the MDX, bump `updated`, PR, merge. Never change `slug` or `issue`, never delete the post.

## Common mistakes
- Adding `issue:` by hand: use `pnpm post:publish`, which also updates `issues.json`.
- A headline over two lines on a phone: shorten it; the design gate fails it.

---
description: Publish a draft — assign the next issue number, run every judge, open the PR
argument-hint: <slug>
---

Publish `src/content/posts/$ARGUMENTS/index.mdx`.

1. Preconditions: on branch `post/<slug>`, rebased on `origin/main`; the post has `draft: true` and no `issue`.
2. Assign the number: `pnpm post:publish <slug>` (next number = `issues.json` length + 1; it appends
   `{ issue, slug, published }` to `issues.json` and sets `issue`, `published`, `updated`,
   `draft: false` in the frontmatter). Never edit an existing `issues.json` entry.
3. Editorial checks: every technical claim has a source footnote; figures have captions and `<title>`/`<desc>`;
   run a fresh cold-reader subagent on the article text ("You are a developer who knows nothing about X…")
   and fix what it finds confusing.
4. `pnpm check` (lint, typecheck, tests, build) then `pnpm judges` — every judge must pass
   (`docs/judges.md`). Fix, don't override.
5. Commit `post: publish issue <n>: <title>`, push
   (`git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -u origin post/<slug>`),
   `gh pr create` with the judge table in the body.
6. **Stop and ask me for "go"** before merging. Merging deploys and notifies dr4w.io.

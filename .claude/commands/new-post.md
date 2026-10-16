---
description: Scaffold a new draft post (no issue number until /publish-post)
argument-hint: <slug> "<title>"
---

Create a draft for `$ARGUMENTS`.

1. Slug: lowercase words joined by `-` (`^[a-z0-9]+(-[a-z0-9]+)*$`), not already used in
   `src/content/posts/` or `issues.json`. Ask for a title if none was given.
2. Branch `post/<slug>` from an up-to-date `main`.
3. Create `src/content/posts/<slug>/index.mdx` from `docs/guides/new-post.md` → "Template":
   frontmatter `slug`, `title`, `summary` (40–300 characters, ≤ 25 words reads best), `tags`,
   `draft: true`, **no** `issue`, **no** `published`.
4. Run `pnpm dev` and give me the draft URL: `http://localhost:4321/drafts/<slug>/`.
5. Commit `post: start <slug> (draft)`. Do not open a PR yet.

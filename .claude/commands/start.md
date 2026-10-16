---
description: Session start — brief me on where the blog stands
---

Get oriented, then brief me. Read only what's needed:

1. `CLAUDE.md` (already loaded) and `docs/STATUS.md`.
2. `git log --oneline -15`, `git status -sb`, `gh pr list --repo Dr4wOne/blog`, and the last deploy
   (`gh run list --workflow deploy.yml --limit 3`).
3. Drafts in progress: posts with `draft: true` under `src/content/posts/`.

Reply with a **5-line briefing** (caveman voice is fine in chat; paths, commands and branch names exact):
1. Where we are (latest issue, last deploy).
2. In progress (drafts, open PRs, current branch).
3. Anything broken (failing CI, known issues that matter now).
4. Uncommitted or unpushed work.
5. Suggested next step.

Don't change anything.

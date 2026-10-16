---
description: Session end — save what matters into the repo (STATUS, ADRs, docs) and commit
---

Make the repo remember this session.

1. Review: `git log --oneline main..HEAD`, `git diff --stat`, and what we discussed.
2. Update `docs/STATUS.md`: "Last updated" (date + `git rev-parse --short HEAD`), Live, In progress,
   Next up, Known issues (include every ponytail `shortcut:` added: `git diff main...HEAD | grep -n 'shortcut:'`).
3. A decision was made? Add `docs/decisions/NNNN-<slug>.md` (Context · Decision · Consequences · Status),
   list it in `docs/decisions/README.md` and in STATUS → Recent decisions.
4. Run the `/doc-check` steps on this session's changes.
5. `pnpm lint`, then commit only doc changes as `docs: session handoff` on the current branch
   (never on `main`). Show the summary.

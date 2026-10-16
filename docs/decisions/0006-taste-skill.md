# 0006 · Design rules from taste-skill, pinned to a commit

**Date:** 2026-10-15

## Context
Generated interfaces drift toward the same look. The job brief names
[taste-skill](https://github.com/Leonxlnx/taste-skill) as the design method.

## Decision
Install `design-taste-frontend`, `redesign-existing-projects`, `minimalist-ui`,
`full-output-enforcement`, `high-end-visual-design` and `industrial-brutalist-ui` into
`.claude/skills/` as copies from commit `f624f37a8c650b9cc550253104925efe4c8de246` (2026-10-14,
taste-skill 2.0.0); `skills-lock.json` records their hashes. Its gate (`lint.mjs` + `inspect.mjs`)
is a judge. Where it conflicts with this project, the project wins and the exception is written down:
- `few-pictures` and `no-footage` are allowed: an explanatory article has no honest photographs or
  footage of its subject; its pictures are original diagrams, which the gate does not count.
- Its motion floor is met with CSS-only scroll and load movement (transform only, reduced-motion
  safe), because article pages must stay under 20 KB of JavaScript.
- `palette-purple` is allowed only for a design that uses the dr4w.io brand violet on purpose
  (taste-skill's own rule for a brand-owned colour).
- Issue numbers are content (the URL scheme in [ADR 0002](0002-issue-number-urls.md)), not decoration.

## Consequences
Updates are deliberate: re-run the installer, review the diff, update the commit here.

## Status
Accepted.

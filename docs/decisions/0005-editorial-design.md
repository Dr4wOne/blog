# 0005 · A clean editorial design replaces the "signal log" theme

**Date:** 2026-10-15

## Context
The first blog used a sci-fi theme (orbs, grids, fading sprites, a comic strip, mission-log language).
It looked busy, failed contrast checks in light mode, loaded 5.5 MB of art, and buried the writing.

## Decision
Retire the theme and its assets. Build ten working editorial prototypes from the real article, judge
them with outside tools, and pick one at gate G1. The chosen direction is recorded in
[design-system.md](../design-system.md).

## Consequences
The article carries the site. Old components, constants and art are deleted (git keeps them).

## Status
Accepted. At G1 (2026-10-15) Daniel chose **Essay** (prototype p01), with the home page rewritten as a
personal blog on any topic. Rules: [design-system.md](../design-system.md); archive of all ten:
[prototypes/README.md](../../prototypes/README.md).

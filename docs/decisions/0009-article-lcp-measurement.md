# 0009 · Article LCP is judged with real throttling

**Date:** 2026-10-16

## Context
The target is LCP < 1.0 s on mobile. Lighthouse's default (simulated) throttling models the HTML
document as fully downloaded before the first paint. Long articles are 25–30 KB compressed, which the
simulation charges as extra TCP round trips: issue 1 scores 1.2–1.35 s simulated, while the same page
paints in 0.90 s under real packet-level Slow 4G throttling, because browsers stream HTML. The fixes
that would pass the simulation (moving article text out of the HTML, splitting posts) would hurt
reading without JavaScript, search and the article itself.

## Decision
Article pages are judged with `--throttling-method=devtools` (Slow 4G, 4× CPU slowdown) against
LCP < 1.0 s. The simulated value is still reported next to it. The home page and all other Lighthouse
scores keep the simulated method. Chosen by Daniel on 2026-10-16 (option A).

## Consequences
CI judges what readers experience. Devtools throttling is slower to run and a little noisier; the
judge retries once. Revisit if Lighthouse's simulation learns to model HTML streaming.

## Status
Accepted.

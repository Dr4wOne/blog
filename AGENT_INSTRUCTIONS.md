# Agent Instructions — Blog Project

**CRITICAL**: Do not skip Phase 3 (Rewrite to Standard). Phase 4 deploy is BLOCKED until Phase 3 is complete.

---

## Pipeline Phases (In Order)

### ✅ Phase 0: Preflight
Check tools, build, auth. Status: Complete.

### ✅ Phase 1: Plan
Create brief (`briefs/blog.md`). Status: Complete.

### ✅ Phase 2: POC (Proof of Concept)
Build minimal working version. All 8 article parts rendering at localhost:4321. Status: Complete.

### 🔄 Phase 3: Rewrite to Standard (YOU ARE HERE)
**DO NOT SKIP THIS.**

This phase refactors code to meet standards:
- Extract all hardcoded values to constants
- Apply SOLID principles
- Apply Clean Code practices
- Add tests for critical logic

See: `PHASE_3_REFACTORING.md` (detailed requirements)

**What to do:**
1. Extract hardcoded values to `src/constants/` files
   - `colors.ts` — all hex color codes
   - `diagrams.ts` — SVG sizes, stroke widths, viewBox
   - `labels.ts` — all UI text strings
   - `layout.ts` — spacing, typography, breakpoints

2. Update components to import and use constants (no hardcoding)

3. TypeScript strict mode must pass: `npx tsc --strict`

4. ESLint must pass: `npm run lint`

5. Build must succeed: `npm run build`

**Validation before moving to Phase 4:**
- [ ] No hardcoded hex colors in components
- [ ] No magic numbers (14, 30, 2.5, etc.) outside constants
- [ ] All UI text in `labels.ts`
- [ ] TypeScript strict: 0 errors
- [ ] ESLint: 0 errors
- [ ] Build succeeds with no warnings

### Phase 4: Sandbox Deploy
**BLOCKED until Phase 3 complete.** Deploy to blog-sbx.dr4w.io via GitHub Actions.

### Phase 5: Online Verification
Test sandbox URL with smoke tests.

### Phase 6: Prod Gate
Request approval (`scripts/approve-prod.sh blog`), then deploy to production.

### Phase 7: Report
Write delivery report with test results, cost, limitations.

---

## Standards Being Applied

### SOLID Principles
**S** (Single Responsibility): Components render; constants define values  
**O** (Open/Closed): Add new diagram? Import constants, don't hardcode  
**L** (Liskov Substitution): Constants module provides consistent interface  
**I** (Interface Segregation): Separate colors, diagrams, labels, layout  
**D** (Dependency Inversion): Components depend on constants abstraction  

### Clean Code
- No hardcoded magic numbers or strings
- No repeated values (DRY principle)
- All values named meaningfully
- Types for enums (DiagramType, not string union)

### Reference
Standard location: `docs/standards/solid-clean-arch.md`
Mockshop example: `projects/mockshop/src/constants/`

---

## Commit Strategy

```bash
# Commit 1: Extract constants (no behavior change)
git commit -m "refactor: extract hardcoded values to constants

- colors.ts: all hex codes
- diagrams.ts: SVG typography and sizing
- labels.ts: UI text strings
- layout.ts: spacing and measurements"

# Commit 2: Update components to use constants
git commit -m "refactor: update components to use imported constants

- Diagrams.astro: use COLORS, DIAGRAM_SIZES
- Hero.astro: use COLORS, ARTICLE_LABELS
- SignalTransmission.astro: use ARTICLE_PARTS"

# Commit 3: Add validation tests (optional but recommended)
git commit -m "test: add constants validation

- Verify all colors defined
- Verify all diagram types covered
- Verify all labels complete"
```

---

## When You're Ready for Phase 4

1. Verify all Phase 3 requirements met (see checklist above)
2. Push to main branch
3. GitHub Actions CI runs (lint, type-check, build)
4. If all green → ready for Phase 4
5. Trigger deploy workflow manually via GitHub: `workflow_dispatch` → sandbox

**DO NOT manually run `scripts/deploy.sh sandbox blog`**  
The deploy happens via GitHub Actions CI/CD, not locally.

---

## Key Files

- `PHASE_3_REFACTORING.md` — Detailed refactoring requirements
- `src/constants/` — Where all hardcoded values live
- `src/styles/design-system.css` — Design token reference (not to be changed)
- `.github/workflows/deploy.yml` — CI/CD pipeline (GitHub handles deploy, not local scripts)

---

## Red Flags (Don't Do These)

❌ Skip Phase 3 and jump to deploy  
❌ Commit hardcoded hex values  
❌ Have `#[0-9A-F]` anywhere except constants/  
❌ Hardcode font sizes, padding, colors  
❌ Use string union instead of enum for DiagramType  
❌ Leave magic numbers unexplained  
❌ Run deploy locally (use GitHub Actions instead)  

---

## Questions?

Check these files in order:
1. `PHASE_3_REFACTORING.md` — What refactoring is needed
2. `docs/standards/solid-clean-arch.md` — Why these standards
3. `projects/mockshop/src/constants/` — Example of good structure
4. `src/constants/README.md` — How to use constants

---

**Remember**: The standards exist to make code:
- Maintainable (easier for next developer)
- Scalable (easier to add articles)
- Professional (production-ready quality)
- Themable (easier to change design)

Phase 3 ensures the blog is production-grade before deploying.

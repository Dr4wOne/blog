# No Hardcoding Policy

**RULE**: No hardcoded values anywhere in components or styles.

## What This Means

Every value must come from `src/constants/`:
- Hex colors → `COLORS` from `colors.ts`
- Font sizes → `DIAGRAM_TYPOGRAPHY` from `diagrams.ts`
- Stroke widths, padding, margins → Named constants
- UI text strings → `ARTICLE_LABELS` from `labels.ts`
- Spacing, breakpoints → `LAYOUT` from `layout.ts`

## How to Do It

### ❌ Wrong
```astro
<rect fill="#6C63FF" stroke-width="2" x="30" y="40" />
<h1 style="font-size: 3rem;">Title</h1>
```

### ✅ Right
```astro
---
import { COLORS } from '../constants/colors';
import { DIAGRAM_SIZING } from '../constants/diagrams';
---

<rect fill={COLORS.primary} stroke-width={DIAGRAM_SIZING.strokeStandard} x={DIAGRAM_SPACING.padding} y="40" />
<h1 style={`font-size: var(--h1FontSize)`}>Title</h1>
```

## ESLint Enforcement

ESLint will catch hardcoded hex colors and warn on magic numbers.

Run before commit:
```bash
npm run lint
```

It will fail on patterns like:
- `fill="#6C63FF"` → Use `COLORS.primary`
- `font-size: 14px` → Use `DIAGRAM_TYPOGRAPHY.fontMain`
- `margin: 30px` → Use named constant

## Adding New Values

1. Identify the type: color, size, text, layout?
2. Add to appropriate constants file in `src/constants/`
3. Import and use in component
4. Run ESLint to verify

## Why

- **Single source of truth** — Change design once
- **Maintainable** — No value scattered across 20 files
- **Themable** — Easy to support light/dark mode
- **Professional** — Production-quality code
- **SOLID compliance** — No magic values violates Clean Code standards

## Question: "Is this OK?"

Use this checklist:

- [ ] Is this a color? → Use `COLORS`
- [ ] Is this a size or font-size? → Use `DIAGRAM_TYPOGRAPHY` or `LAYOUT`
- [ ] Is this text the user sees? → Use `ARTICLE_LABELS`
- [ ] Is this a measurement (padding, gap, margin)? → Use `LAYOUT`

If YES to any → must go to constants. If NO → ask.

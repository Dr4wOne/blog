# Constants Directory

Single source of truth for all hardcoded values in the blog project.

## Files

- **colors.ts** — Design system colors (hex codes). Import from here instead of hardcoding `#6C63FF` throughout components.
- **diagrams.ts** — SVG diagram constants: typography sizes, stroke widths, colors, viewBox dimensions. Use these in `Diagrams.astro`.
- **labels.ts** — All UI text strings (for localization and consistency). Article titles, section names, navigation labels.
- **layout.ts** — Spacing, typography scale, breakpoints, z-index, animation durations.

## Usage Pattern

✅ **DO:**
```typescript
import { COLORS } from '@/constants/colors';
import { DIAGRAM_TYPOGRAPHY } from '@/constants/diagrams';

// Use constants
<rect fill={COLORS.primary} />
<text fontSize={DIAGRAM_TYPOGRAPHY.fontMain}>Label</text>
```

❌ **DON'T:**
```typescript
// Hardcode values
<rect fill="#6C63FF" />
<text fontSize="14px">Label</text>
```

## Adding New Constants

1. Identify the type of constant (color, diagram, label, layout)
2. Add it to the appropriate file
3. Export as `as const` for type safety
4. Update any components that use similar values

## Benefits

- **Single source of truth** — Change color once, updates everywhere
- **Maintainability** — Easy to see all values at a glance
- **Themability** — Could swap constants for dark/light mode
- **Localization ready** — All text in one place
- **Type safety** — TypeScript catches invalid references
- **Consistency** — Enforces design system compliance

## Reference

Standard: `docs/standards/solid-clean-arch.md` (Magic values section)

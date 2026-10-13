# Phase 3: Refactoring to Standard (BLOG PROJECT)

**Status**: REQUIRED (not yet completed)  
**Blocker**: Code must be refactored before Phase 4 Sandbox Deploy  
**Standard**: agents_pipeline/docs/standards/solid-clean-arch.md + testing.md

---

## What Needs Fixing

The blog project has **hardcoded magic values** throughout the codebase. Phase 3 requires extracting all of these to named constants per SOLID/Clean Code standards.

### Issue 1: Color Hex Codes (Diagrams.astro & Components)

**Current**: Hardcoded hex values like `#6C63FF`, `#00D9FF`, `#0A0A0F` repeated throughout SVG diagrams

**Problem**: 
- Same value written 20+ times → hard to maintain
- No single source of truth
- Violates DRY principle
- Cannot reuse across components

**Fix Required**:
```typescript
// src/constants/colors.ts (NEW FILE)
export const COLORS = {
  primary: '#6C63FF',        // purple (from design-system)
  primarySoft: '#8080FF',
  primaryDeep: '#4A42CC',
  accent: '#00D9FF',         // cyan
  accentSoft: '#33E0FF',
  warm: '#FF6B35',           // orange
  white: '#FFFFFF',
  bg: '#0A0A0F',
  bgSurface: '#111118',
  bgElevated: '#1A1A26',
  text: '#F0F0FF',
  textMuted: '#8888AA',
  textDim: '#4A4A6A',
} as const;
```

Then in `Diagrams.astro`:
```typescript
import { COLORS } from '../constants/colors';
// Use: fill={COLORS.primary} instead of fill="#6C63FF"
```

### Issue 2: SVG Typography & Sizing (Diagrams.astro)

**Current**: Magic numbers for font sizes, stroke widths, dimensions

```typescript
font-size: 14px;    // What does this represent?
stroke-width: 2.5;  // Why 2.5?
x="30" y="25"       // Magic coordinates
```

**Problem**: No semantic meaning, cannot scale diagrams

**Fix Required**:
```typescript
// src/constants/diagrams.ts (NEW FILE)
export const DIAGRAM_SIZES = {
  fontMain: 14,
  fontLabel: 12,
  fontSmall: 11,
  fontCaption: 10,
  strokeStandard: 2,
  strokeThick: 2.5,
  lineStroke: 2,
  markerSize: 10,
  borderRadius: 3,
  padding: {
    sm: 30,
    md: 50,
    lg: 100,
  },
} as const;

export const DIAGRAM_COLORS = {
  bg: '#F5F5F7',
  border: COLORS.primary,
  text: COLORS.bg,
  accent: COLORS.accent,
  warm: COLORS.warm,
} as const;
```

### Issue 3: Text Strings (UI Labels, Diagrams)

**Current**: Hardcoded text like "Step 1: Input text", "LOG 05", etc.

**Problem**: 
- Not localizable (i18n)
- Scattered across files
- Hard to audit

**Fix Required**:
```typescript
// src/constants/labels.ts (NEW FILE)
export const ARTICLE_LABELS = {
  parts: {
    1: { number: 'LOG 01', title: 'What is an LLM?' },
    2: { number: 'LOG 02', title: 'Tokenization' },
    // ... etc
  },
  sections: {
    core: 'Core Idea',
    analogy: 'Analogy',
    deepDive: 'Deep Dive',
    misconceptions: 'Common Misconceptions',
  },
} as const;

export const DIAGRAM_LABELS = {
  d1: {
    step1: 'Step 1: Input text',
    step2: 'Step 2: Model predicts',
    // ... etc
  },
} as const;
```

### Issue 4: Component Prop Types & Naming

**Current**: `type: 'D1' | 'D2' | ... 'D16'` as string literals

**Problem**: 
- String union is fragile
- No enum type safety
- No validation

**Fix Required**:
```typescript
// src/types/diagrams.ts (NEW FILE)
export enum DiagramType {
  D1 = 'D1',  // Autocomplete
  D2 = 'D2',  // Three phases
  D3 = 'D3',  // Tokenizer
  D4 = 'D4',  // Embeddings
  D5 = 'D5',  // Context window
  D9 = 'D9',  // Temperature
  D11 = 'D11', // Transformers
  D12 = 'D12', // Agent loop
  D13 = 'D13', // Harness
  D15 = 'D15', // Directory
  D16 = 'D16', // System map
}

interface DiagramProps {
  type: DiagramType;
  title?: string;
}
```

### Issue 5: Layout Constants (Measurements)

**Current**: Hard to find "what is the max-width of the article?"

**Problem**: Layout values scattered in CSS and Astro

**Fix Required**:
```typescript
// src/constants/layout.ts (NEW FILE)
export const LAYOUT = {
  maxWidth: '72ch',         // from design-system
  gapLarge: '2rem',
  gapSmall: '1rem',
  baseFontSize: '18px',
  lineHeight: 1.7,
  scrollMarginTop: '100px',  // for anchor links
  gridGap: '50px',           // for background pattern
  orbSize: '800px',          // floating orb dimensions
  blurRadius: '100px',
} as const;
```

---

## Architecture Refactoring Required

### Current Structure
```
src/
  components/
    Diagrams.astro        ← hardcoded values
    Hero.astro            ← hardcoded text
    SectionComponents.astro
    ...
  layouts/
    SignalTransmission.astro  ← hardcoded part numbers
  styles/
    design-system.css
```

### Target Structure (After Phase 3)
```
src/
  constants/              ← NEW: Single source of truth
    colors.ts
    diagrams.ts
    labels.ts
    layout.ts
    types/
      diagrams.ts
  components/             ← Import from constants
    Diagrams.astro        ← No hardcoding
    Hero.astro
    SectionComponents.astro
  layouts/
    SignalTransmission.astro  ← Use constants
  styles/
    design-system.css     ← Unchanged (good)
```

---

## SOLID Principles Application

### S (Single Responsibility)
- ✅ Diagrams.astro should ONLY render diagrams
- ❌ Currently also defines colors, sizes, labels
- **Fix**: Extract to constants files

### O (Open/Closed)
- ✅ Adding a new diagram should NOT require editing SVG hex colors
- ❌ Currently: Add D17 = add all colors inline
- **Fix**: Use imported constants

### L (Liskov Substitution)
- ✅ Any diagram component can swap colors/sizes via constants
- ❌ Currently: Values locked in
- **Fix**: Make it true

### I (Interface Segregation)
- ✅ DiagramType enum instead of string union
- ❌ Currently: Props take string union
- **Fix**: Use enum interface

### D (Dependency Inversion)
- ✅ Components depend on constants abstraction
- ❌ Currently: Components define their own values
- **Fix**: Import constants module

---

## Testing Requirements (Phase 3)

After refactoring, add tests:

```typescript
// __tests__/constants.test.ts
import { COLORS, DIAGRAM_SIZES, ARTICLE_LABELS } from '../constants';

describe('Constants', () => {
  it('should have all required colors defined', () => {
    expect(COLORS.primary).toBeDefined();
    expect(COLORS.accent).toBeDefined();
  });

  it('should have all diagram types defined', () => {
    expect(DIAGRAM_SIZES.fontMain).toBeGreaterThan(0);
  });

  it('should have all article labels in order', () => {
    expect(ARTICLE_LABELS.parts[1]).toBeDefined();
    expect(ARTICLE_LABELS.parts[8]).toBeDefined();
  });
});
```

---

## Commit Strategy

**Commit 1**: Extract constants (no behavior change)
```
refactor: extract hardcoded values to constants

- colors.ts: all hex codes from design system
- diagrams.ts: SVG font sizes, stroke widths
- labels.ts: UI text strings
- layout.ts: measurement constants
- types/diagrams.ts: DiagramType enum
```

**Commit 2**: Update components to use constants
```
refactor: update components to use imported constants

- Diagrams.astro: use COLORS, DIAGRAM_SIZES, DIAGRAM_LABELS
- Hero.astro: use COLORS
- SectionComponents.astro: use ARTICLE_LABELS
- SignalTransmission.astro: use ARTICLE_LABELS
```

**Commit 3**: Add tests
```
test: add constants validation tests

- Verify all required colors exist
- Verify all diagram types covered
- Verify article labels complete
```

---

## Validation Checklist (Before Phase 4)

- [ ] No hex color appears twice in codebase
- [ ] `grep -r "#[0-9A-F]" src/components/` returns only from constants imports
- [ ] All magic numbers (font-size, stroke-width, padding) are named constants
- [ ] All UI text strings are in constants/labels.ts
- [ ] TypeScript strict mode: `npx tsc --strict` passes
- [ ] ESLint passes: `npm run lint` passes
- [ ] All tests pass: `npm test` passes (if tests written)
- [ ] Build succeeds: `npm run build` produces dist/ with no warnings

---

## Why This Matters

**Current state**: Maintenance nightmare
- Same color value hardcoded 20 times
- If design changes, must update in 20 places
- New developers don't know what values mean
- Cannot scale to more articles/diagrams

**After Phase 3**: Professional quality
- Single source of truth
- Colors/sizes centralized
- Easy to theme (swap constants)
- Maintainable for future articles
- SOLID principles demonstrated
- Ready for production

---

## Reference

- **Standard**: `/docs/standards/solid-clean-arch.md` (Magic values section)
- **Pattern**: mockshop project (has clean constants structure)
- **Timeline**: Complete before Phase 4 Sandbox Deploy


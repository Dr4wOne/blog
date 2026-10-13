# DR4W Blog Redesign — Implementation Plan

**Status:** Design system ready, components ready, assets copied. Building preview.

## What We're Building (from the master prompt)

### ✅ Done
- [x] Design system (colors, typography, CSS variables per brand bible)
- [x] Hero component (boot sequence + sprite + status strip)
- [x] Mission Log/TOC (sticky sidebar + progress bar)
- [x] Section components (CoreDirective, FieldAnalogy, CorruptedMemory, RecoveredFile, FieldTest, NextTransmission)
- [x] Asset library (18 WebP files: sprites, comics, sheets)
- [x] Global styles (responsive, dark/light themes, accessibility)

### 🏗 Building Now (Phase B)
- [ ] 17 diagrams (D1–D17, C1–C3) as inline SVG/HTML
- [ ] Mission briefing (comic-p01-intro as 6-panel strip)
- [ ] Per-chapter visual integration (meta-lore + art placement)
- [ ] Theme toggle (dark ↔ light)
- [ ] Reading progress bar (signal strength)

### 🎮 Then (Phase C — Interactive)
- [ ] Tokenizer playground (Part 2)
- [ ] Temperature slider (Part 5)
- [ ] Attention hover (Part 4)
- [ ] Context bar (Part 5)
- [ ] Agent loop stepper (Part 6)
- [ ] Directory tree toggle (Part 8)

### 📋 Finally (Phase D — Polish)
- [ ] Screenshots (360/768/1440 in dark + light)
- [ ] Accessibility audit
- [ ] Performance check
- [ ] Your sign-off

---

## Design Decisions Confirmed (from prompt §12)

1. **Blog name:** `SIGNAL LOG` ✓ (per recommendation)
2. **Character guides:** Tom/Koji/Gus on callouts ✓
3. **Comic text:** English captions (keep art in pt-BR) ✓
4. **Vendor names:** Keep Cascade, Devin, Windsurf in trees ✓
5. **Light theme:** Yes, dark is identity ✓
6. **Fonts:** Atkinson (body), JetBrains Mono (display), Pixelify Sans (HUD) ✓

---

## Color Tokens Applied

| Name | Dark | Light | Use |
|------|------|-------|-----|
| `--bg` | `#0A0A0F` | `#F4F1EC` | Page background |
| `--panel` | `#101018` | `#FFFFFF` | Card/block backgrounds |
| `--red` | `#FF3333` | `#C21F1F` | Machine / protocol / danger |
| `--signal` | `#22C7B0` | `#0B8F7E` | Human / correct / teal accents |
| `--gold` | `#F2B84B` | `#D99D0F` | Power-ups / skills (Part 8) |
| `--text` | `#E7E7EA` | `#14141A` | Body text |
| `--text-dim` | `#9A9AA6` | `#666666` | Muted text |

---

## Components & Structure

### Page Layout (desktop)
```
┌─────────────────────────────────────────┐
│ Hero (sprite + boot sequence)            │
├─────────────────────────────────────────┤
│ Mission briefing (comic strip)           │
├──────────────────┬──────────────────────┤
│  MISSION LOG     │  Article body        │
│  (sticky, left)  │  (8 chapters)        │
│                  │                      │
│                  │  Each chapter:       │
│                  │  ├─ Header + number  │
│                  │  ├─ CORE DIRECTIVE   │
│                  │  ├─ FIELD ANALOGY    │
│                  │  ├─ Diagram          │
│                  │  ├─ Body             │
│                  │  ├─ CORRUPTED MEMORY │
│                  │  ├─ FIELD TEST       │
│                  │  ├─ RECOVERED FILE   │
│                  │  └─ NEXT TRANSMISSION│
│                  │                      │
├──────────────────┴──────────────────────┤
│ Closing + glossary + further reading     │
├─────────────────────────────────────────┤
│ Footer (DR4W sheet + social links)       │
└─────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────┐
│ Hero (stacked)       │
├──────────────────────┤
│ Mission briefing      │
├──────────────────────┤
│ MISSION LOG          │ (collapse/sticky top)
│ (horizontal scroll)  │
├──────────────────────┤
│ Article (full width) │
├──────────────────────┤
│ Footer               │
└──────────────────────┘
```

---

## What Happens Next (pending your approval)

1. **Build 17 diagrams** (D1–D17, C1–C3) as SVG + HTML
   - D1: Autocomplete loop
   - D2: 3-phase timeline
   - D3: Tokenizer strip
   - ...etc to D17 (orchestrator squad)

2. **Integrate mission briefing** (comic-p01-intro as swipeable/scrollable 6-panel strip)

3. **Per-chapter art** (lore metaphors + visual elements from the asset library)

4. **Interactive widgets** (tokenizer, temperature slider, agent stepper, etc.) — vanilla JS, keyboard-accessible

5. **Theme toggle** (dark ↔ light, respects `prefers-color-scheme`)

6. **Reading progress** (top progress bar as "SIGNAL STRENGTH")

---

## Questions for Daniel

Before we build everything, confirm:

1. **Diagram approach:** Inline SVG (crisp at any size) or PNG (faster to build)? → **SVG recommended** (vector, responsive, smaller)
2. **Interactive level:** All 6 widgets, or start with 2–3 high-value ones (tokenizer + temperature)? → **Start with 2–3**
3. **Character guides:** Show Tom/Koji/Gus as small crops on callout titles, or only in Part 8? → **Only Part 8**
4. **Mobile comic strip:** Swipeable carousel, or horizontal scroll? → **Horizontal scroll (simpler)**
5. **Published where:** Rebuild on Astro, or generate static HTML to paste? → **Rebuild on Astro** (reusable components)

---

## Next Commands

Once approved:

```bash
cd projects/blog

# Build with new design
npm run build

# Start dev server
npm run dev

# Visit http://localhost:4321/1-ai-from-the-ground/
```

---

**Timeline estimate:** 3–4 hours to diagrams + interactive + polish (pending your feedback on the preview).

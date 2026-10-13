# Blog Specification

**Project:** blog  
**Hostname (sandbox):** `blog-sbx.dr4w.io`  
**Hostname (prod):** `blog.dr4w.io`  
**Owner:** Daniel Baumann  
**Status:** Draft  
**Last Updated:** 2026-10-12

---

## Goal

Build a low-cost, low-maintenance blog for dr4w.io that:
- Publishes Markdown articles with full design control
- Matches the landing page's visual identity (dark theme, clean typography)
- Works entirely from git (version-controlled content, easy backups)
- Deploys fast and costs nothing to run
- Makes it easy to write and publish new posts

## Non-Goals

- Comments or discussion (none initially; easy to add later)
- Newsletter or email subscriptions (out of scope for MVP)
- User accounts or authentication (public read-only)
- Analytics (will use Cloudflare's free analytics if needed)
- Full-text search (static client-side search with Pagefind if useful later)
- Content management UI (posts edited as plain text in git)

## Users & User Stories

### User: Writer (Daniel)
- **Story 1:** "I want to write a post in Markdown locally, see it live, and deploy it with `git push`."
  - Given I write `content/1-post-title/index.md` with front matter
  - When I run `npm run dev`
  - Then the blog loads at `http://localhost:5173`, shows my post, and auto-rebuilds as I edit

- **Story 2:** "I want the blog to catalog posts by date, tag, and category so visitors can browse."
  - Given posts with metadata (title, date, tags, category)
  - When visitors go to `/tag/rust` or `/category/technical`
  - Then they see only posts matching that tag/category, with post count

- **Story 3:** "I want an archive page showing all posts by year."
  - Given posts from different years
  - When I go to `/archive`
  - Then posts are grouped by year, newest first, with a link to each

### User: Visitor
- **Story 4:** "I want to see the latest posts on the home page with a summary and read time."
  - Given the home page loads
  - Then I see the 5 latest posts, each with title, date, summary, author, and estimated read time
  - And there's a "View all" link to `/archive`

- **Story 5:** "I want to read a full post with good typography and dark/light themes."
  - Given I click on a post
  - When the post loads
  - Then the text is readable (18px base, 50-75 char line width), headings are clear, images scale correctly
  - And I can toggle between dark and light themes

- **Story 6:** "I want to find related posts at the end of an article."
  - Given I finish reading a post
  - When I scroll to the bottom
  - Then I see 3 related posts (same tag or category)

- **Story 7:** "I want RSS and sitemap for discoverability."
  - Given `/rss.xml` and `/sitemap.xml`
  - When I subscribe or index
  - Then all published posts are included with title, date, summary, and publication URL

---

## Content Model

### Front Matter (YAML metadata in each post)

```yaml
---
title: "Getting Started with Rust"
date: 2026-10-15
author: "Daniel Baumann"
summary: "Why I switched to Rust and what I learned in the first week."
tags: ["rust", "learning", "systems-programming"]
category: "technical"  # Options: technical, personal, project, announcement
language: "en"         # Options: en, pt-BR (extensible)
series: "Rust Journey"  # Optional: groups posts into a series
draft: false           # true = hidden from production and archive
readingTime: 8         # Auto-calculated; shown to readers
---
```

### Post Folder Structure

```
content/
  1-getting-started-rust/
    index.md              # Post content with front matter
    images/
      banner.png          # 1200x600px hero image (optional)
      diagram.svg         # Embedded diagram
  2-second-post/
    index.md
    images/
  _template.md            # Template for new posts
```

### Image Guidelines

- **Formats:** Use `.webp` for compression; provide `.png` fallback for older browsers
- **Size:** Keep total post < 2 MB; individual images < 500 KB
- **Naming:** Use descriptive names: `banner.webp`, `screenshot-1.webp`, not `img1.png`
- **Alt text:** Always include descriptive alt text for accessibility
- **Responsive:** Use `max-width: 100%` in CSS; lazy-load below the fold

### Metadata Fields Explained

| Field | Purpose | Example |
|-------|---------|---------|
| `title` | Post heading | "Getting Started with Rust" |
| `date` | Publication date (sorts archive) | 2026-10-15 |
| `author` | Byline (usually Daniel) | "Daniel Baumann" |
| `summary` | 1-2 sentences for preview, RSS, OpenGraph | "Why I switched to Rust..." |
| `tags` | Searchable labels (lowercase, hyphenated) | ["rust", "learning"] |
| `category` | Broad grouping for filtering | "technical" |
| `language` | For multi-language support later | "en" or "pt-BR" |
| `series` | Groups related posts (optional) | "Rust Journey" |
| `draft` | If true, hidden from production | false |
| `readingTime` | Estimated minutes to read (auto or manual) | 8 |

---

## Page List & Routes

| Route | Content | Purpose |
|-------|---------|---------|
| `/` | Home page | Latest 5 posts with summary, "View all" link |
| `/post-slug` | Full post | Single post with nav, related posts, reading time |
| `/archive` | Post listing | All posts by year, newest first, with counts |
| `/tag/rust` | Tag page | Posts tagged with "rust" + tag count |
| `/category/technical` | Category page | Posts in a category + count |
| `/series/rust-journey` | Series page | Posts in a series, in order |
| `/rss.xml` | RSS feed | All published posts for syndication |
| `/sitemap.xml` | Sitemap | All public pages for SEO |
| `/about` | Static page | About the author & blog (future) |
| `/404` | Not found | Friendly 404 with home/archive links |

---

## Design & Visual Identity

### Design Tokens (from landing page)

```css
/* Colors */
--bg-dark: #0A0A0F        /* Page background */
--bg-light: #FFFFFF       /* Light theme background */
--fg-primary: #FFFFFF     /* Text on dark background */
--fg-secondary: #A0A0A0   /* Muted text (metadata, captions) */
--accent: #0066FF         /* Links, highlights (brand color) */
--border: #2A2A3F         /* Subtle dividers */

/* Typography */
--font-serif: "Georgia", serif     /* Post body, headings (or system serif) */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
--font-mono: "Monaco", "Menlo", monospace

/* Spacing */
--space-1: 4px
--space-2: 8px
--space-4: 16px
--space-8: 32px
--space-12: 48px
```

### Layout Rules

1. **Line length:** 50–75 characters for post text (measure around 600–750px)
2. **Base font size:** 18px minimum on mobile, 20px on desktop
3. **Line height:** 1.6–1.8 for readability
4. **Contrast:** All text ≥ 4.5:1 against background (WCAG AA)
5. **Headings:** Use a clear hierarchy (h1, h2, h3); distinct sizes and weights
6. **Code blocks:** Monospace font, slight background, horizontal scroll for long lines, syntax highlighting
7. **Images:** Responsive, centered, with captions below
8. **Tables:** Readable, with striped rows and clear headers
9. **Responsive:** Mobile-first; breakpoints at 640px (tablet) and 1024px (desktop)

### Dark & Light Themes

- **Dark (default):** #0A0A0F background, #FFFFFF text, #0066FF accents
- **Light (optional):** #FFFFFF background, #1A1A1F text, #0055DD accents
- User preference: Detect `prefers-color-scheme` CSS media query; allow manual toggle with a button

---

## Performance Budget

| Metric | Target | Notes |
|--------|--------|-------|
| **Page load (3G)** | < 3 seconds | Lighthouse field data |
| **HTML + CSS size** | < 50 KB | Gzipped |
| **Images** | < 500 KB per post | Optimized format |
| **Lighthouse score** | ≥ 95 | Performance, Accessibility, SEO, Best Practices |
| **Core Web Vitals** | Green | LCP < 2.5s, CLS < 0.1, FID/INP < 200ms |
| **Mobile (360px)** | Full functionality | No layout breaks |

---

## Technical Stack & Architecture

### Static Site Generator: Astro

**Why Astro?**
- Built for blogs (great defaults for posts, archives, metadata)
- Generates static HTML (no server, no database)
- TypeScript support (familiar to React devs)
- Easy Tailwind CSS integration (reuse landing page tokens)
- Fast builds and previews

**Build process:**
```
Write Markdown → Git push → GitHub Actions runs `npm run build` →
Astro reads posts, generates HTML/RSS/sitemap → Deploy to Cloudflare → Live
```

### Deployment: Cloudflare Workers / Pages

- **Why:** Free tier, unlimited bandwidth, global CDN, integrated DNS
- **Setup:** `wrangler.toml` for config; auto-deploy on `main` merge
- **Cost:** $0/month
- **Domains:** Custom domain via Cloudflare DNS (already set up)

### Repository Structure

```
blog/
  src/
    content/
      1-getting-started-rust/
        index.md
        images/
          banner.webp
      2-second-post/
        index.md
    layouts/
      BaseLayout.astro        # Shared wrapper for all pages
      PostLayout.astro        # Template for single post
    components/
      Header.astro
      Footer.astro
      PostCard.astro          # Preview card (used on home, archive)
      RelatedPosts.astro
      TagCloud.astro
    pages/
      index.astro             # Home page
      archive.astro           # All posts listing
      tag/[tag].astro         # Tag pages (dynamic)
      category/[category].astro  # Category pages (dynamic)
      series/[series].astro   # Series pages (dynamic)
      rss.xml.ts              # RSS feed generation
      sitemap.xml.ts          # Sitemap generation
      404.astro               # Not found page
    styles/
      global.css              # Shared styles, theme tokens
    utils/
      posts.ts                # Post loading, sorting, filtering
      formatting.ts           # Date, reading time, etc.
  public/
    robots.txt
  astro.config.mjs
  tailwind.config.ts          # Reuse landing page config
  package.json
  tsconfig.json
  CONTRIBUTING.md             # Guide for writing posts
  README.md                   # Project overview
```

### Build & Test Steps

```bash
# Development
npm run dev              # Start local server at http://localhost:5173

# Linting & type checking
npm run lint            # TypeScript, ESLint
npm run type-check      # TypeScript strict mode

# Build
npm run build           # Generate static HTML to dist/

# Testing & validation (run before commit & in CI)
npm run check-links     # Find broken links
npm run check-html      # HTML validation (W3C)
npm run check-images    # Image size, format warnings
npm run lighthouse      # Performance score on local build
npm run test            # Unit tests (if any custom logic)

# Deploy
npm run deploy          # Deploy to Cloudflare (via CI on main)
```

---

## Security & Privacy

### Security Headers

Every response includes:
```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net
x-content-type-options: nosniff
x-frame-options: DENY
referrer-policy: no-referrer
permissions-policy: geolocation=(), microphone=(), camera=()
```

### Privacy

- **No third-party analytics by default** (Cloudflare's free analytics are on-server, not user-tracking)
- **No cookies** (static site, no auth needed)
- **No personal data** (public blog posts only)
- **No ads or trackers** (clean, focused content)

If analytics needed later: Cloudflare Web Analytics (free, privacy-friendly) or Plausible (paid, GDPR-compliant).

---

## SEO & Discoverability

- **Meta tags:** Each page has `<title>`, `<meta name="description">`, and `<meta name="canonical">`
- **OpenGraph:** Each post has `og:title`, `og:description`, `og:image` (hero image)
- **Structured data:** Optional JSON-LD for `BlogPosting` (helps Google understand posts)
- **Sitemap:** Auto-generated at `/sitemap.xml`
- **RSS:** Auto-generated at `/rss.xml` for feed readers
- **robots.txt:** Allow all crawlers

---

## Acceptance Criteria

### Story 1: Write & Preview
- [ ] Post written in `content/N-title/index.md` with valid front matter
- [ ] `npm run dev` shows the post at `http://localhost:5173/N-title`
- [ ] Edits auto-rebuild (no manual refresh needed)
- [ ] `npm run type-check` passes with no TS errors

### Story 2: Tag & Category Pages
- [ ] `/tag/rust` shows only posts with tag "rust", with count: "3 posts"
- [ ] `/category/technical` shows category posts, sorted by date (newest first)
- [ ] Tag/category pages have their own `<title>` and meta description

### Story 3: Archive by Year
- [ ] `/archive` shows all posts grouped by year (2026, 2025, etc.)
- [ ] Each year is a collapsible section (or always visible)
- [ ] Posts within a year are sorted by date (newest first)

### Story 4: Home Page
- [ ] Home shows latest 5 posts with title, date, author, summary, read time
- [ ] Each post is a clickable card with preview
- [ ] "View all" link goes to `/archive`
- [ ] Page loads in < 2 seconds on a 3G connection

### Story 5: Full Post & Themes
- [ ] Post loads with readable typography (18px base, 50–75 char lines)
- [ ] Dark theme is default; light theme is optional toggle
- [ ] Images are responsive and centered
- [ ] Code blocks have syntax highlighting and scroll horizontally
- [ ] Mobile view (360px) has no layout breaks

### Story 6: Related Posts
- [ ] Bottom of post shows 3 related posts (same tag or category)
- [ ] Each related post shows title, date, and summary
- [ ] If fewer than 3, show whatever matches

### Story 7: RSS & Sitemap
- [ ] `/rss.xml` is valid and includes all published posts
- [ ] `/sitemap.xml` includes home, archive, all posts, tag pages, category pages
- [ ] Feed readers (e.g., Feedly) can subscribe to `/rss.xml`

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| **Broken links in posts** | Medium | Visitors hit 404s | `npm run check-links` in CI; fails build if broken |
| **Images too large** | High | Slow load, poor Lighthouse | `npm run check-images` enforces < 500 KB; CI fails otherwise |
| **Poor mobile layout** | Medium | Visitors on phone see mess | Test at 360px in dev; Lighthouse audit in CI |
| **Accessibility issues** | Medium | Non-sighted users blocked | `npm run check-html` runs axe; manual review before publish |
| **Outdated dependencies** | Low | Security vulnerabilities | Annual review; use `npm audit`; pin major versions in `package.json` |
| **Cloudflare outage** | Very low | Blog unreachable | No mitigation (3rd-party service); DNS fallback not practical |

---

## Rollback Plan

If something breaks on prod:

1. **Quick fix:** If the code has a typo, fix it, commit, push (auto-deploys in ~1 minute).
2. **Rollback to previous version:**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
   Cloudflare auto-deploys the previous version.

3. **Cloudflare rollback (if Worker deployment fails):**
   ```bash
   # Via Cloudflare dashboard > Deployments > Rollback
   # Or CLI: wrangler deploy --name blog (re-deploys current main)
   ```

---

## Maintenance (Once a Year)

- [ ] Run `npm update` and test all pages
- [ ] Run `npm audit` and fix security issues
- [ ] Run `npm run check-links` across the entire blog
- [ ] Review and fix any accessibility issues from axe audit
- [ ] Optimize images (recompress old posts, check formats)
- [ ] Update Astro and other major dependencies (test thoroughly)

---

## Success Criteria

- [x] Research ADR written and decisions documented
- [ ] SPEC approved by Daniel
- [ ] Build plan created with task list
- [ ] Blog skeleton built and deployed to sandbox
- [ ] First article published and live at `blog-sbx.dr4w.io`
- [ ] Landing page updated with blog link
- [ ] Prod deploy approved and live at `blog.dr4w.io`
- [ ] Tutorials written for future posts and new pages

---

**Document version:** 1.0  
**Last updated:** 2026-10-12

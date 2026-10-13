# Blog Implementation Plan

**Project:** blog  
**Stack:** Astro + TypeScript + Tailwind CSS + Cloudflare Workers/Pages  
**Timeline:** Phase 2 (POC + Rewrite in one cycle due to static site simplicity)  
**Owner:** Agent  
**Date:** 2026-10-12

---

## Architecture & Folder Layout

### Source Repository Structure

```
blog/
├── src/
│   ├── content/
│   │   ├── 1-first-article/
│   │   │   ├── index.md
│   │   │   └── images/
│   │   ├── 2-second-article/
│   │   │   ├── index.md
│   │   │   └── images/
│   │   └── _template.md           # Template for new posts
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Wrapper for all pages
│   │   └── PostLayout.astro       # Wrapper for single posts
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro         # Preview card for listings
│   │   ├── RelatedPosts.astro
│   │   └── Navigation.astro
│   ├── pages/
│   │   ├── index.astro            # Home page (latest 5 posts)
│   │   ├── archive.astro          # All posts by year
│   │   ├── tag/[tag].astro        # Dynamic tag pages
│   │   ├── category/[category].astro
│   │   ├── series/[series].astro
│   │   ├── rss.xml.ts             # RSS feed generation
│   │   ├── sitemap.xml.ts         # Sitemap generation
│   │   └── 404.astro              # Not found page
│   ├── styles/
│   │   └── global.css             # Design tokens, theme, defaults
│   └── utils/
│       ├── posts.ts               # Post loading, sorting, filtering
│       ├── formatting.ts          # Date formatting, reading time
│       └── constants.ts           # Categories, site config
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, build, test, checks
│       └── deploy.yml             # Deploy to sandbox/prod
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
├── CONTRIBUTING.md                # Guide for writing posts
├── README.md                       # Project setup & deploy
├── docs/
│   ├── SPEC.md                    # What we're building
│   ├── PLAN.md                    # This file
│   └── PROJECT_STATE.md           # Status after each phase
└── reports/
    └── (screenshots, test reports, evidence)
```

### Deployment & Hosting

- **Sandbox:** `blog-sbx.dr4w.io` (Cloudflare Pages or Workers)
- **Production:** `blog.dr4w.io` (Cloudflare Pages or Workers)
- **Source:** GitHub repo `Dr4wOne/blog` (private until ready)
- **CI/CD:** GitHub Actions with OIDC for Cloudflare auth

---

## Test Strategy

### Local Development Tests (run before commit)

1. **TypeScript type check**
   ```bash
   npm run type-check  # Zero TypeScript errors required
   ```

2. **Linting**
   ```bash
   npm run lint        # ESLint + Prettier formatting
   ```

3. **Build success**
   ```bash
   npm run build       # Generates dist/ without errors
   ```

4. **Link validation**
   ```bash
   npm run check-links # Finds broken internal/external links
   ```

5. **HTML validation**
   ```bash
   npm run check-html  # W3C HTML validation
   ```

6. **Image optimization check**
   ```bash
   npm run check-images # Warns on images > 500 KB, suboptimal format
   ```

7. **Lighthouse performance**
   ```bash
   npm run lighthouse  # Scores on perf, accessibility, SEO, best practices
   # Target: ≥ 95 all categories
   ```

### CI/CD Tests (automated on every push)

Same as above, run in GitHub Actions. Build fails if:
- TypeScript errors
- Lint errors
- Links broken
- HTML invalid
- Any Lighthouse category < 90 (warning, not fail)
- Images exceed size limits

### Acceptance Testing

Manual verification after deploy to sandbox:
- [ ] Home page loads, shows latest 5 posts
- [ ] Post pages render correctly with typography, images, code blocks
- [ ] `/tag/*` pages filter correctly
- [ ] `/archive` groups posts by year
- [ ] `/rss.xml` is valid XML and subscribable in a reader
- [ ] `/sitemap.xml` includes all routes
- [ ] Dark & light themes toggle correctly
- [ ] Mobile (360px) has no layout breaks
- [ ] All responses have security headers (CSP, X-Frame-Options, etc.)

### Content Integrity

A JSON schema check (or simple validation script) verifies all posts:
- [ ] Required front matter fields present (title, date, summary, tags, category)
- [ ] Date is valid YYYY-MM-DD
- [ ] Category is one of the allowed list
- [ ] Tags are lowercase, hyphenated
- [ ] No draft posts in production builds
- Fails build if invalid

---

## CI/CD Pipeline

### Trigger: Pull Request (branch commits)

**Workflow: `ci.yml`**
```
1. Checkout code
2. Node.js 20 setup
3. npm ci (clean install)
4. npm run type-check
5. npm run lint
6. npm run build
7. npm run check-links
8. npm run check-html
9. npm run check-images
10. npm run lighthouse (store report in artifact)
11. Upload build artifact (for manual testing if needed)
12. Report result (pass = green, fail = red)
```

**On PR success:** Green checkmark. Ready to merge.

### Trigger: Merge to `main` (sandbox deploy)

**Workflow: `deploy.yml` (sandbox target)**
```
1. Wait for ci.yml to pass
2. Checkout main
3. Node.js 20 setup
4. npm ci
5. npm run build
6. Authenticate to Cloudflare (OIDC: gha-sandbox role)
7. Deploy dist/ to Cloudflare Pages (or wrangler deploy)
8. Verify 200 response from blog-sbx.dr4w.io
9. Store deploy URL in summary
10. On failure: Roll back to previous deployment, notify
```

**Output:** Deployment URL in the run summary (e.g., "Deployed to blog-sbx.dr4w.io")

### Trigger: Manual Dispatch + Approval (prod deploy)

**Workflow: `deploy.yml` (prod target)**
```
1. Manual trigger from Actions UI (or via gh cli)
2. Check environment: prod
3. Require approval from GitHub (branch protection rule: approvals)
4. Checkout main
5. Build & deploy to Cloudflare (production)
6. Verify 200 response from blog.dr4w.io
7. Verify /rss.xml and /sitemap.xml are valid
8. Store deploy URL in summary
```

**Output:** Prod deployment confirmed or rolled back

---

## Build & Deployment Commands

### Local Development

```bash
# Install dependencies
npm ci                    # Clean install (use in CI; locally npm install is fine)

# Start dev server (with hot reload)
npm run dev              # Opens http://localhost:5173 in browser

# Build for production
npm run build            # Generates dist/

# Type check
npm run type-check       # TypeScript strict

# Lint
npm run lint             # ESLint + Prettier check
npm run lint:fix         # Auto-fix linting issues

# Link validation
npm run check-links      # Find broken links
```

### Pre-Commit Checks

```bash
# Run all checks before pushing
npm run check-all        # Shorthand: lint + type-check + build + check-links + check-html
```

### CI/CD Deployment

```bash
# GitHub Actions handles these; here for reference:

# Build artifact
npm run build

# Deploy to Cloudflare Pages (via wrangler.toml or Pages integration)
# If using wrangler:
npx wrangler deploy --name blog --env sandbox|production

# If using Cloudflare Pages (automatic):
# - Just push to main → Pages auto-detects, builds, deploys
```

### Manual Smoke Tests (post-deploy)

```bash
# Verify sandbox
curl -I https://blog-sbx.dr4w.io/
curl -I https://blog-sbx.dr4w.io/rss.xml
curl -I https://blog-sbx.dr4w.io/sitemap.xml
curl -s https://blog-sbx.dr4w.io/api/health | jq .  # If health endpoint exists

# Verify prod (after approval)
curl -I https://blog.dr4w.io/
curl -I https://blog.dr4w.io/rss.xml
```

---

## Ordered Task List

### Phase 1: Repository & Template Setup

**Task 1.1:** Create `templates/static-site` starter template (Astro skeleton)
- Create folder: `templates/static-site/`
- Copy Astro starter files (tsconfig.json, astro.config.mjs, package.json, README.md)
- Add to `scripts/new-project.sh` so future static sites use `scripts/new-project.sh static-site <name>`
- **Linked to:** N/A (infrastructure)
- **Est. effort:** 1 hour

**Task 1.2:** Clone landing page repo to `projects/dr4w-landpage` (for reference during blog build)
```bash
gh repo clone Dr4wOne/dr4w-landpage projects/dr4w-landpage
```
- **Linked to:** N/A (reference)
- **Est. effort:** 10 min

**Task 1.3:** Extract design tokens from landing page (colors, fonts, spacing)
- Read landing page Tailwind config and CSS
- Create a `src/styles/tokens.css` with extracted values
- Document in `DESIGN_TOKENS.md`
- **Linked to:** All stories (common design system)
- **Est. effort:** 1 hour

### Phase 2: Blog Skeleton & Build System

**Task 2.1:** Initialize blog project: `scripts/new-project.sh static-site blog`
- Creates folder structure from template
- Initializes git repo
- Installs dependencies
- **Linked to:** Stories 1–7 (foundation)
- **Est. effort:** 30 min

**Task 2.2:** Configure Astro for blog
- Set up `astro.config.mjs` with collection loader for `src/content/`
- Configure output format (static HTML to `dist/`)
- Add Tailwind CSS integration
- Add TypeScript strict mode
- **Linked to:** Stories 1–7
- **Est. effort:** 1 hour

**Task 2.3:** Create base layouts
- `src/layouts/BaseLayout.astro` — shared header, footer, nav
- `src/layouts/PostLayout.astro` — post wrapper with reading time, metadata
- Include dark/light theme toggle
- **Linked to:** Story 5 (themes)
- **Est. effort:** 2 hours

**Task 2.4:** Create reusable components
- `Header.astro` — site header with nav links
- `Footer.astro` — footer with copyright, links
- `PostCard.astro` — preview card (title, date, summary, read time)
- `RelatedPosts.astro` — list 3 related posts
- `Navigation.astro` — breadcrumb or main nav
- **Linked to:** Stories 2, 4, 6
- **Est. effort:** 2 hours

**Task 2.5:** Create page templates
- `src/pages/index.astro` — home page (latest 5 posts, view all link) [Story 4]
- `src/pages/archive.astro` — all posts grouped by year [Story 3]
- `src/pages/tag/[tag].astro` — dynamic tag pages [Story 2]
- `src/pages/category/[category].astro` — dynamic category pages [Story 2]
- `src/pages/series/[series].astro` — dynamic series pages [Story 2]
- `src/pages/404.astro` — not found page
- **Linked to:** Stories 2, 3, 4
- **Est. effort:** 3 hours

**Task 2.6:** Create feed & sitemap generators
- `src/pages/rss.xml.ts` — RSS feed (all posts, title, date, summary, URL)
- `src/pages/sitemap.xml.ts` — XML sitemap (all routes)
- Verify output format is valid
- **Linked to:** Story 7
- **Est. effort:** 1.5 hours

### Phase 3: Utilities & Post System

**Task 3.1:** Create post utility functions
- `src/utils/posts.ts` — load posts from `src/content/`, parse front matter, sort, filter by tag/category/year
- Functions: `getAllPosts()`, `getPostsByTag()`, `getPostsByCategory()`, `getPostsBySeries()`, `getRelatedPosts(post)`
- **Linked to:** Stories 1, 2, 3, 4
- **Est. effort:** 1.5 hours

**Task 3.2:** Create formatting utilities
- `src/utils/formatting.ts` — format dates (2026-10-15 → Oct 15, 2026), calculate reading time (words / 200)
- Helper functions: `formatDate(date)`, `calculateReadingTime(content)`
- **Linked to:** Story 4, 5 (metadata display)
- **Est. effort:** 30 min

**Task 3.3:** Create site constants
- `src/utils/constants.ts` — allowed categories, site config (title, author, url, favicon)
- Used by validation and generators
- **Linked to:** All stories
- **Est. effort:** 30 min

### Phase 4: Content & Testing

**Task 4.1:** Create post template & contributing guide
- `src/content/_template.md` — blank post with YAML front matter skeleton
- `CONTRIBUTING.md` — step-by-step guide: create folder, copy template, edit, add images, commit
- **Linked to:** Story 1 (write)
- **Est. effort:** 1 hour

**Task 4.2:** Create placeholder posts (2 posts for testing)
- `src/content/1-welcome/index.md` — intro post (summary, tags, category)
- `src/content/2-how-to-write/index.md` — meta post about writing (with sample code block)
- Include images (placeholder or simple SVG)
- **Linked to:** Stories 1, 4, 5
- **Est. effort:** 1 hour

**Task 4.3:** Create build & test scripts
- Add to `package.json`:
  - `npm run type-check` — TypeScript
  - `npm run lint` — ESLint + Prettier
  - `npm run check-links` — broken link detection
  - `npm run check-html` — HTML validation
  - `npm run check-images` — image size/format warnings
  - `npm run lighthouse` — performance audit
  - `npm run check-all` — run all checks
- **Linked to:** All stories (quality gate)
- **Est. effort:** 2 hours

**Task 4.4:** Create GitHub Actions workflows
- `.github/workflows/ci.yml` — on PR: lint, type-check, build, checks
- `.github/workflows/deploy.yml` — on main: deploy to sandbox; manual dispatch: deploy to prod
- Store artifacts (lighthouse reports, build logs)
- **Linked to:** All stories (automation)
- **Est. effort:** 2 hours

### Phase 5: Styling & Accessibility

**Task 5.1:** Apply design tokens & responsive layout
- Import design tokens in `src/styles/global.css`
- Set up Tailwind config to use tokens (colors, spacing)
- Define responsive breakpoints (mobile 640px, tablet 1024px)
- Base font: 18px, line height 1.6, line width 50–75 chars
- **Linked to:** Story 5 (readable typography)
- **Est. effort:** 2 hours

**Task 5.2:** Style components & pages
- Header, footer, nav
- Post card (on home, archive)
- Post page (title, date, author, content, metadata)
- Archive (year grouping, styling)
- Tag/category pages
- 404 page
- **Linked to:** Story 5 (themes)
- **Est. effort:** 3 hours

**Task 5.3:** Implement dark/light theme toggle
- CSS `prefers-color-scheme` media query for system preference
- JavaScript button to override (localStorage)
- Test both themes on all pages
- **Linked to:** Story 5
- **Est. effort:** 1 hour

**Task 5.4:** Accessibility audit & fixes
- Run axe audit on key pages (home, post, archive, tag)
- Fix contrast, ARIA labels, keyboard nav
- Ensure all images have alt text
- Test with screen reader if possible
- **Linked to:** Story 5
- **Est. effort:** 1.5 hours

### Phase 6: Validation & Smoke Tests

**Task 6.1:** Run full check suite
- `npm run type-check` — pass
- `npm run lint` — pass
- `npm run build` — success
- `npm run check-links` — pass (0 broken links)
- `npm run check-html` — pass
- `npm run check-images` — pass (warnings only)
- `npm run lighthouse` — ≥ 95 all categories (warning if < 90)
- **Linked to:** All stories (quality gate)
- **Est. effort:** 30 min (iterative fixes included above)

**Task 6.2:** Manual acceptance testing (local)
- [ ] Home page shows 2 placeholder posts (latest 5 when more posts exist)
- [ ] Click post → full post page loads with correct title, date, content
- [ ] `/archive` shows posts grouped by year
- [ ] `/tag/sample` filters to posts with "sample" tag
- [ ] `/category/technical` filters to "technical" category posts
- [ ] Related posts at bottom of post
- [ ] Dark & light theme toggle works
- [ ] Mobile (360px) view has no breaks
- [ ] `/rss.xml` is valid (check with feed validator)
- [ ] `/sitemap.xml` is valid (check with sitemap validator)
- [ ] Security headers present (check with curl -I)
- **Linked to:** Stories 1–7
- **Est. effort:** 1 hour

**Task 6.3:** Generate test reports
- Screenshot home, post, archive, tag page (desktop + 360px)
- Record Lighthouse score
- Record accessibility audit results
- Store in `reports/`
- **Linked to:** All stories (evidence)
- **Est. effort:** 30 min

### Phase 7: Sandbox Deploy & Verification

**Task 7.1:** Prepare for publication
```bash
gh repo create blog --organization Dr4wOne --private --source=. --remote=origin
```
- Creates GitHub repo
- Pushes local commits
- **Linked to:** All stories (automation)
- **Est. effort:** 30 min

**Task 7.2:** Sandbox deployment via CI
- Create PR with all code
- Watch `ci.yml` pass all checks
- Merge to `main`
- Watch `deploy.yml` deploy to `blog-sbx.dr4w.io`
- **Linked to:** All stories
- **Est. effort:** 1 hour (mostly waiting)

**Task 7.3:** Verify sandbox deployment
```bash
curl -I https://blog-sbx.dr4w.io/
curl -I https://blog-sbx.dr4w.io/rss.xml
curl -s https://blog-sbx.dr4w.io/ | grep "<title>"
```
- [ ] Home page returns 200, correct title
- [ ] RSS feed returns 200, valid XML
- [ ] Sitemap returns 200, valid XML
- [ ] All responses have security headers
- [ ] Mobile view (360px) loads correctly
- [ ] Dark & light theme toggle works
- Record screenshots & response headers
- **Linked to:** Stories 1–7
- **Est. effort:** 30 min

---

## Cost Estimate

| Resource | Sandbox Cost | Production Cost | Notes |
|----------|--------------|-----------------|-------|
| **Domain** | $0 | $0 | Included in dr4w.io |
| **Cloudflare Pages** | $0/month | $0/month | Free tier: unlimited requests, unlimited bandwidth |
| **GitHub Actions** | $0/month | $0/month | Free tier: 2000 min/month (well above our usage) |
| **Storage (git)** | $0/month | $0/month | GitHub free account |
| **CDN/Bandwidth** | $0/month | $0/month | Cloudflare free tier covers it |
| **Total** | **$0** | **$0** | Zero additional cost beyond existing services |

**Assumptions:**
- Blog traffic < 100,000 requests/month (Cloudflare free tier limit)
- Static site only (no database, no Lambda)
- No third-party services (no Stripe, no SendGrid, no analytics beyond Cloudflare)

---

## Technical Decisions

1. **URL structure:** `blog.dr4w.io` (separate project, not `/blog` path) ✓
2. **Static generator:** Astro (TypeScript, Tailwind integration, blog-friendly) ✓
3. **Post numbering:** Sequential (1, 2, 3...) for sorting and easy reference ✓
4. **Deployment:** Cloudflare Pages (auto-deploy on main, lowest friction) ✓
5. **Categories:** technical, personal, project, announcement ✓
6. **Home page:** Latest 5 posts ✓

---

## Timeline

Assuming 2–3 hours of focused work per task:

| Phase | Tasks | Est. Hours | Cumulative |
|-------|-------|-----------|-----------|
| **Setup & Templates** | 1.1–1.3 | 2.5 | 2.5 |
| **Skeleton** | 2.1–2.6 | 10 | 12.5 |
| **Utilities** | 3.1–3.3 | 2.5 | 15 |
| **Content & Testing** | 4.1–4.4 | 5 | 20 |
| **Styling** | 5.1–5.4 | 7.5 | 27.5 |
| **Validation & Sandbox** | 6.1–7.3 | 3.5 | 31 |
| **Contingency (issues, fixes)** | — | 4 | 35 |
| **Total** | — | **~35 hours** | — |

Deliverable broken down:
- First 4 hours: Template + skeleton (Task 1–2.1)
- Next 16 hours: Core features (Task 2.2–4.4)
- Final 15 hours: Styling + testing + deploy (Task 5–7)

---

## Success Criteria

- [x] SPEC approved by Daniel
- [ ] All TypeScript errors zero
- [ ] All linting passes
- [ ] Build succeeds
- [ ] No broken links
- [ ] HTML validates
- [ ] Lighthouse ≥ 95 all categories
- [ ] All 7 user stories have acceptance tests (manual or automated)
- [ ] Accessibility audit passes (no critical issues)
- [ ] Sandbox deploy succeeds
- [ ] All pages respond with 200 and security headers
- [ ] RSS & sitemap are valid
- [ ] Mobile (360px) has no layout breaks
- [ ] Ready for first article upload

---

## Next Steps (Post-Plan)

1. ✅ **PLAN approved** — This document
2. 📝 **POC / Build phase** — Tasks 1.1 through 7.3 (execute in order)
3. 📄 **Article intake** — Ask Daniel for first post (Markdown + images)
4. 🚀 **Publish sandbox** — Push to `main`, watch CI/CD
5. 🎯 **Prod gate** — Create PR with approval evidence
6. 📊 **Report** — Document what was built, decisions, URLs, costs

---

**Plan version:** 1.0  
**Date:** 2026-10-12  
**Ready to build:** Yes

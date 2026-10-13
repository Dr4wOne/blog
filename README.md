# dr4w Blog

A fast, static blog on Astro + Cloudflare.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev          # http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## Structure

- `src/content/blog/` — Blog posts in Markdown
- `src/pages/` — Home, archive, dynamic post pages
- `src/layouts/` — Page templates
- `dist/` — Built static HTML (production)

## First Article

**"AI From the Ground Up"** is live at `/1-ai-from-the-ground/`. Topics:
- What is an LLM?
- Tokenization
- Embeddings & vectors
- Transformers & attention
- Inference, context, prompting
- Agents
- Harnesses
- Tooling

## Adding New Posts

1. Create folder: `src/content/blog/N-post-title/`
2. Copy `_template.md` or create `index.md`
3. Add YAML front matter (title, date, author, tags, etc.)
4. Write Markdown
5. Run `npm run dev` to preview
6. Push to git; CI auto-deploys

## Status

✅ Build: Working
✅ Home page: Generated
✅ Archive page: Generated
✅ First article: Live at `/1-ai-from-the-ground/`
⏳ Design: Dark theme active (light theme coming soon)
⏳ Images: Not yet added to article
⏳ Deployment: Ready for sandbox


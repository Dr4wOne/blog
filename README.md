# blog — dr4w.io

A personal blog built with Astro, React, and Tailwind CSS.

## Getting started

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for production

```bash
npm run build
npm run preview
```

### Run tests

```bash
npm test
```

## Stack

- **Astro 5.0** — Static site generator
- **React 18** — UI components
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Vitest** — Fast unit testing

## Project structure

```
src/
  components/     React components
  layouts/        Astro layouts
  pages/          Astro pages (routes)
  styles/         Global CSS
  content/        Blog posts (Markdown)
  utils/          Utilities and helpers
  data/           Constants and configuration
public/           Static assets
dist/             Build output (generated)
```

## Deployment

Deployed to Cloudflare Workers.

```bash
npm run deploy
```

// pnpm post:new <slug> "<title>"     — create a draft at src/content/posts/<slug>/index.mdx
// pnpm post:publish <slug> [date]    — give a draft the next issue number (see publish-prepare.ts)
// pnpm post:touch <slug> [date]      — mark a published post as updated today
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { prepare, setFrontmatter } from './publish-prepare.ts'

const today = () => new Date().toISOString().slice(0, 10)
const path = (slug: string) => `src/content/posts/${slug}/index.mdx`

export function draftTemplate(slug: string, title: string): string {
  return `---
slug: ${slug}
title: ${JSON.stringify(title)}
summary: "One sentence about what the reader gets: about 25 words, at least 40 characters."
tags: []
draft: true
---

import Aside from '../../../components/Aside.astro'

Start with the point: what this post shows and why it matters.

## First section

Write here. A claim that needs a source gets a footnote.[^source]

<Aside title="Deep dive: optional detail">

Something a reader can skip.

</Aside>

**In one line:** the section's takeaway.

[^source]: Author, "Title", year. https://example.org
`
}

if (import.meta.main) {
  const [cmd, slug, arg] = process.argv.slice(2)
  if (!cmd || !slug)
    throw new Error(
      'usage: pnpm post:new <slug> "<title>" | post:publish <slug> [date] | post:touch <slug> [date]',
    )
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    throw new Error(`slug "${slug}" must be lowercase words joined by "-"`)
  const file = path(slug)
  if (cmd === 'new') {
    if (existsSync(file)) throw new Error(`${file} already exists`)
    const registry = JSON.parse(readFileSync('issues.json', 'utf8')).issues as { slug: string }[]
    if (registry.some((e) => e.slug === slug))
      throw new Error(`"${slug}" is already a published issue`)
    mkdirSync(`src/content/posts/${slug}`, { recursive: true })
    writeFileSync(file, draftTemplate(slug, arg ?? slug.replace(/-/g, ' ')))
    console.log(`draft created: ${file}\npreview: pnpm dev → http://localhost:4321/drafts/${slug}/`)
  } else if (cmd === 'publish') {
    const reg = JSON.parse(readFileSync('issues.json', 'utf8'))
    const out = prepare(slug, reg.issues, readFileSync(file, 'utf8'), arg ?? today())
    writeFileSync('issues.json', `${JSON.stringify({ ...reg, issues: out.registry }, null, 2)}\n`)
    writeFileSync(file, out.post)
    console.log(
      `issue ${out.issue}: https://blog.dr4w.io/${String(out.issue).padStart(2, '0')}-${slug}/\nnext: pnpm check && pnpm judges, then open a PR`,
    )
  } else if (cmd === 'touch') {
    const src = readFileSync(file, 'utf8')
    if (!/^issue:/m.test(src)) throw new Error(`"${slug}" is a draft; drafts have no update date`)
    writeFileSync(file, setFrontmatter(src, { updated: arg ?? today() }))
    console.log(`${slug}: updated ${arg ?? today()}`)
  } else throw new Error(`unknown command "${cmd}"`)
}

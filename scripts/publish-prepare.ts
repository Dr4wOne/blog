// pnpm publish:prepare <slug> [YYYY-MM-DD] — assign the next issue number to a draft.
// Appends to issues.json and rewrites the post's frontmatter. Refuses anything but a numberless draft.
import { readFileSync, writeFileSync } from 'node:fs'
import { nextIssue, type RegistryEntry, registryErrors } from '../src/lib/issues.ts'

export function setFrontmatter(
  src: string,
  fields: Record<string, string | number | boolean>,
): string {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) throw new Error('post has no frontmatter')
  let fm = m[1] as string
  for (const [k, v] of Object.entries(fields)) {
    const line = `${k}: ${v}`
    fm = new RegExp(`^${k}:.*$`, 'm').test(fm)
      ? fm.replace(new RegExp(`^${k}:.*$`, 'm'), line)
      : `${line}\n${fm}`
  }
  return src.replace(m[0], `---\n${fm}\n---\n`)
}

export function prepare(slug: string, registry: RegistryEntry[], post: string, date: string) {
  const fm = post.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  if (/^issue:/m.test(fm)) throw new Error(`"${slug}" already has an issue number`)
  if (!/^draft:\s*true\s*$/m.test(fm)) throw new Error(`"${slug}" is not a draft`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`bad date "${date}"`)
  const issue = nextIssue(registry)
  const next = [...registry, { issue, slug, published: date }]
  const errors = registryErrors(next, [])
  const real = errors.filter((e) => !e.includes('has no post'))
  if (real.length) throw new Error(real.join('\n'))
  return {
    issue,
    registry: next,
    post: setFrontmatter(post, { issue, published: date, updated: date, draft: false }),
  }
}

if (import.meta.main) {
  const [slug, date = new Date().toISOString().slice(0, 10)] = process.argv.slice(2)
  if (!slug) throw new Error('usage: pnpm publish:prepare <slug> [YYYY-MM-DD]')
  const path = `src/content/posts/${slug}/index.mdx`
  const file = JSON.parse(readFileSync('issues.json', 'utf8'))
  const out = prepare(slug, file.issues, readFileSync(path, 'utf8'), date)
  writeFileSync('issues.json', `${JSON.stringify({ ...file, issues: out.registry }, null, 2)}\n`)
  writeFileSync(path, out.post)
  console.log(`issue ${out.issue}: /${String(out.issue).padStart(2, '0')}-${slug}/`)
}

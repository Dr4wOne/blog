import { expect, it } from 'vitest'
import { prepare, setFrontmatter } from './publish-prepare.ts'

const reg = [{ issue: 1, slug: 'first', published: '2026-10-15' }]
const draft = '---\nslug: second\ntitle: Two\ndraft: true\n---\n\nBody\n'

it('assigns the next number and publishes the draft', () => {
  const out = prepare('second', reg, draft, '2026-11-01')
  expect(out.issue).toBe(2)
  expect(out.registry.at(-1)).toEqual({ issue: 2, slug: 'second', published: '2026-11-01' })
  expect(out.post).toMatch(/^issue: 2$/m)
  expect(out.post).toMatch(/^draft: false$/m)
  expect(out.post).toMatch(/^published: 2026-11-01$/m)
  expect(out.post.endsWith('\nBody\n')).toBe(true)
})

it('refuses published posts, non-drafts and reused slugs', () => {
  expect(() => prepare('x', reg, '---\nissue: 1\ndraft: true\n---\n', '2026-11-01')).toThrow(
    /already/,
  )
  expect(() => prepare('x', reg, '---\ndraft: false\n---\n', '2026-11-01')).toThrow(/not a draft/)
  expect(() => prepare('first', reg, draft, '2026-11-01')).toThrow(/used by two/)
})

it('replaces or adds frontmatter fields', () => {
  expect(setFrontmatter('---\na: 1\n---\nx', { a: 2, b: true })).toBe('---\nb: true\na: 2\n---\nx')
})

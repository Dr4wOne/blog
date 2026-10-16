import { expect, it } from 'vitest'
import { jsonFeed, jsonFeedErrors } from './feed.ts'

const site = {
  url: 'https://blog.dr4w.io',
  title: 'T',
  description: 'D',
  author: { name: 'A', url: 'https://dr4w.io' },
}
const post = {
  issue: 1,
  path: '/01-x/',
  published: new Date('2026-10-15T00:00:00Z'),
  data: { title: 'X', summary: 'S', tags: ['ai'], slug: 'x' },
} as never

it('builds a valid JSON Feed 1.1 with the issue number', () => {
  const f = jsonFeed(site, [post])
  expect(jsonFeedErrors(f)).toEqual([])
  expect(f.items[0]?.url).toBe('https://blog.dr4w.io/01-x/')
  expect(f.items[0]?._dr4w.issue).toBe(1)
})

it('reports a broken feed', () => {
  expect(jsonFeedErrors({ version: 'x', items: [{}] }).length).toBeGreaterThan(2)
})

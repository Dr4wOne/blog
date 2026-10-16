import { expect, it } from 'vitest'
import { readingMinutes, toc } from './article.ts'

it('counts prose words only', () => {
  const body = `---\ntitle: x\n---\nimport A from 'a'\n<Figure />\n${'word '.repeat(460)} https://example.com/a-very-long-url`
  expect(readingMinutes(body)).toBe(2)
})

it('keeps only section headings', () => {
  const h = [
    { depth: 2, slug: 'a', text: 'A' },
    { depth: 3, slug: 'b', text: 'B' },
    { depth: 2, slug: 'footnote-label', text: 'Footnotes' },
  ]
  expect(toc(h).map((x) => x.slug)).toEqual(['a'])
})

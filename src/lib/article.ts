import type { MarkdownHeading } from 'astro'

/** Minutes to read at 230 words per minute, counting prose only (not imports or footnote URLs). */
export function readingMinutes(body: string): number {
  const prose = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
  const words = prose.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
  return Math.max(1, Math.round(words / 230))
}

/** Table of contents: the article's sections (h2), without the hidden footnotes heading. */
export function toc(headings: MarkdownHeading[]) {
  return headings.filter((h) => h.depth === 2 && h.slug !== 'footnote-label')
}

export const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

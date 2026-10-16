// JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/) built from the published posts.
import type { Post } from './posts.ts'

export interface FeedSite {
  url: string
  title: string
  description: string
  author: { name: string; url: string }
}

export function jsonFeed(site: FeedSite, posts: Post[]) {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: site.title,
    home_page_url: `${site.url}/`,
    feed_url: `${site.url}/feed.json`,
    description: site.description,
    icon: `${site.url}/og/default.png`,
    favicon: `${site.url}/favicon.svg`,
    language: 'en',
    authors: [site.author],
    items: posts.map((p) => ({
      id: `${site.url}${p.path}`,
      url: `${site.url}${p.path}`,
      title: p.data.title,
      summary: p.data.summary,
      content_text: p.data.summary,
      image: `${site.url}${p.data.ogImage ?? `/og${p.path.slice(0, -1)}.png`}`,
      date_published: p.published.toISOString(),
      date_modified: (p.data.updated ?? p.published).toISOString(),
      tags: p.data.tags,
      // Extension (allowed by JSON Feed for keys starting with "_"): the issue number, for dr4w.io.
      _dr4w: { issue: p.issue },
    })),
  }
}

/** Problems with a JSON Feed 1.1 document; empty = valid. Used by tests and the judges. */
export function jsonFeedErrors(feed: Record<string, unknown>): string[] {
  const e: string[] = []
  const str = (v: unknown) => typeof v === 'string' && v.length > 0
  const url = (v: unknown) => str(v) && /^https:\/\//.test(v as string)
  if (feed.version !== 'https://jsonfeed.org/version/1.1')
    e.push('version must be https://jsonfeed.org/version/1.1')
  if (!str(feed.title)) e.push('title is required')
  if (!url(feed.home_page_url)) e.push('home_page_url should be an https URL')
  if (!url(feed.feed_url)) e.push('feed_url should be an https URL')
  if (!Array.isArray(feed.items)) return [...e, 'items must be an array']
  const ids = new Set<string>()
  for (const [i, it] of (feed.items as Record<string, unknown>[]).entries()) {
    if (!str(it.id)) e.push(`items[${i}].id is required`)
    if (ids.has(it.id as string)) e.push(`items[${i}].id is not unique`)
    ids.add(it.id as string)
    if (!str(it.content_text) && !str(it.content_html))
      e.push(`items[${i}] needs content_text or content_html`)
    if (it.url !== undefined && !url(it.url)) e.push(`items[${i}].url should be an https URL`)
    for (const k of ['date_published', 'date_modified'])
      if (it[k] !== undefined && Number.isNaN(Date.parse(it[k] as string)))
        e.push(`items[${i}].${k} is not RFC 3339`)
  }
  return e
}

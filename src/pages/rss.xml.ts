import rss from '@astrojs/rss'
import { publishedPosts } from '../lib/posts.ts'
import { SITE } from '../site.ts'

export async function GET() {
  const posts = await publishedPosts()
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>en</language><atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>`,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      link: p.path,
      pubDate: p.published,
      categories: p.data.tags,
      author: `noreply@dr4w.io (${SITE.author.name})`,
    })),
  })
}

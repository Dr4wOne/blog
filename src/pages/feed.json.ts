import { jsonFeed } from '../lib/feed.ts'
import { publishedPosts } from '../lib/posts.ts'
import { SITE } from '../site.ts'

export async function GET() {
  const feed = jsonFeed(
    { url: SITE.url, title: SITE.title, description: SITE.description, author: SITE.author },
    await publishedPosts(),
  )
  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'content-type': 'application/feed+json; charset=utf-8' },
  })
}

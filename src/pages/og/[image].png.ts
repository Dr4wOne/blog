import type { APIRoute } from 'astro'
import { dateFormat } from '../../lib/article.ts'
import { ogImage } from '../../lib/og.ts'
import { publishedPosts } from '../../lib/posts.ts'

export async function getStaticPaths() {
  const posts = await publishedPosts()
  return [
    {
      params: { image: 'default' },
      props: {
        title: 'Writing by Daniel Baumann',
        kicker: 'A personal blog',
        footer: 'blog.dr4w.io',
      },
    },
    ...posts.map((p) => ({
      params: { image: p.path.slice(1, -1) },
      props: {
        title: p.data.title,
        kicker: `Issue ${p.issue} · ${dateFormat.format(p.published)}`,
        footer: `blog.dr4w.io${p.path}`,
      },
    })),
  ]
}

export const GET: APIRoute = async ({ props }) =>
  new Response(
    new Uint8Array(await ogImage(props as { title: string; kicker: string; footer: string })),
    { headers: { 'content-type': 'image/png' } },
  )

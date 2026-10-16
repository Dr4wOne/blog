import { render } from 'astro:content'
import { dateFormat, readingMinutes, toc } from '../../../src/lib/article.ts'
import { type Post, publishedPosts } from '../../../src/lib/posts.ts'

export const SITE = {
  name: 'dr4w',
  author: 'Daniel Baumann',
  tagline: 'Essays on how AI systems work, and how to build with them.',
  home: 'https://dr4w.io',
}

export async function issueData(post: Post) {
  const { headings } = await render(post)
  return {
    post,
    toc: toc(headings),
    minutes: readingMinutes(post.body ?? ''),
    date: dateFormat.format(post.published),
  }
}

export async function homeData() {
  const posts = await publishedPosts()
  return Promise.all(posts.map(issueData))
}

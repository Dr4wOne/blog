import { type CollectionEntry, getCollection } from 'astro:content'
import registryFile from '../../issues.json'
import { issuePath, type RegistryEntry, registryErrors } from './issues.ts'

export type Post = CollectionEntry<'posts'> & { path: string; issue: number; published: Date }

const registry: RegistryEntry[] = registryFile.issues

/** Published posts, newest issue first. Fails the build if the registry and posts disagree. */
export async function publishedPosts(): Promise<Post[]> {
  const all = await getCollection('posts')
  const errors = registryErrors(
    registry,
    all.map((p) => ({ slug: p.data.slug, issue: p.data.issue, draft: p.data.draft })),
  )
  if (errors.length) throw new Error(`Issue registry check failed:\n- ${errors.join('\n- ')}`)
  return all
    .filter((p) => !p.data.draft && p.data.issue !== undefined)
    .map((p) => {
      const issue = p.data.issue as number
      const entry = registry.find((e) => e.issue === issue) as RegistryEntry
      return {
        ...p,
        issue,
        path: `/${issuePath(issue, p.data.slug)}/`,
        published: p.data.published ?? new Date(entry.published),
      }
    })
    .sort((a, b) => b.issue - a.issue)
}

/** Drafts, only in `astro dev` (never built): served at /drafts/<slug>/. */
export async function draftPosts() {
  if (!import.meta.env.DEV) return []
  return (await getCollection('posts')).filter((p) => p.data.draft)
}

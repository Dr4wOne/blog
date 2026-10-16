import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// One folder per post: src/content/posts/<slug>/index.mdx. The URL is built from `issue` + `slug`.
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '*/index.{md,mdx}' }),
  schema: z.object({
    issue: z.number().int().positive().optional(), // absent for drafts; assigned by /publish-post
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    title: z.string().min(1).max(120),
    summary: z.string().min(40).max(300),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(), // path under public/; generated at build when absent
  }),
})

export const collections = { posts }

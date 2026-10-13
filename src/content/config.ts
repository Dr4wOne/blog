import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    category: z.enum(['technical', 'personal', 'project', 'announcement']),
    language: z.string().default('en'),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

export const collections = {
  '': blogCollection,
};

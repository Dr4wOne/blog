import { glob } from 'astro/loaders';
import { getCollection } from 'astro:content';

export interface Post {
  title: string;
  date: Date;
  author: string;
  summary: string;
  tags: string[];
  category: string;
  readingTime: number;
  slug: string;
}

export async function getAllPosts() {
  const posts = await getCollection('content');
  return posts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

export async function getLatestPosts(limit: number = 5) {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

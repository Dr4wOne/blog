// The widget's tokenizer, trained once per build on every post's source text.
import { train } from './bpe.ts'

const sources = import.meta.glob('../content/posts/*/index.{md,mdx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const corpus = Object.values(sources)
  .map((s) =>
    String(s)
      .replace(/^---[\s\S]*?---/, '')
      .replace(/<[^>]+>|^import .*$/gm, ' '),
  )
  .join('\n')

export const MERGE_COUNT = 1000
export const merges = train(corpus, MERGE_COUNT)

import type { issueData } from './data.ts'

export type Issue = Awaited<ReturnType<typeof issueData>>
export interface HomeProps {
  issues: Issue[]
  base: string
}
export type ArticleProps = Issue & { base: string }

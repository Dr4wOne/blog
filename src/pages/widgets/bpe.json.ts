import { merges } from '../../lib/bpe-model.ts'

export const GET = () =>
  new Response(JSON.stringify(merges), { headers: { 'content-type': 'application/json' } })

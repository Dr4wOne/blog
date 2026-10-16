// Next-token scores for "The cat sat on the ___", turned into probabilities at a temperature.
export const PROMPT = 'The cat sat on the'
export const CANDIDATES = [
  ['mat', 3.2],
  ['floor', 2.6],
  ['couch', 2.1],
  ['bed', 1.8],
  ['roof', 1.1],
  ['keyboard', 0.5],
  ['moon', -0.8],
] as const

/** Softmax of logits / t. At t near 0 all probability goes to the top token (greedy). */
export function probabilities(t: number): number[] {
  const logits = CANDIDATES.map(([, l]) => l)
  if (t < 0.05) return logits.map((_, i) => (i === 0 ? 1 : 0))
  const scaled = logits.map((l) => l / t)
  const max = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

/** Draw one index from `probs` using a random number in [0, 1). */
export function sample(probs: number[], r: number): number {
  let acc = 0
  for (const [i, p] of probs.entries()) {
    acc += p
    if (r < acc) return i
  }
  return probs.length - 1
}

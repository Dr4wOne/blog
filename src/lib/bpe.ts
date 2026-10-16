// A small byte-pair-encoding tokenizer, the same algorithm real tokenizers use, trained at build
// time on the article itself. It runs in the browser for the tokenizer widget.

export type Merges = [string, string][]

/** GPT-style pre-split: words keep their leading space; digits, punctuation and spaces split apart. */
export function preSplit(text: string): string[] {
  return text.match(/ ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+/gu) ?? []
}

/** Learn `count` merges from `text`: repeatedly join the most frequent adjacent pair. */
export function train(text: string, count: number): Merges {
  const freq = new Map<string, number>()
  for (const w of preSplit(text)) freq.set(w, (freq.get(w) ?? 0) + 1)
  const words = [...freq].map(([w, n]) => ({ syms: [...w], n }))
  const merges: Merges = []
  for (let m = 0; m < count; m++) {
    const pairs = new Map<string, number>()
    for (const { syms, n } of words) {
      for (let i = 0; i < syms.length - 1; i++) {
        const k = `${syms[i]}\u0000${syms[i + 1]}`
        pairs.set(k, (pairs.get(k) ?? 0) + n)
      }
    }
    let best = ''
    let bestN = 1 // a pair seen once is not worth a vocabulary slot
    for (const [k, n] of pairs)
      if (n > bestN || (n === bestN && best && k < best)) [best, bestN] = [k, n]
    if (!best) break
    const [a, b] = best.split('\u0000') as [string, string]
    merges.push([a, b])
    for (const w of words) w.syms = mergePair(w.syms, a, b)
  }
  return merges
}

function mergePair(syms: string[], a: string, b: string): string[] {
  const out: string[] = []
  for (let i = 0; i < syms.length; i++) {
    if (syms[i] === a && syms[i + 1] === b) {
      out.push(a + b)
      i++
    } else out.push(syms[i] as string)
  }
  return out
}

/** Split `text` into tokens by applying the learned merges in the order they were learned. */
export function encode(text: string, merges: Merges): string[] {
  const rank = new Map(merges.map(([a, b], i) => [`${a}\u0000${b}`, i]))
  const tokens: string[] = []
  for (const piece of preSplit(text)) {
    let syms = [...piece]
    for (;;) {
      let bestRank = Number.POSITIVE_INFINITY
      let at = -1
      for (let i = 0; i < syms.length - 1; i++) {
        const r = rank.get(`${syms[i]}\u0000${syms[i + 1]}`)
        if (r !== undefined && r < bestRank) [bestRank, at] = [r, i]
      }
      if (at < 0) break
      syms = [...syms.slice(0, at), (syms[at] as string) + syms[at + 1], ...syms.slice(at + 2)]
    }
    tokens.push(...syms)
  }
  return tokens
}

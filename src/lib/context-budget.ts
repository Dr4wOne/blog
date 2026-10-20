// A context-window budget: what each /context category costs, and what is left.
// The numbers are placeholders for the reader to replace with their own /context output.
export const WINDOW = 200_000
export const CAVEMAN_TOKENS = 1_160 // Caveman README: its rules add about 1,160 input tokens
export const CATEGORIES = [
  ['System prompt', 3_000],
  ['System tools', 12_000],
  ['MCP tools', 1_000],
  ['Memory files', 2_000],
  ['Skills', 1_500],
  ['Messages', 8_000],
] as const

export type Budget = { shares: number[]; used: number; free: number; usedShare: number }

/** Share of the window for each category (plus Caveman when on), total used and free tokens. */
export function budget(tokens: number[], window: number, caveman: boolean): Budget {
  const w = Math.max(1, window)
  const clean = tokens.map((t) => (Number.isFinite(t) && t > 0 ? t : 0))
  const all = caveman ? [...clean, CAVEMAN_TOKENS] : clean
  const used = all.reduce((a, b) => a + b, 0)
  return {
    shares: all.map((t) => Math.min(1, t / w)),
    used,
    free: Math.max(0, w - used),
    usedShare: Math.min(1, used / w),
  }
}

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
export const pct = (s: number) => `${(s * 100).toFixed(s < 0.1 ? 1 : 0)}%`

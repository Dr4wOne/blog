import { expect, it } from 'vitest'
import { budget, CATEGORIES, CAVEMAN_TOKENS, WINDOW } from './context-budget.ts'

const defaults = CATEGORIES.map(([, t]) => t as number)

it('adds up the categories and leaves the rest free', () => {
  const b = budget(defaults, WINDOW, false)
  expect(b.used).toBe(27_500)
  expect(b.free).toBe(WINDOW - 27_500)
  expect(b.shares).toHaveLength(CATEGORIES.length)
})

it('adds a Caveman row when the toggle is on', () => {
  const b = budget(defaults, WINDOW, true)
  expect(b.used).toBe(27_500 + CAVEMAN_TOKENS)
  expect(b.shares).toHaveLength(CATEGORIES.length + 1)
})

it('ignores bad input and never goes below zero free', () => {
  const b = budget([Number.NaN, -5, 300_000], WINDOW, false)
  expect(b.used).toBe(300_000)
  expect(b.free).toBe(0)
  expect(b.usedShare).toBe(1)
  expect(budget([10], 0, false).usedShare).toBe(1)
})

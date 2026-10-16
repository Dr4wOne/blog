import { expect, it } from 'vitest'
import { CANDIDATES, probabilities, sample } from './temperature.ts'

it('sums to one and keeps the order of the scores', () => {
  for (const t of [0.2, 1, 2]) {
    const p = probabilities(t)
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10)
    expect(p[0]).toBeGreaterThan(p[CANDIDATES.length - 1] as number)
  }
})

it('sharpens at low temperature and flattens at high temperature', () => {
  expect(probabilities(0)[0]).toBe(1)
  expect(probabilities(0.3)[0]).toBeGreaterThan(probabilities(1)[0] as number)
  expect(probabilities(2)[0]).toBeLessThan(probabilities(1)[0] as number)
})

it('samples by cumulative probability', () => {
  expect(sample([0.5, 0.5], 0.1)).toBe(0)
  expect(sample([0.5, 0.5], 0.7)).toBe(1)
  expect(sample([0.5, 0.5], 0.9999999)).toBe(1)
})

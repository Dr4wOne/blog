import { expect, it } from 'vitest'
import { encode, preSplit, train } from './bpe.ts'

it('pre-splits words with their leading space', () => {
  expect(preSplit('The cat, 42 cats.')).toEqual(['The', ' cat', ',', ' 42', ' cats', '.'])
})

it('learns frequent pairs and merges them back losslessly', () => {
  const text = 'low lower lowest low low newer newest new new'.repeat(5)
  const merges = train(text, 30)
  expect(merges.length).toBeGreaterThan(0)
  const tokens = encode(' lowest newer', merges)
  expect(tokens.join('')).toBe(' lowest newer')
  expect(tokens.length).toBeLessThan(' lowest newer'.length)
})

it('falls back to single characters for unseen text', () => {
  expect(encode('xyz', [])).toEqual(['x', 'y', 'z'])
})

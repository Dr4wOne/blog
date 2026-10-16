import { describe, expect, it } from 'vitest'
import { issuePath, nextIssue, registryChangeErrors, registryErrors } from './issues.ts'

const r1 = { issue: 1, slug: 'ai-from-the-ground-up', published: '2026-10-15' }
const r2 = { issue: 2, slug: 'second', published: '2026-11-01' }
const reg = [r1, r2]
const p1 = { slug: 'ai-from-the-ground-up', issue: 1, draft: false }
const p2 = { slug: 'second', issue: 2, draft: false }
const posts = [p1, p2]

describe('issuePath', () => {
  it('pads to two digits and never truncates', () => {
    expect(issuePath(1, 'a')).toBe('01-a')
    expect(issuePath(12, 'a')).toBe('12-a')
    expect(issuePath(100, 'a')).toBe('100-a')
  })
})

describe('registryErrors', () => {
  it('accepts a valid registry with a draft', () => {
    expect(registryErrors(reg, [...posts, { slug: 'wip', draft: true }])).toEqual([])
  })
  it('rejects a duplicate number', () => {
    const r = [r1, { ...r2, issue: 1 }]
    expect(registryErrors(r, posts).join('\n')).toMatch(/appears twice/)
  })
  it('rejects a gap', () => {
    const r = [r1, { ...r2, issue: 3 }]
    expect(registryErrors(r, [p1, { ...p2, issue: 3 }]).join('\n')).toMatch(/gap/)
  })
  it('rejects a changed slug on a published post', () => {
    expect(
      registryErrors(reg, [p1, { slug: 'renamed', issue: 2, draft: false }]).join('\n'),
    ).toMatch(/locked to slug "second"/)
  })
  it('rejects a deleted published post', () => {
    expect(registryErrors(reg, [p1]).join('\n')).toMatch(/never deleted/)
  })
  it('rejects a draft with a number and a published post without one', () => {
    expect(
      registryErrors(reg, [...posts, { slug: 'x', issue: 2, draft: true }]).join('\n'),
    ).toMatch(/draft must not/)
    expect(registryErrors(reg, [...posts, { slug: 'y', draft: false }]).join('\n')).toMatch(
      /not a draft/,
    )
  })
})

describe('registryChangeErrors', () => {
  it('allows appending', () => {
    expect(registryChangeErrors(reg.slice(0, 1), reg)).toEqual([])
  })
  it('rejects removal and slug changes', () => {
    expect(registryChangeErrors(reg, reg.slice(0, 1))[0]).toMatch(/removed/)
    expect(registryChangeErrors(reg, [r1, { ...r2, slug: 'x' }])[0]).toMatch(/slug changed/)
  })
})

it('nextIssue is registry length + 1', () => {
  expect(nextIssue(reg)).toBe(3)
})

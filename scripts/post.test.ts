import { expect, it } from 'vitest'
import { draftTemplate } from './post.ts'

it('creates a draft that the content schema accepts', () => {
  const t = draftTemplate('my-post', 'My post')
  expect(t).toMatch(/^draft: true$/m)
  expect(t).not.toMatch(/^issue:/m)
  expect(t).toMatch(/^title: "My post"$/m)
  const summary = t.match(/^summary: "(.*)"$/m)?.[1] ?? ''
  expect(summary.length).toBeGreaterThanOrEqual(40)
})

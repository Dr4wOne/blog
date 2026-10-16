// pnpm registry:check [base-ref] — published issues on the base branch must be unchanged here (ADR 0002).
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { registryChangeErrors } from '../src/lib/issues.ts'

const ref = process.argv[2] ?? 'origin/main'
let base: { issues: never[] }
try {
  base = JSON.parse(
    execFileSync('git', ['show', `${ref}:issues.json`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }),
  )
} catch {
  console.log(`No issues.json on ${ref} yet; nothing to compare.`)
  process.exit(0)
}
const errors = registryChangeErrors(
  base.issues,
  JSON.parse(readFileSync('issues.json', 'utf8')).issues,
)
if (errors.length) {
  console.error(`issues.json changes published issues:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`issues.json keeps all ${base.issues.length} published issues of ${ref}.`)

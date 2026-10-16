// Issue numbers and URLs. The registry (issues.json) is the lock: once a number is published,
// its slug never changes, nothing is renumbered, and nothing is removed.

export interface RegistryEntry {
  issue: number
  slug: string
  published: string
}

export interface PostRef {
  slug: string
  issue?: number | undefined
  draft: boolean
}

/** `01-ai-from-the-ground-up`: issue padded to two digits (100 stays `100`), then the slug. */
export function issuePath(issue: number, slug: string): string {
  return `${String(issue).padStart(2, '0')}-${slug}`
}

/** Every problem with the registry and the posts, as readable sentences. Empty = valid. */
export function registryErrors(registry: RegistryEntry[], posts: PostRef[]): string[] {
  const errors: string[] = []
  const seen = new Map<number, string>()
  for (const [i, e] of registry.entries()) {
    if (!Number.isInteger(e.issue) || e.issue < 1)
      errors.push(`issues.json: bad issue number "${e.issue}"`)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug)) errors.push(`issues.json: bad slug "${e.slug}"`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.published))
      errors.push(`issues.json: issue ${e.issue} has a bad date`)
    if (seen.has(e.issue)) errors.push(`issues.json: issue ${e.issue} appears twice`)
    seen.set(e.issue, e.slug)
    if (e.issue !== i + 1)
      errors.push(
        `issues.json: expected issue ${i + 1} at position ${i + 1}, found ${e.issue} (gap or wrong order)`,
      )
  }
  const slugs = registry.map((e) => e.slug)
  for (const s of new Set(slugs)) {
    if (slugs.filter((x) => x === s).length > 1)
      errors.push(`issues.json: slug "${s}" is used by two issues`)
  }

  for (const p of posts) {
    if (p.issue === undefined) {
      if (!p.draft)
        errors.push(
          `post "${p.slug}": has no issue number but is not a draft (publish it with /publish-post)`,
        )
      if (slugs.includes(p.slug))
        errors.push(
          `post "${p.slug}": slug belongs to a published issue but the post has no issue number`,
        )
      continue
    }
    if (p.draft) errors.push(`post "${p.slug}": a draft must not have an issue number`)
    const locked = seen.get(p.issue)
    if (locked === undefined)
      errors.push(`post "${p.slug}": issue ${p.issue} is not in issues.json`)
    else if (locked !== p.slug)
      errors.push(`post "${p.slug}": issue ${p.issue} is locked to slug "${locked}"`)
  }
  for (const e of registry) {
    const n = posts.filter((p) => p.issue === e.issue).length
    if (n === 0)
      errors.push(`issue ${e.issue} ("${e.slug}") has no post; published issues are never deleted`)
    if (n > 1) errors.push(`issue ${e.issue} is claimed by ${n} posts`)
  }
  return errors
}

/** The base registry (e.g. on main) must be an unchanged prefix of the new one. */
export function registryChangeErrors(base: RegistryEntry[], next: RegistryEntry[]): string[] {
  const errors: string[] = []
  for (const b of base) {
    const n = next.find((e) => e.issue === b.issue)
    if (!n) errors.push(`issue ${b.issue} ("${b.slug}") was removed from issues.json`)
    else if (n.slug !== b.slug)
      errors.push(`issue ${b.issue}: slug changed from "${b.slug}" to "${n.slug}"`)
    else if (n.published !== b.published) errors.push(`issue ${b.issue}: publish date changed`)
  }
  return errors
}

/** The number /publish-post assigns next. */
export function nextIssue(registry: RegistryEntry[]): number {
  return registry.length + 1
}

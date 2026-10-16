# dr4w directives for the blog

The blog is a separate repo but follows the [dr4w platform](https://github.com/Dr4wOne/dr4w) rules.
This page lists every dr4w rule that applies here, where it comes from, and how the blog meets it.
Precedence: the locked decisions ([ADRs 0001–0008](decisions/README.md)) > these directives > older
blog conventions. Last checked: **2026-10-15** against dr4w `main` @ `3299009`.

`D` = dr4w file, linked. ✅ = done. Adaptations say why.

| # | Rule | Source | Blog |
|---|---|---|---|
| 1 | pnpm 12.11.2 (`packageManager`), Node 24 (`.nvmrc` + `engines`), `engine-strict` | D [docs/stack.md](https://github.com/Dr4wOne/dr4w/blob/main/docs/stack.md), `.npmrc` | ✅ same files |
| 2 | Exact versions; pnpm's minimum release age; never add `minimumReleaseAgeExclude` | D [CLAUDE.md](https://github.com/Dr4wOne/dr4w/blob/main/CLAUDE.md) → Never | ✅ Adapted: one package, so exact versions live in `package.json`, not a `catalog:` |
| 3 | Biome for lint and format (single quotes, no semicolons, 100 columns) | D [ADR 0004](https://github.com/Dr4wOne/dr4w/blob/main/docs/decisions/0004-biome.md), [conventions](https://github.com/Dr4wOne/dr4w/blob/main/docs/conventions.md) | ✅ `biome.json` copied |
| 4 | TypeScript ESM; typecheck in CI | D [conventions](https://github.com/Dr4wOne/dr4w/blob/main/docs/conventions.md) → Code | ✅ Adapted: `astro check` is the typecheck, so TypeScript is 6.0.3 here (it doesn't support 7 yet) |
| 5 | Cloudflare Workers + static assets, `wrangler.jsonc`, Worker `dr4w-<project>`, custom domain in config, `workers_dev: false` | D [ADR 0016](https://github.com/Dr4wOne/dr4w/blob/main/docs/decisions/0016-subdomains-only.md), [apps/hello/web/wrangler.jsonc](https://github.com/Dr4wOne/dr4w/blob/main/apps/hello/web/wrangler.jsonc) | ✅ `dr4w-blog` on `blog.dr4w.io`. Adapted: assets only, no Worker script, no API |
| 6 | Subdomains only; never touch the `dr4w.io` apex or `www` | D [CLAUDE.md](https://github.com/Dr4wOne/dr4w/blob/main/CLAUDE.md) → Never | ✅ only `blog.dr4w.io` |
| 7 | Deploy = squash-merge a PR to `main`; never push to `main`; branches `feat/…`, `fix/…`, `docs/…` | D [docs/guides/deploy.md](https://github.com/Dr4wOne/dr4w/blob/main/docs/guides/deploy.md), conventions → Git | ✅ Adapted: required check is `check` only (no infra, so no `plan` job) |
| 8 | `ci.yml` on PRs, `deploy.yml` on push to `main` + `workflow_dispatch`; `permissions: contents: read`; composite `setup` action; actions pinned to commit SHAs (same versions as dr4w) | D [.github/workflows](https://github.com/Dr4wOne/dr4w/tree/main/.github/workflows) | ✅ |
| 9 | Deploy secrets live in the GitHub `production` environment: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | D [ADR 0002](https://github.com/Dr4wOne/dr4w/blob/main/docs/decisions/0002-public-repo-production-environment.md), [security.md](https://github.com/Dr4wOne/dr4w/blob/main/docs/security.md) | ✅ plus `LANDPAGE_DISPATCH_TOKEN` ([cutover.md](cutover.md)) |
| 10 | Every deploy ends with a smoke test against the live URL | D conventions → Tests | ✅ judges re-run against `https://blog.dr4w.io` |
| 11 | Dependabot for npm and actions, weekly, 3-day cooldown | D [.github/dependabot.yml](https://github.com/Dr4wOne/dr4w/blob/main/.github/dependabot.yml) | ✅ same file minus Terraform |
| 12 | Never commit secrets, `.env*`, `.dev.vars`; repo is public; secret scanning + push protection on | D [security.md](https://github.com/Dr4wOne/dr4w/blob/main/docs/security.md) | ✅ `.gitignore` copied. The blog has no runtime secrets |
| 13 | Logic has tests (Vitest) | D conventions → Tests | ✅ registry, tokenizer, temperature, feeds, post scripts (24 tests) |
| 14 | No PR previews / sandboxes | D [ADR 0014](https://github.com/Dr4wOne/dr4w/blob/main/docs/decisions/0014-no-pr-previews.md) | ✅ `blog-sbx` removed ([ADR 0003](decisions/0003-no-sandbox.md)) |
| 15 | Docs: direct, `README.md` ≤ 150 lines, `CLAUDE.md` ≤ 80, other docs ≤ 200; one home per fact; dated where it rots; plain English | D conventions → Docs | ✅ |
| 16 | The repo is the memory: `docs/STATUS.md`, ADRs (Context · Decision · Consequences · Status) | D [CLAUDE.md](https://github.com/Dr4wOne/dr4w/blob/main/CLAUDE.md), [decisions/README.md](https://github.com/Dr4wOne/dr4w/blob/main/docs/decisions/README.md) | ✅ |
| 17 | Session protocol `/start`, `/handoff`, `/doc-check` | D [.claude/commands](https://github.com/Dr4wOne/dr4w/tree/main/.claude/commands) | ✅ copied and adapted; plus `/new-post`, `/publish-post` |
| 18 | caveman + ponytail, pinned tags, ponytail `full`; chat terse, files plain English; never cut validation, accessibility, security or tests | D [ADR 0017](https://github.com/Dr4wOne/dr4w/blob/main/docs/decisions/0017-caveman-and-ponytail-by-default.md), [agent-tools.md](https://github.com/Dr4wOne/dr4w/blob/main/docs/agent-tools.md) | ✅ same `.claude/settings.json` |
| 19 | Commit subject imperative ≤ 72 chars, body says why, `Co-Authored-By` line; push via `gh auth git-credential` | D conventions → Git | ✅ |
| 20 | No deploy, merge, DNS or settings change without an explicit "go" | D [CLAUDE.md](https://github.com/Dr4wOne/dr4w/blob/main/CLAUDE.md) → Never | ✅ gates G2/G3 |
| 21 | ≈ $0 idle cost | D [costs.md](https://github.com/Dr4wOne/dr4w/blob/main/docs/costs.md) | ✅ static assets on the Workers free plan |
| 22 | Design rules from taste-skill, pinned | job brief | ✅ commit `f624f37` in `.claude/skills/` ([ADR 0006](decisions/0006-taste-skill.md)) |

**Not applicable** (no API, no AWS): Lambda/Hono/zod API rules, origin secret, DynamoDB, EventBridge,
OpenTofu, IAM, SSM, AWS OIDC roles. The old blog workflow assumed AWS roles it never used; the new
one has no AWS access at all, which also keeps the blog out of the shared-account trust issue listed
in dr4w `docs/STATUS.md`.

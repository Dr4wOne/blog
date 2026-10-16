# blog.dr4w.io

Daniel Baumann's personal blog: long-form writing on any topic, published as numbered issues.
Astro static site on a Cloudflare Worker, deployed like every [dr4w](https://github.com/Dr4wOne/dr4w) project.

**Live:** [blog.dr4w.io](https://blog.dr4w.io) · state of things: [docs/STATUS.md](docs/STATUS.md)

## Write
| I want to… | Do |
|---|---|
| Start a post | `/new-post <slug> "<title>"` in Claude Code, or `pnpm post:new <slug> "<title>"` |
| See it while writing | `pnpm dev` → `http://localhost:4321/drafts/<slug>/` |
| Publish it | `/publish-post <slug>`, or `pnpm post:publish <slug>` then open a PR |
| Fix a published post | edit its `index.mdx`, `pnpm post:touch <slug>`, PR |
| Review a PR | `gh pr checkout <n> && pnpm dev`; the PR shows the judge table |

Everything about writing: [docs/guides/new-post.md](docs/guides/new-post.md). Design rules:
[docs/design-system.md](docs/design-system.md).

## Run
```bash
pnpm install
pnpm dev            # http://localhost:4321 (drafts included)
pnpm check          # lint, typecheck, tests, build
pnpm judges         # every quality judge against the build (docs/judges.md)
pnpm preview        # the built site through wrangler, like production
```
Node 24 and pnpm 12 ([docs/stack.md](docs/stack.md)).

## Ship
Branch → PR (`check` must pass) → squash-merge = deploy to `blog.dr4w.io`, which also refreshes the
Writing section on [dr4w.io](https://dr4w.io). Details: [docs/guides/deploy.md](docs/guides/deploy.md).

## Where is…
| | |
|---|---|
| Posts | `src/content/posts/<slug>/index.mdx`, numbers in [issues.json](issues.json) |
| Figures and widgets | `src/components/figures/`, `src/components/widgets/` |
| Look and feel | `src/styles/theme.css`, [docs/design-system.md](docs/design-system.md) |
| The ten design prototypes | [prototypes/README.md](prototypes/README.md) |
| Decisions | [docs/decisions/README.md](docs/decisions/README.md) |
| dr4w rules this repo follows | [docs/dr4w-directives.md](docs/dr4w-directives.md) |

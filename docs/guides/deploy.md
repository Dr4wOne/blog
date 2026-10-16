# Deploy

**Deploy = squash-merge a PR to `main`.** There is no other deploy path.

## What happens
1. On the PR, `ci.yml` runs `pnpm check` (lint, typecheck, tests, build) and `pnpm judges`
   (Lighthouse, axe, HTML, links, redirects, feeds, size budgets, taste-skill gate) against a local
   build. The `check` job must pass (branch protection).
2. On merge, `deploy.yml` (environment `production`) builds, runs `wrangler deploy`, waits until
   `https://blog.dr4w.io` answers, runs `pnpm judges --live https://blog.dr4w.io`, and sends
   `repository_dispatch` (`blog-published`) to `Dr4wOne/dr4w-landpage`.

## Steps
```bash
git push -u origin <branch>            # push command: CLAUDE.md
gh pr create --fill
gh pr checks --watch
gh pr merge --squash --delete-branch
gh run watch $(gh run list --workflow deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
```

## Redeploy without a change
`gh workflow run deploy.yml` (also re-notifies the landing page).

## Verify
`curl -sI https://blog.dr4w.io/ | head -1` is `200`, and the deploy run is green.

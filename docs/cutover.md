# Cutover: from the Pages sandbox to the `dr4w-blog` Worker

**Status:** planned. Every step that changes Cloudflare, DNS or GitHub settings needs an explicit "go".

## Starting point (checked 2026-10-15)
- `blog.dr4w.io` has **no DNS record** (NXDOMAIN): nothing is live on the production name.
- Cloudflare Pages project `blog-sbx` serves the old site at `b3291982.blog-sbx.pages.dev`.
- `blog-sbx.dr4w.io` is a proxied DNS record that returns 404 (the Pages domain was never attached).
- GitHub `Dr4wOne/blog`: environments `sandbox` (3 secrets) and `prod` (empty); no branch protection.

So the cutover creates the production site; it does not move one. **Expected downtime: none** (nothing to
take down). The only visible change for anyone is that `blog.dr4w.io` starts answering.

## Steps

### 1. Tokens (you create them; I never see the values)
1. **Cloudflare:** reuse the dr4w `dr4w-ci` token or create `dr4w-blog-ci` with the same scopes
   (dr4w `docs/bootstrap.md` §3): Account · Workers Scripts · Edit; Account · Account Settings · Read;
   Zone `dr4w.io` · Workers Routes · Edit; Zone · DNS · Edit; Zone · Zone · Read. Expiry: 12 months.
2. **GitHub, landing dispatch:** github.com → Settings → Developer settings → Fine-grained tokens →
   *Generate new token*. Name `blog-landpage-dispatch`, owner `Dr4wOne`, expiry 12 months,
   **Only select repositories → `Dr4wOne/dr4w-landpage`**, Repository permissions → **Contents: Read and
   write** (the minimum for `POST /repos/{owner}/{repo}/dispatches`; Metadata: Read is added
   automatically). Nothing else.

### 2. GitHub settings for `Dr4wOne/blog` (needs "go")
```bash
gh api -X PUT repos/Dr4wOne/blog/environments/production \
  -F 'deployment_branch_policy[protected_branches]=true' -F 'deployment_branch_policy[custom_branch_policies]=false'
gh secret set CLOUDFLARE_API_TOKEN   --env production --repo Dr4wOne/blog   # paste the token
gh secret set CLOUDFLARE_ACCOUNT_ID  --env production --repo Dr4wOne/blog
gh secret set LANDPAGE_DISPATCH_TOKEN --env production --repo Dr4wOne/blog  # the fine-grained token
gh api -X PUT repos/Dr4wOne/blog/branches/main/protection --input - <<'JSON'
{"required_status_checks":{"strict":true,"checks":[{"context":"check"}]},"enforce_admins":false,
 "required_pull_request_reviews":null,"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
JSON
```
Verify: `gh secret list --env production --repo Dr4wOne/blog` shows three names.

### 3. Deploy (on "go" at G2)
1. Merge the relaunch PR (squash). `deploy.yml` builds, runs `wrangler deploy` (creates Worker
   `dr4w-blog` and the custom domain `blog.dr4w.io`, which also creates its DNS record and certificate),
   waits until `https://blog.dr4w.io/` answers 200 (usually 1–3 minutes for the first certificate),
   then runs the live checks.
2. If the custom domain fails because a record already exists, stop: someone added one since
   2026-10-15. Look at it in the dashboard before changing anything.

### 4. Verify live
```bash
curl -sI https://blog.dr4w.io/01-ai-from-the-ground-up/ | head -1          # 200
for p in /1-ai-from-the-ground/ /transmission /archive/; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "https://blog.dr4w.io$p"; done   # 301 → new URL
curl -s https://blog.dr4w.io/feed.json | head -c 200
pnpm judges --live https://blog.dr4w.io                                      # every judge, against production
```
OG preview: paste the article URL into a link-preview checker (e.g. opengraph.xyz) and a Slack message.

### 5. Retire the sandbox (separate "go", only after step 4 is green)
1. Cloudflare → Workers & Pages → `blog-sbx` → Settings → *Delete project*.
2. Cloudflare → `dr4w.io` → DNS → delete the `blog-sbx` CNAME.
3. GitHub: `gh api -X DELETE repos/Dr4wOne/blog/environments/sandbox` and
   `gh api -X DELETE repos/Dr4wOne/blog/environments/prod`; `gh variable delete AWS_REGION BASE_DOMAIN`.
4. Verify: `dig +short blog-sbx.dr4w.io` is empty; `https://b3291982.blog-sbx.pages.dev` no longer answers.

## Rollback
- **Bad content or design after a later merge:** Cloudflare → Workers → `dr4w-blog` → Deployments →
  roll back, then revert the PR ([guides/rollback.md](guides/rollback.md)).
- **The cutover itself fails:** nothing was live before, so rolling back means deleting the custom domain
  `blog.dr4w.io` from the Worker (Settings → Domains & Routes). The old sandbox stays untouched until
  step 5, so it remains available as a reference.

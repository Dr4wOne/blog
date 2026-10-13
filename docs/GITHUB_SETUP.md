# GitHub Setup & Deployment

## Summary

This project uses GitHub Actions for automated CI/CD deployment to Cloudflare Pages.

## Steps Completed

### 1. Repository Creation
- Created public repository: `https://github.com/Dr4wOne/blog`
- Configured SSH remote for reliable push from agent environment
- Protected main branch with status checks

### 2. GitHub Environments
Created two environments for deployment gates:
- `sandbox` - Auto-deploys on push to main
- `prod` - Manual approval required (via `workflow_dispatch`)

Commands:
```bash
gh api -X PUT repos/Dr4wOne/blog/environments/sandbox
gh api -X PUT repos/Dr4wOne/blog/environments/prod
```

### 3. GitHub Secrets (Environment-Level)
Set at the environment level so they're accessible to workflow steps:

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo Dr4wOne/blog --env sandbox
gh secret set CLOUDFLARE_ACCOUNT_ID --repo Dr4wOne/blog --env sandbox  
gh secret set CLOUDFLARE_ZONE_ID --repo Dr4wOne/blog --env sandbox
```

**Important:** When using GitHub Actions with environment-level secrets, they must be explicitly referenced in individual step `env` sections:

```yaml
- name: Deploy to Cloudflare
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    CLOUDFLARE_ZONE_ID: ${{ secrets.CLOUDFLARE_ZONE_ID }}
  run: npx wrangler pages deploy ...
```

### 4. GitHub Variables
Set at repository level:

```bash
gh variable set BASE_DOMAIN --repo Dr4wOne/blog --body "dr4w.io"
gh variable set AWS_REGION --repo Dr4wOne/blog --body "us-east-1"
```

## Workflows

### CI Workflow (ci.yml)
- Triggers on: PR and push to main
- Runs: npm ci, lint, test, build
- Blocks merge if checks fail

### Deploy Workflow (deploy.yml)
- Triggers on: push to main (sandbox), manual workflow_dispatch (prod)
- Uses environment approvals for prod
- Deploys to Cloudflare Pages
- Creates custom domain DNS records
- Runs smoke tests

## Deployment Flow

```
Local commit & push (SSH)
        ↓
GitHub → CI workflow (lint, test, build)
        ↓ (if passing)
GitHub → Deploy workflow
        ↓
wrangler pages deploy
        ↓
Create project & DNS records in Cloudflare
        ↓
Smoke tests (curl HTTP 200)
        ↓
Live at: https://blog-sbx.dr4w.io (sandbox)
                 https://blog.dr4w.io (prod)
```

## Troubleshooting

### Secrets Not Visible in Workflow
- Job-level `env:` with `${{ secrets.X }}` may not work with environment-level secrets
- **Solution:** Move secret references to individual step `env:` sections
- Reference: [GitHub Actions Secrets in Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#secrets)

### HTTPS Git Push Fails
- Use SSH remote instead: `git remote set-url origin git@github.com:Dr4wOne/blog.git`
- Requires SSH key configured locally

### DNS Not Propagating
- Workflow creates CNAME records but they may take 1-5 minutes to propagate
- Smoke tests retry up to 6 times over ~1 minute

## Future Projects

When setting up a new project:

1. Create repo: `gh repo create Dr4wOne/<project> --public --source <dir> --remote origin`
2. Push: `git push -u origin main` (use SSH if HTTPS fails)
3. Create environments and secrets as above
4. Update deploy workflow to reference secrets properly
5. First push to main auto-triggers deployment

See also: `/docs/runbooks/github-setup.md`

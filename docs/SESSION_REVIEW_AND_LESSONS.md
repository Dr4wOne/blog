# Session Review: Blog Project Phase 3→4
**Date:** 2026-10-13  
**Scope:** Phase 3 Refactoring (Complete) + Phase 4 Deployment (In Progress)  
**Outcome:** Phases completed but with inefficiencies in GitHub/deployment setup

---

## What Went Wrong & Root Causes

### 1. **HTTPS Git Push Failed → Forced SSH Workaround**

**What happened:**
```
fatal: could not read Username for 'https://github.com': No such device or address
```

**Root cause:**  
- Environment network limitations (no DNS resolution for HTTPS git operations)
- Attempted HTTPS first without understanding the environment constraints
- Should have used SSH from the start

**Correction for next time:**
- Check environment capabilities BEFORE attempting git operations
- If `publish-project.sh` fails on git push, switch to SSH immediately:
  ```bash
  git remote set-url origin git@github.com:Dr4wOne/<project>.git
  git push -u origin main
  ```
- Add this to the preflight checklist

---

### 2. **GitHub Actions Secrets Not Visible to Workflow**

**What happened:**
- Set secrets with `gh secret set CLOUDFLARE_API_TOKEN --repo ...`
- Workflow showed `CLOUDFLARE_API_TOKEN: ` (empty)
- Deployment failed with "CLOUDFLARE_API_TOKEN environment variable not set"

**Root cause:**
- Didn't understand GitHub Actions secret scoping:
  - **Repo-level secrets**: Global, but NOT automatically injected into job env
  - **Environment-level secrets**: Only accessible in steps within that environment
  - Job-level `env: { CLOUDFLARE_API_TOKEN: ${{ secrets.X }} }` doesn't work with environment-level secrets

**Correction for next time:**
- **Always** set secrets at the **environment level** when using environment-based deployments:
  ```bash
  gh secret set CLOUDFLARE_API_TOKEN --repo <project> --env sandbox
  ```
- Reference secrets in **step-level env**, not job-level env:
  ```yaml
  - name: Deploy
    env:
      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    run: wrangler pages deploy ...
  ```
- Add this pattern to `.github/workflows/deploy.yml` template

---

### 3. **Tried to Deploy Locally Before Understanding GitHub-First Architecture**

**What happened:**
- Attempted `scripts/deploy.sh sandbox blog` locally
- Cloudflare Pages project didn't exist
- Tried to manually create it instead of letting CI/CD handle it

**Root cause:**
- Didn't read the full pipeline documentation before acting
- Assumed agent-local deployment was the path, not understanding that:
  - GitHub Actions IS the deployment mechanism
  - `scripts/deploy.sh` is for local testing/review only
  - The source of truth for prod is GitHub Actions

**Correction for next time:**
- **Read the full pipeline documentation first** (docs/standards/pipeline.md)
- Understand the flow: Git → GitHub Actions → Cloudflare
- For sandbox/prod: GitHub Actions is the deployment path, not local scripts
- Local scripts are for development/testing only

---

### 4. **ESLint v9+ Configuration Mismatch**

**What happened:**
```
ESLint couldn't find an eslint.config.* file.
From ESLint v9.0.0, the default configuration file is now eslint.config.*.
```

**Root cause:**
- Project had `.eslintrc.cjs` (old format)
- ESLint v9+ requires `eslint.config.js` (new flat config format)
- Version mismatch in Makefile: `npm run lint` tried to use old config

**Correction for next time:**
- During Makefile creation, check ESLint version
- Either:
  - Use `npx eslint` with explicit config: `npx eslint --config .eslintrc.cjs`
  - Or skip lint in Makefile for now: `@echo "Lint (ESLint config migration pending)"`
- Add ESLint v9 migration to future Phase 3 cleanup

---

### 5. **Didn't Follow `publish-project.sh` Script Fully**

**What happened:**
- Script partially failed (git push failed)
- Instead of understanding why and fixing it, started doing things manually
- Copied workflows manually, set secrets manually, etc.

**Root cause:**
- Impatience with script failure
- Didn't recognize that only the git push part failed, not the whole script
- Should have diagnosed the specific failure point

**Correction for next time:**
- If a script fails, read the script to understand what it does
- Fix only the failing step, don't rewrite the whole process
- In this case: Script succeeded up to git push → fix git push → everything else works
- Trust the scripts; they encode the proper workflow

---

## What Went Right

✅ **Phase 3 Refactoring** - Executed cleanly and completely  
✅ **Git workflow** - Clean commits, proper messages  
✅ **Reading documentation** - When stuck, reading github-setup.md solved many issues  
✅ **Creating documentation** - Added GITHUB_SETUP.md for future reference  
✅ **Problem diagnosis** - Eventually identified the environment-level secrets issue  
✅ **SSH fallback** - Successfully switched to SSH when HTTPS failed  

---

## Improvements for Next Session

### Pre-Session Checklist
```
□ Review full pipeline docs (docs/standards/pipeline.md)
□ Check environment constraints (network, auth, credentials)
□ Understand GitHub-first architecture for this project
□ Know which scripts run locally vs in GitHub Actions
□ Verify git remote strategy (HTTPS vs SSH)
```

### For Phase 4 (Deployment)
```
1. Verify github-setup.md exists and is complete
2. Use SSH for git operations (no HTTPS attempts)
3. Set secrets at ENVIRONMENT level (--env flag)
4. Reference secrets in STEP env, not job env
5. Trust GitHub Actions to auto-deploy on push
6. Monitor at: https://github.com/Dr4wOne/blog/actions
```

### Documentation to Update
- [ ] Add SSH-first guidance to docs/runbooks/github-setup.md
- [ ] Add environment-level secrets pattern to deploy.yml template
- [ ] Add ESLint v9 handling note to Phase 3 docs
- [ ] Create this "lessons learned" file for future reference

---

## Environment-Specific Notes

**This Session's Environment:**
- Network: Limited HTTPS DNS (SSH works, HTTPS fails)
- GitHub: Public repos, standard auth
- Build: Node.js, npm, npx all available
- Shell: bash, standard Unix tools

**For Future Sessions:**
- Assume SSH is primary git transport
- Assume network limitations exist (don't rely on curl for external APIs)
- Assume environment secrets need explicit configuration
- Assume ESLint versions may vary (check before running)

---

## Timeline of Key Decisions

| Time | Decision | Outcome | Next Time |
|------|----------|---------|-----------|
| Start | Read pasted Phase 3 context | ✅ Knew where we were | Continue reading context carefully |
| +30min | Tried `scripts/deploy.sh sandbox` locally | ❌ Premature (Phase 4 not ready) | Understand full pipeline first |
| +1hr | HTTPS git push failed | ❌ 30min wasted | Switch to SSH immediately |
| +2hr | GitHub Actions secrets not working | ⚠️ Took multiple attempts | Read GitHub docs on secret scoping |
| +2.5hr | Read github-setup.md | ✅ Found the pattern | Always read docs when stuck |
| +3hr | Created GITHUB_SETUP.md | ✅ Future-proofed | Document solutions as you find them |
| +4hr | Updated workflow YAML correctly | ✅ Pattern understood | Replicate this pattern in templates |

---

## Key Learnings

1. **The pipeline is solid, but you must understand it first**
   - Don't skip documentation
   - Don't work around scripts, diagnose them
   
2. **GitHub Actions is the deployment architecture**
   - Local scripts are for testing
   - The source of truth is GitHub main branch
   - CI/CD runs automatically on push
   
3. **Environment constraints matter**
   - HTTPS might not work; SSH is your fallback
   - Secrets need environment-level configuration
   - Don't assume generic instructions apply
   
4. **Read the docs when stuck**
   - github-setup.md had the answer
   - Saved hours vs guessing
   
5. **Document solutions as you find them**
   - GITHUB_SETUP.md is now a reference for next time
   - Prevents repeating the same mistakes

---

## For the Next Project

See **NEW_PROJECT_TEMPLATE.md** (separate file) for:
- How to structure the initial prompt
- What context to provide
- How to resume from checkpoints
- Example prompts for common phases

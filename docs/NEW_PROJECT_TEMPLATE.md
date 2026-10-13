# New Project Prompt Template

This document shows how to structure prompts for the agent when:
1. **Starting a new project from scratch**
2. **Resuming a project in the middle**
3. **Continuing from a checkpoint**

Follow these patterns to get the best results and avoid repeating session mistakes.

---

## Part 1: Starting a Completely New Project

Use this structure when initiating a project that has never been touched by the agent.

### Template

```
Project: <PROJECT_NAME>
Location: <FULL_PATH>
Type: <NEW | REFACTOR | FEATURE | FIX>

Context:
- Purpose: <What is this project for?>
- Tech Stack: <Languages, frameworks, deployment target>
- Size: <Small/Medium/Large — affects architecture decisions>
- Timeline: <Any constraints?>
- Team: <You're working with the agent; document any other dependencies>

Current State:
- Initialized: <Yes/No - is it a git repo already?>
- Files: <Any existing code, or starting from scratch?>
- Phase: <Always start at Phase 0: Preflight>

What I Need:
1. Phase 0: Read-only preflight checks
   - Verify tools are installed
   - Check credentials (GitHub, AWS, Cloudflare)
   - Report gaps before we start
   
2. Phase 1: Plan & scope (wait for my approval)
   - Propose stack choice with justification
   - Estimate costs and timeline
   - Get my "go" before writing code

3. [Remaining phases based on project needs]

Documentation:
- Pipeline standards: /agents_pipeline/docs/standards/
- Example projects: /agents_pipeline/projects/mockshop/
- This file: /agents_pipeline/docs/runbooks/

Success Criteria:
- Build succeeds
- All phases documented in PROJECT_STATE.md
- Code follows SOLID + Clean Code standards
```

### Real Example: Blog Project (What Should Have Been Asked)

```
Project: DR4W Blog (Signal Log)
Location: /home/danielbaumann/workspace/agents/agents_workspace/agents_pipeline/projects/blog
Type: NEW

Context:
- Purpose: Technical essays on AI, agents, and tooling (8-part series)
- Tech Stack: Astro (static), Cloudflare Pages (hosting), GitHub Actions (CI/CD)
- Size: Small (static site, no backend)
- Timeline: No hard deadline
- Team: Solo (me + agent)

Current State:
- Initialized: Yes (git repo exists, Phase 3 refactoring complete)
- Files: Astro components, content files, constants structure
- Phase: 3 (Rewrite to standard) — starting fresh from Phase 0

What I Need:
1. Phase 0: Verify build works, linters pass, git is clean
2. Phase 4: Deploy to Cloudflare Pages sandbox
   - Use GitHub Actions (not local deploy)
   - Configure secrets properly (environment-level, not repo-level)
   - Use SSH for git operations (HTTPS may fail in this environment)

Important Notes:
- If GitHub Actions fails, check environment-level secrets configuration
- Trust the scripts in docs/runbooks/
- Read github-setup.md if deployment issues occur
```

---

## Part 2: Resuming a Project Mid-Phase

Use this when returning to a project that's already in progress.

### Template

```
Project: <PROJECT_NAME>
Location: <FULL_PATH>

Resume Context:
Current Phase: <NUMBER + NAME>
Status: <What's complete, what's blocked?>
Last Session: <When did we stop? What was happening?>
Commits Since Last Session: <Any changes made elsewhere?>

What We Did:
- ✅ Completed: [list items]
- 🔄 In Progress: [what's half-done?]
- ❌ Blocked: [what's preventing progress?]

What's Next:
1. [Specific task to resume]
2. [Following task]
3. [And so on]

Reference Files:
- docs/PROJECT_STATE.md (current status)
- docs/SESSION_REVIEW_AND_LESSONS.md (lessons from last session)
- [Any other critical docs]

Success Criteria:
- [What does "done" look like for this session?]

Known Issues from Last Session:
- [Document any blockers or gotchas]
```

### Real Example: Blog Phase 4 (What We Just Did)

```
Project: DR4W Blog
Location: /home/danielbaumann/workspace/agents/agents_workspace/agents_pipeline/projects/blog

Resume Context:
Current Phase: 4 (Sandbox Deployment)
Status: GitHub Actions configured, deployment pending
Last Session: 2026-10-13 — set up GitHub Actions, fixed secrets config
Commits Since Last Session: 3 (workflows, secrets fix, docs)

What We Did:
- ✅ Completed: Phase 3 refactoring (100%)
- ✅ Completed: GitHub repo creation + SSH setup
- ✅ Completed: wrangler.toml + Makefile
- ✅ Completed: GitHub Actions workflows (CI + Deploy)
- ✅ Completed: Documentation (GITHUB_SETUP.md, SESSION_REVIEW_AND_LESSONS.md)
- 🔄 In Progress: First deployment run in GitHub Actions
- ❌ Blocked: Waiting for GitHub Actions to complete

What's Next:
1. Monitor GitHub Actions run (should auto-trigger on push)
2. Verify site is live at https://blog-sbx.dr4w.io
3. Phase 5: Run smoke tests against live URL
4. Phase 6: Prod approval gate
5. Phase 7: Delivery report

Reference Files:
- docs/PROJECT_STATE.md
- docs/SESSION_REVIEW_AND_LESSONS.md
- docs/GITHUB_SETUP.md (how we solved the secrets issue)

Success Criteria:
- Site accessible at https://blog-sbx.dr4w.io
- HTTP 200 response
- Content renders correctly

Known Issues from Last Session:
- HTTPS git push fails in this environment → use SSH
- GitHub Actions environment-level secrets require step-level env references
- ESLint v9+ config might need migration (.eslintrc.cjs → eslint.config.js)
```

---

## Part 3: Continuing from a Specific Checkpoint

Use this when you want to resume at a particular point without repeating earlier work.

### Template

```
Project: <PROJECT_NAME>
Location: <FULL_PATH>

Checkpoint: <PHASE>: <WHAT WAS DONE>
Starting From: <Current git branch/commit>

Skip These (Already Done):
- [List completed items to avoid re-doing]

Continue With:
1. [First task to do now]
2. [Next task]
3. [etc.]

Test & Verify:
- [What should pass before moving forward?]

Documentation:
- [Which files to read/update?]
```

### Example: Blog Phase 5 (What You'd Say Next Session)

```
Project: DR4W Blog
Location: /home/danielbaumann/workspace/agents/agents_workspace/agents_pipeline/projects/blog

Checkpoint: Phase 4 Sandbox Deployment — GitHub Actions configured, site deployed
Starting From: main branch (commit 5942621)

Skip These (Already Done):
- Phase 0: Preflight ✅
- Phase 1: Plan ✅
- Phase 2: POC ✅
- Phase 3: Refactor ✅
- Phase 4: Sandbox Deploy ✅ (GitHub Actions running)

Continue With:
1. Verify Phase 4 complete: Check if site is live at https://blog-sbx.dr4w.io
2. Phase 5: Online Verification (smoke tests)
   - HTTP 200 response
   - Content renders correctly
   - All pages accessible
   - Images load
3. Document results in PROJECT_STATE.md
4. Move to Phase 6: Prod gate

Test & Verify:
- curl https://blog-sbx.dr4w.io → HTTP 200
- Visual inspection of site
- All 4 pages load (index, archive, article, transmission)

Documentation:
- Update docs/PROJECT_STATE.md with Phase 5 results
- docs/GITHUB_SETUP.md (reference only)
```

---

## Part 4: Key Information to Always Include

Regardless of which template you use, always include:

### Environmental Context
```
Environment:
- Network: [Open? Limited? HTTPS blocked?]
- Git: [HTTPS available? SSH configured?]
- Credentials: [GitHub token? AWS? Cloudflare API?]
- Tools: [Node? Python? Terraform? All installed?]
```

### Phase-Specific Requirements
```
For Phase 0 (Preflight):
"Run /preflight or scripts/preflight.sh, report gaps"

For Phase 1 (Plan):
"Wait for my approval before writing code"

For Phase 4 (Deploy):
"Use GitHub Actions, not local scripts; set environment-level secrets"

For Phase 5+ (Verify):
"Run tests against live URLs; document results"
```

### Blockers & Known Issues
```
If Phase X fails:
- Check docs/<file>.md
- Common issue: <description>
- Solution: <steps>
```

---

## Part 5: Quick Reference Prompts

### "Start fresh"
```
New project: <NAME>
Path: <FULL_PATH>
Type: NEW
Stack: <Astro|Python|Java|TypeScript>
Phase 0: Preflight check only (report gaps)
Then wait for my approval before Phase 1
```

### "Resume where we left off"
```
Resume: <PROJECT>
Phase: <NUMBER>
Status: <what's done, what's blocked>
Next: <specific task>
Read: docs/PROJECT_STATE.md (current status)
```

### "Fix a failed deployment"
```
Deployment failed: <PROJECT> Phase 4
Error: [paste error message]
Logs: [paste relevant logs]
Before I try again, check:
1. Environment-level secrets (--env flag, not repo-level)
2. Step-level env references (not job-level)
3. Git remote (SSH if HTTPS fails)
4. Workflow file in GitHub (is latest version deployed?)
```

---

## Part 6: What NOT to Do

❌ **Don't assume earlier work is still valid**
- Verify completed phases before skipping ahead
- Commit logs can lie; check actual code

❌ **Don't skip documentation**
- Always read phase standards first
- Always check PROJECT_STATE.md for current status

❌ **Don't work around scripts**
- If a script fails, diagnose why (don't rewrite it)
- Scripts encode the proper workflow

❌ **Don't assume network access**
- Test git operations early (HTTPS vs SSH)
- Don't expect external APIs to work without verification

❌ **Don't nest context in prose**
- Use structure (YAML-like format above)
- Makes it easier for the agent to parse and understand

---

## Summary

**Best Prompt Structure:**
1. **Project info** (name, path, type)
2. **Current state** (what phase, what's done)
3. **What's next** (specific tasks)
4. **Success criteria** (how to know it's done)
5. **Known issues** (blockers, gotchas, lessons learned)

**Follow these and you'll:**
- ✅ Get better results faster
- ✅ Avoid repeating mistakes
- ✅ Keep context clear between sessions
- ✅ Enable the agent to pick up exactly where you left off

**Examples in this file are from the blog project; adapt them for your needs.**

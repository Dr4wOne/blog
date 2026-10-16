# Roll back

**Fastest (about a minute):** Cloudflare dashboard → Workers & Pages → `dr4w-blog` → Deployments →
pick the last good version → *Rollback*. Then revert on `main`, or the next merge brings the problem back:
```bash
git checkout main && git pull && git checkout -b revert/<what>
git revert <bad-merge-sha>
git push -u origin revert/<what> && gh pr create --fill     # merging redeploys the good version
```

**Never** roll back by deleting a published post or editing `issues.json`; fix forward instead.

## Verify
`curl -sI https://blog.dr4w.io/ | head -1` is `200`; `gh run list --workflow deploy.yml --limit 3`.

#!/usr/bin/env bash
#
# Sync the CANONICAL public repo to match this repo, keeping its own README.
#
#   Canonical / discovery repo : aartiq/servicenow-mcp   (remote: snmcp)
#     - npm `nowaikit` points here, has the stars, releases, issues, and the
#       keyword README "# ServiceNow MCP Server (NowAIKit)".
#   Code / brand repo          : aartiq/nowaikit         (remote: origin)
#
# The ONLY intended file-level difference between the two repos is README.md
# (the canonical repo keeps its discovery variant for search). This makes the
# canonical repo's tree identical to origin/main EXCEPT README.md, handling
# additions, edits AND deletions (a plain per-file checkout would miss deletes,
# which is how a stale file drifted onto the mirror before). The commit is a
# fast-forward on top of the canonical repo, so its stars, tags and releases
# are preserved.
#
# Usage:  bash scripts/sync-mirror.sh
#
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

git fetch -q origin main
git fetch -q snmcp main

tmp="mirror-sync-$$"
git checkout -q -B "$tmp" snmcp/main

# Make the working tree exactly match origin/main (adds, edits, and deletions),
# then restore the canonical repo's own discovery README.
git read-tree -u --reset origin/main
git checkout snmcp/main -- README.md
git add -A

if git diff --cached --quiet; then
  echo "servicenow-mcp already in sync with origin/main@$(git rev-parse --short origin/main)."
else
  # Uses the repo's default git identity on purpose; do not set the company email.
  git commit -q -m "sync from aartiq/nowaikit@$(git rev-parse --short origin/main) (discovery README preserved)"
  git push snmcp "HEAD:main"
  echo "Synced servicenow-mcp -> $(git rev-parse --short HEAD)"
fi

git checkout -q main
git branch -qD "$tmp" 2>/dev/null || true

# Parity check: the only remaining difference must be README.md.
git fetch -q snmcp main
diff_files="$(git diff --name-only origin/main snmcp/main | grep -v '^README.md$' || true)"
if [ -z "$diff_files" ]; then
  echo "Parity OK: only README.md differs (by design)."
else
  echo "WARNING: unexpected non-README differences remain:"; echo "$diff_files"
fi

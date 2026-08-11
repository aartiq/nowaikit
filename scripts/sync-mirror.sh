#!/usr/bin/env bash
#
# Sync the CANONICAL public repo, preserving real commit authorship so
# contributors show up on BOTH repos.
#
#   Canonical / discovery repo : aartiq/servicenow-mcp   (remote: snmcp)
#     npm `nowaikit` points here; has the stars, releases, issues, and the
#     keyword README "# ServiceNow MCP Server (NowAIKit)".
#   Code / brand repo          : aartiq/nowaikit         (remote: origin)
#
# Model: the canonical repo's history = origin/main's exact history (every
# author preserved) + ONE commit on top that swaps in the discovery README.
# This is why contributors (not just the maintainer) appear on the canonical
# repo too. The only file-level difference between the repos is README.md.
#
# An earlier version squashed the sync into a single maintainer-authored commit,
# which hid external contributors on the canonical repo. Do not go back to that.
#
# Usage:  bash scripts/sync-mirror.sh
#
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

git fetch -q origin main
git fetch -q snmcp main

# Already synced? (mirror tip's parent is exactly origin/main)
if [ "$(git rev-parse snmcp/main~1 2>/dev/null || echo x)" = "$(git rev-parse origin/main)" ]; then
  echo "servicenow-mcp already in sync with origin/main@$(git rev-parse --short origin/main)."
  exit 0
fi

# Preserve the canonical repo's discovery README (title + npm-safe PNG banner).
discovery="$(git show snmcp/main:README.md)"

tmp="mirror-sync-$$"
git checkout -q -B "$tmp" origin/main
printf '%s\n' "$discovery" > README.md
git add README.md
git commit -q -m "docs: discovery README for the servicenow-mcp npm package"
git push snmcp "HEAD:main" --force
git push snmcp --force --tags
git checkout -q main
git branch -qD "$tmp" 2>/dev/null || true

# Parity check: only README.md may differ.
git fetch -q snmcp main
diff_files="$(git diff --name-only origin/main snmcp/main | grep -v '^README.md$' || true)"
if [ -z "$diff_files" ]; then
  echo "Synced. Parity OK (only README differs). Mirror title: $(git show snmcp/main:README.md | sed -n '10p')"
else
  echo "WARNING: unexpected non-README differences remain:"; echo "$diff_files"
fi

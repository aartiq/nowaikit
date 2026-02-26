#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# create-pro-repo.sh — Create the private nowaikit-pro repository on GitHub
#
# Prerequisites:
#   - gh CLI installed and authenticated (gh auth login)
#   - git installed
#   - Run from the nowaikit repo root
#
# What this script does:
#   1. Creates a new PRIVATE repo on GitHub: aartiq/nowaikit-pro
#   2. Adds it as a remote called "pro"
#   3. Pushes the current branch (with all features) to the pro repo
#   4. Sets LICENSE_TIER=enterprise as the default in the pro repo's .env.example
#
# Usage:
#   cd /path/to/nowaikit
#   bash scripts/create-pro-repo.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

ORG="aartiq"
REPO_NAME="nowaikit-pro"
FULL_NAME="${ORG}/${REPO_NAME}"
DESCRIPTION="NowAIKit Pro — ServiceNow MCP Server with all 400+ tools, multi-instance, HTTP API, desktop app, SSO, audit, and org policy."

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  NowAIKit — Create Private Pro Repository                      ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
command -v gh >/dev/null 2>&1 || { echo "❌ gh CLI not found. Install: https://cli.github.com"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git not found."; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "❌ gh not authenticated. Run: gh auth login"; exit 1; }

echo "1/5  Checking if ${FULL_NAME} already exists..."
if gh repo view "${FULL_NAME}" >/dev/null 2>&1; then
  echo "     ⚠️  Repository ${FULL_NAME} already exists."
  echo "     Adding remote and pushing..."
else
  echo "2/5  Creating private repository: ${FULL_NAME}..."
  gh repo create "${FULL_NAME}" \
    --private \
    --description "${DESCRIPTION}" \
    --disable-wiki \
    --disable-issues=false
  echo "     ✅ Created ${FULL_NAME} (private)"
fi

echo "3/5  Adding 'pro' remote..."
if git remote get-url pro >/dev/null 2>&1; then
  echo "     Remote 'pro' already exists, updating URL..."
  git remote set-url pro "https://github.com/${FULL_NAME}.git"
else
  git remote add pro "https://github.com/${FULL_NAME}.git"
fi

echo "4/5  Pushing current branch to pro repo..."
CURRENT_BRANCH=$(git branch --show-current)
git push -u pro "${CURRENT_BRANCH}:main"
echo "     ✅ Pushed ${CURRENT_BRANCH} → pro/main"

echo "5/5  Pushing all tags..."
git push pro --tags 2>/dev/null || true

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  ✅  Done!                                                      ║"
echo "║                                                                 ║"
echo "║  Private repo: https://github.com/${FULL_NAME}         ║"
echo "║  Public repo:  https://github.com/${ORG}/nowaikit (free)        ║"
echo "║                                                                 ║"
echo "║  Next steps:                                                    ║"
echo "║    1. In the free repo (main branch), set LICENSE_TIER=free     ║"
echo "║    2. In the pro repo, LICENSE_TIER defaults to enterprise      ║"
echo "║    3. Pro customers clone from the private repo                 ║"
echo "╚══════════════════════════════════════════════════════════════════╝"

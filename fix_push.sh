#!/usr/bin/env bash
# Recovery script.
# Use this if you accidentally committed the membership work to local `main`
# and the push got rejected because remote main moved ahead (Avantika's PR).
# Anmol: just run `bash fix_push.sh`.

set -euo pipefail

cd "$(dirname "$0")"

BRANCH="feature/membership"

echo ">> Fetching latest from origin"
git fetch origin

CURRENT=$(git rev-parse --abbrev-ref HEAD)
echo ">> Currently on: $CURRENT"

echo ">> Saving any local main commits onto $BRANCH (idempotent)"
# Create feature branch pointing to current main if it doesn't already exist.
git branch -f "$BRANCH" "$CURRENT"

echo ">> Resetting local main to match origin/main (Avantika's latest)"
git checkout main 2>/dev/null || git checkout -B main
git reset --hard origin/main

echo ">> Switching to $BRANCH and rebasing on top of latest main"
git checkout "$BRANCH"
git rebase origin/main || {
    echo ""
    echo "!! Rebase had conflicts. Resolve them, then run:"
    echo "   git rebase --continue"
    echo "   git push -u origin $BRANCH"
    exit 1
}

echo ">> Pushing $BRANCH to origin"
git push -u origin "$BRANCH"

echo ""
echo "DONE. Open this URL to create the PR:"
echo "  https://github.com/SinghAnmoldeep/Intelligent-talent-matching-platform/pull/new/$BRANCH"
echo ""
echo "Local main is now clean (matches origin/main). Your work lives on $BRANCH."

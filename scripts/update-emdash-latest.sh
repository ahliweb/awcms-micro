#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$ROOT_DIR/emdash-latest"
REPO_URL="https://github.com/emdash-cms/emdash.git"
REPO_BRANCH="main"
METADATA_FILE="$ROOT_DIR/docs/upstream-sync/LAST_UPSTREAM_FETCH.md"
TEMP_DIR="$(mktemp -d)"
SOURCE_DIR="$TEMP_DIR/emdash"

cleanup() {
	rm -rf "$TEMP_DIR"
}

trap cleanup EXIT

# Run this only after upstream/downstream analysis is complete.
# If preserving downstream changes requires script or validation updates, make those first.
if [[ "${SYNC_PREFLIGHT_CHECKED:-0}" != "1" ]]; then
	bash "$ROOT_DIR/scripts/sync-preflight-checklist.sh"
fi
echo "Cloning latest EmDash..."
git clone --depth 1 --branch "$REPO_BRANCH" "$REPO_URL" "$SOURCE_DIR"
UPSTREAM_SHA="$(git -C "$SOURCE_DIR" rev-parse HEAD)"
FETCHED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p "$TARGET_DIR"
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
mkdir -p "$(dirname "$METADATA_FILE")"

rsync -a \
	--delete \
	--exclude='.git' \
	"$SOURCE_DIR/" "$TARGET_DIR/"

cat >"$METADATA_FILE" <<EOF
# Last Upstream Fetch

## Source

- Upstream repository URL: $REPO_URL
- Upstream branch: $REPO_BRANCH
- Upstream commit SHA: $UPSTREAM_SHA
- Fetch date: $FETCHED_AT
- Target folder: emdash-latest/

## Notes

This file records the exact upstream EmDash revision copied into emdash-latest/.
EOF

echo "emdash-latest has been refreshed from upstream EmDash ($REPO_BRANCH) at $UPSTREAM_SHA."

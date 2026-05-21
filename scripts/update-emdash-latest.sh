#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$ROOT_DIR/emdash-latest"
REPO_URL="https://github.com/emdash-cms/emdash.git"
TEMP_DIR="$(mktemp -d)"
SOURCE_DIR="$TEMP_DIR/emdash"

cleanup() {
	rm -rf "$TEMP_DIR"
}

trap cleanup EXIT

echo "Cloning latest EmDash..."
git clone --depth 1 "$REPO_URL" "$SOURCE_DIR"

mkdir -p "$TARGET_DIR"
find "$TARGET_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

rsync -a \
	--exclude='.git' \
	"$SOURCE_DIR/" "$TARGET_DIR/"

echo "emdash-latest has been refreshed from upstream EmDash."

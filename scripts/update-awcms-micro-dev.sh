#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$ROOT_DIR/awcms-micro-dev"
DEFAULT_REPO_URL="https://github.com/emdash-cms/emdash.git"
SOURCE_PATH="${1:-}"
TEMP_DIR=""

cleanup() {
	if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
		rm -rf "$TEMP_DIR"
	fi
}

trap cleanup EXIT

mkdir -p "$TARGET_DIR"

if [[ -n "$SOURCE_PATH" ]]; then
	SOURCE_DIR="$(cd "$SOURCE_PATH" && pwd)"
	if [[ ! -d "$SOURCE_DIR/.git" && ! -f "$SOURCE_DIR/package.json" ]]; then
		echo "Source path does not look like an EmDash checkout: $SOURCE_DIR" >&2
		exit 1
	fi
	if [[ "$SOURCE_DIR" == "$ROOT_DIR" ]]; then
		echo "Refusing to sync from the current repository root into awcms-micro-dev." >&2
		echo "Pass a different checkout path or run without arguments." >&2
		exit 1
	fi
else
	TEMP_DIR="$(mktemp -d)"
	SOURCE_DIR="$TEMP_DIR/emdash"
	echo "Cloning latest EmDash into temporary directory..."
	git clone --depth 1 "$DEFAULT_REPO_URL" "$SOURCE_DIR"
	fi

echo "Refreshing $TARGET_DIR from $SOURCE_DIR"

find "$TARGET_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

rsync -a \
	--exclude='.git' \
	--exclude='node_modules' \
	--exclude='dist' \
	--exclude='.astro' \
	--exclude='awcms-micro-dev' \
	"$SOURCE_DIR/" "$TARGET_DIR/"

echo "awcms-micro-dev is now synced with the latest EmDash source."

#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$ROOT_DIR/emdash-latest"
TARGET_DIR="$ROOT_DIR/awcmsmicro-dev"

if [[ ! -d "$SOURCE_DIR" ]]; then
	echo "Missing source directory: $SOURCE_DIR" >&2
	exit 1
fi

mkdir -p "$TARGET_DIR"
find "$TARGET_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

rsync -a \
	--exclude='.git' \
	--exclude='node_modules' \
	--exclude='dist' \
	--exclude='.astro' \
	--exclude='.wrangler' \
	"$SOURCE_DIR/" "$TARGET_DIR/"

echo "awcmsmicro-dev has been rebuilt from emdash-latest."

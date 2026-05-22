#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$ROOT_DIR/emdash-latest"
TARGET_DIR="$ROOT_DIR/awcmsmicro-dev"
PROTECTED_PATHS_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"
BACKUP_DIR=""
RSYNC_PROTECTED_ARGS=()

cleanup() {
	if [[ -n "$BACKUP_DIR" && -d "$BACKUP_DIR" ]]; then
		rm -rf "$BACKUP_DIR"
	fi
}

backup_protected_paths() {
	if [[ ! -f "$PROTECTED_PATHS_FILE" ]]; then
		return
	fi

	BACKUP_DIR="$(mktemp -d)"

	while IFS= read -r relative_path || [[ -n "$relative_path" ]]; do
		if [[ -z "$relative_path" || "$relative_path" == \#* ]]; then
			continue
		fi

		if [[ -e "$TARGET_DIR/$relative_path" ]]; then
			mkdir -p "$BACKUP_DIR/$(dirname "$relative_path")"
			rsync -a "$TARGET_DIR/$relative_path" "$BACKUP_DIR/$(dirname "$relative_path")/"
		fi
	done < "$PROTECTED_PATHS_FILE"
}

restore_protected_paths() {
	if [[ -z "$BACKUP_DIR" || ! -d "$BACKUP_DIR" || ! -f "$PROTECTED_PATHS_FILE" ]]; then
		return
	fi

	while IFS= read -r relative_path || [[ -n "$relative_path" ]]; do
		if [[ -z "$relative_path" || "$relative_path" == \#* ]]; then
			continue
		fi

		if [[ -e "$BACKUP_DIR/$relative_path" ]]; then
			mkdir -p "$TARGET_DIR/$(dirname "$relative_path")"
			rsync -a "$BACKUP_DIR/$relative_path" "$TARGET_DIR/$(dirname "$relative_path")/"
		fi
	done < "$PROTECTED_PATHS_FILE"
}

load_protected_rsync_args() {
	if [[ ! -f "$PROTECTED_PATHS_FILE" ]]; then
		return
	fi

	while IFS= read -r relative_path || [[ -n "$relative_path" ]]; do
		if [[ -z "$relative_path" || "$relative_path" == \#* ]]; then
			continue
		fi

		RSYNC_PROTECTED_ARGS+=("--exclude=$relative_path")
	done < "$PROTECTED_PATHS_FILE"
}

trap cleanup EXIT

if [[ ! -d "$SOURCE_DIR" ]]; then
	echo "Missing source directory: $SOURCE_DIR" >&2
	exit 1
fi

mkdir -p "$TARGET_DIR"

backup_protected_paths
load_protected_rsync_args

rsync -a \
	--delete \
	--exclude='.git' \
	--exclude='node_modules' \
	--exclude='dist' \
	--exclude='.astro' \
	--exclude='.wrangler' \
	"${RSYNC_PROTECTED_ARGS[@]}" \
	"$SOURCE_DIR/" "$TARGET_DIR/"

restore_protected_paths

echo "awcmsmicro-dev has been rebuilt from emdash-latest while preserving approved AWCMS-Micro paths."

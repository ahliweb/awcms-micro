#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$ROOT_DIR/emdash-latest"
TARGET_DIR="$ROOT_DIR/awcmsmicro-dev"
PROTECTED_PATHS_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"
BACKUP_DIR=""
RSYNC_PROTECTED_ARGS=()

log() {
	printf '[awcmsmicro-dev sync] %s\n' "$1"
}

cleanup() {
	if [[ -n "$BACKUP_DIR" && -d "$BACKUP_DIR" ]]; then
		rm -rf "$BACKUP_DIR"
	fi
}

backup_protected_paths() {
	BACKUP_DIR="$(mktemp -d)"
	log "Backing up approved AWCMS-Micro paths listed in $PROTECTED_PATHS_FILE"

	while IFS= read -r relative_path || [[ -n "$relative_path" ]]; do
		if [[ -z "$relative_path" || "$relative_path" == \#* ]]; then
			continue
		fi

		if [[ -e "$TARGET_DIR/$relative_path" ]]; then
			log "Backing up $relative_path"
			mkdir -p "$BACKUP_DIR/$(dirname "$relative_path")"
			rsync -a "$TARGET_DIR/$relative_path" "$BACKUP_DIR/$(dirname "$relative_path")/"
		else
			log "No existing custom path at $relative_path; skipping backup"
		fi
	done < "$PROTECTED_PATHS_FILE"
}

restore_protected_paths() {
	if [[ -z "$BACKUP_DIR" || ! -d "$BACKUP_DIR" ]]; then
		return
	fi

	log "Restoring approved AWCMS-Micro paths"

	while IFS= read -r relative_path || [[ -n "$relative_path" ]]; do
		if [[ -z "$relative_path" || "$relative_path" == \#* ]]; then
			continue
		fi

		if [[ -e "$BACKUP_DIR/$relative_path" ]]; then
			log "Restoring $relative_path"
			mkdir -p "$TARGET_DIR/$(dirname "$relative_path")"
			rsync -a "$BACKUP_DIR/$relative_path" "$TARGET_DIR/$(dirname "$relative_path")/"
		fi
	done < "$PROTECTED_PATHS_FILE"
}

load_protected_rsync_args() {
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

if [[ ! -f "$PROTECTED_PATHS_FILE" ]]; then
	echo "Missing protected paths file: $PROTECTED_PATHS_FILE" >&2
	exit 1
fi

mkdir -p "$TARGET_DIR"

backup_protected_paths
load_protected_rsync_args

log "Rebuilding $TARGET_DIR from $SOURCE_DIR"

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

log "awcmsmicro-dev has been rebuilt from emdash-latest while preserving approved AWCMS-Micro paths"

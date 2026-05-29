#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$ROOT_DIR/emdash-latest"
TARGET_DIR="$ROOT_DIR/awcmsmicro-dev"
PROTECTED_PATHS_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"
PATCHES_DIR="$TARGET_DIR/.awcms-patches"
BACKUP_DIR=""
RSYNC_PROTECTED_ARGS=()
TRANSIENT_SUBPATH_EXCLUDES=(
	"--exclude=node_modules"
	"--exclude=dist"
	"--exclude=.astro"
	"--exclude=.wrangler"
	"--exclude=.vite"
	"--exclude=.mf"
)
TRANSIENT_SUBPATH_NAMES=(
	"node_modules"
	"dist"
	".astro"
	".wrangler"
	".vite"
	".mf"
)

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
			rsync -a "${TRANSIENT_SUBPATH_EXCLUDES[@]}" "$TARGET_DIR/$relative_path" "$BACKUP_DIR/$(dirname "$relative_path")/"
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
			rsync -a "${TRANSIENT_SUBPATH_EXCLUDES[@]}" "$BACKUP_DIR/$relative_path" "$TARGET_DIR/$(dirname "$relative_path")/"
		fi
	done < "$PROTECTED_PATHS_FILE"
}

apply_downstream_patches() {
	if [[ ! -d "$PATCHES_DIR" ]]; then
		log "No downstream patch overlay found; skipping patch application"
		return
	fi

	shopt -s nullglob
	local patch_files=("$PATCHES_DIR"/*.patch)
	shopt -u nullglob

	if [[ "${#patch_files[@]}" -eq 0 ]]; then
		log "No downstream patch files found under $PATCHES_DIR; skipping patch application"
		return
	fi

	local patch_file
	for patch_file in "${patch_files[@]}"; do
		log "Applying downstream patch $(basename "$patch_file")"
		git -C "$ROOT_DIR" apply --directory=awcmsmicro-dev --whitespace=nowarn "$patch_file"
	done

	log "Applied ${#patch_files[@]} downstream patch(es)"
}

is_protected_path() {
	local candidate="$1"
	while IFS= read -r relative_path || [[ -n "$relative_path" ]]; do
		if [[ -z "$relative_path" || "$relative_path" == \#* ]]; then
			continue
		fi
		if [[ "$candidate" == "$relative_path" || "$candidate" == "$relative_path"/* ]]; then
			return 0
		fi
	done < "$PROTECTED_PATHS_FILE"
	return 1
}

contains_only_transient_children() {
	local dir="$1"
	local child
	local has_entries="0"

	shopt -s nullglob dotglob
	for child in "$dir"/*; do
		local base
		base="$(basename "$child")"
		if [[ "$base" == "." || "$base" == ".." ]]; then
			continue
		fi
		has_entries="1"
		local allowed="0"
		for transient in "${TRANSIENT_SUBPATH_NAMES[@]}"; do
			if [[ "$base" == "$transient" ]]; then
				allowed="1"
				break
			fi
		done
		if [[ "$allowed" != "1" ]]; then
			shopt -u nullglob dotglob
			return 1
		fi
		if [[ ! -d "$child" ]]; then
			shopt -u nullglob dotglob
			return 1
		fi
	done
	shopt -u nullglob dotglob
	[[ "$has_entries" == "1" ]]
}

prune_stale_transient_dirs() {
	local pruned_count="0"
	log "Pruning stale directories that only contain transient build artifacts"
	while IFS= read -r absolute_path; do
		local relative_path
		relative_path="${absolute_path#"$TARGET_DIR"/}"
		if [[ "$relative_path" == "$absolute_path" || -z "$relative_path" || "$relative_path" == "." ]]; then
			continue
		fi
		if [[ -e "$SOURCE_DIR/$relative_path" ]]; then
			continue
		fi
		if is_protected_path "$relative_path"; then
			continue
		fi
		if contains_only_transient_children "$absolute_path"; then
			rm -rf "$absolute_path"
			pruned_count="$((pruned_count + 1))"
		fi
	done < <(find "$TARGET_DIR" -mindepth 1 -depth -type d)
	if [[ "$pruned_count" != "0" ]]; then
		log "Removed $pruned_count stale transient-only directories"
	fi
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
	--exclude='.vite' \
	--exclude='.mf' \
	"${RSYNC_PROTECTED_ARGS[@]}" \
	"$SOURCE_DIR/" "$TARGET_DIR/"

prune_stale_transient_dirs
restore_protected_paths
apply_downstream_patches

log "awcmsmicro-dev has been rebuilt from emdash-latest while preserving approved AWCMS-Micro paths"

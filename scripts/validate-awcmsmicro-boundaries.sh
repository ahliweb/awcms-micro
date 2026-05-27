#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BOUNDARIES_DOC="$ROOT_DIR/docs/awcms-micro-implementation-boundaries.md"
ALLOWLIST_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"
SYNC_SCRIPT="$SCRIPT_DIR/update-awcmsmicro-dev.sh"

REQUIRED_PATHS=(
	"templates/awcms-micro-default"
	"templates/awcms-micro-default-cloudflare"
	"packages/plugins/awcms-micro-example"
	"packages/plugins/awcms-micro-gallery"
	"demos/awcms-micro-cloudflare"
	"docs/awcms-micro"
	"docs/gallery"
	"e2e/awcms-micro"
	".github/workflows"
	".github/dependabot.yml"
)

ROOT_DOCS=(
	"$ROOT_DIR/README.md"
	"$ROOT_DIR/docs/README.md"
	"$ROOT_DIR/docs/repository-structure.md"
	"$ROOT_DIR/docs/synchronization-workflow.md"
	"$ROOT_DIR/docs/implementation-instructions.md"
)

PATH_REFERENCE_DOCS=(
	"$ROOT_DIR/README.md"
	"$ROOT_DIR/docs/repository-structure.md"
	"$ROOT_DIR/docs/implementation-instructions.md"
)

log() {
	printf '[awcmsmicro boundaries] %s\n' "$1"
}

fail() {
	printf '[awcmsmicro boundaries] ERROR: %s\n' "$1" >&2
	exit 1
}

require_file() {
	local path="$1"
	[[ -f "$path" ]] || fail "Missing required file: $path"
}

require_dir() {
	local path="$1"
	[[ -d "$path" ]] || fail "Missing required directory: $path"
}

require_path() {
	local path="$1"
	[[ -e "$path" ]] || fail "Missing required path: $path"
}

require_contains() {
	local needle="$1"
	local path="$2"
	rg -F --quiet "$needle" "$path" || fail "Expected '$needle' in $path"
}

require_dir "$ROOT_DIR/emdash-latest"
require_dir "$ROOT_DIR/awcmsmicro-dev"
require_file "$BOUNDARIES_DOC"
require_file "$ALLOWLIST_FILE"
require_file "$SYNC_SCRIPT"

log "Checking root documentation references"
for doc in "${ROOT_DOCS[@]}"; do
	require_file "$doc"
	require_contains "awcms-micro-implementation-boundaries.md" "$doc"
done

log "Checking approved boundary paths"
for relative_path in "${REQUIRED_PATHS[@]}"; do
	require_contains "$relative_path" "$BOUNDARIES_DOC"
	require_contains "$relative_path" "$ALLOWLIST_FILE"
	for doc in "${PATH_REFERENCE_DOCS[@]}"; do
		require_contains "$relative_path" "$doc"
	done
	dir_path="$ROOT_DIR/awcmsmicro-dev/$relative_path"
	require_path "$dir_path"
done

log "Checking sync allowlist strategy"
require_contains 'PROTECTED_PATHS_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"' "$SYNC_SCRIPT"
require_contains 'backup_protected_paths()' "$SYNC_SCRIPT"
require_contains 'restore_protected_paths()' "$SYNC_SCRIPT"
require_contains 'RSYNC_PROTECTED_ARGS+=("--exclude=$relative_path")' "$SYNC_SCRIPT"
require_contains 'Missing protected paths file' "$SYNC_SCRIPT"

log "Checking tracked files for secret-like paths"
secret_like_paths="$(git -C "$ROOT_DIR" ls-files \
	| rg -n '(^|/)\.env($|\.[^.]+$)|(^|/)\.dev\.vars$|(^|/)(secret|secrets|credential|credentials)\.(json|ya?ml|toml|ini|txt)$|\.(pem|key|p12|pfx)$|(^|/)id_(rsa|ed25519)$' \
	| rg -v '(^|/)\.env\.example$' || true)"
if [[ -n "$secret_like_paths" ]]; then
	printf '%s\n' "$secret_like_paths"
	fail "Tracked secret-like file paths detected"
fi

log "Boundary validation completed successfully"

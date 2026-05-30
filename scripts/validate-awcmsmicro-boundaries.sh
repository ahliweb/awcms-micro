#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BOUNDARIES_DOC="$ROOT_DIR/docs/awcms-micro-implementation-boundaries.md"
ALLOWLIST_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"
RUNTIME_PREREQS_SCRIPT="$SCRIPT_DIR/check-runtime-prereqs.sh"
SYNC_SCRIPT="$SCRIPT_DIR/update-awcmsmicro-dev.sh"
PREFLIGHT_SCRIPT="$SCRIPT_DIR/sync-preflight-checklist.sh"
VALIDATION_SCRIPT="$SCRIPT_DIR/validate-awcmsmicro-dev.sh"
COMBINED_SCRIPT="$SCRIPT_DIR/sync-and-validate-awcmsmicro-dev.sh"

REQUIRED_PATHS=(
	"templates/awcms-micro-default"
	"templates/awcms-micro-default-cloudflare"
	"packages/plugins/awcms-micro-sikesra"
	"packages/plugins/awcms-micro-gallery"
	"demos/awcms-micro-cloudflare"
	"docs/awcms-micro"
	"docs/gallery"
	"e2e/awcms-micro"
	".awcms-changesets"
	".changeset"
	".github/workflows"
	".github/scripts"
	".github/dependabot.yml"
	"AGENTS.md"
)

ADMIN_NAV_PERSISTENCE_PATHS=(
	"packages/admin/src/components/Sidebar.tsx"
	"packages/admin/src/components/Shell.tsx"
	"packages/admin/src/components/AdminCommandPalette.tsx"
	"packages/admin/tests/components/Sidebar.test.tsx"
	"packages/admin/tests/components/AdminCommandPalette.test.tsx"
	"AGENTS.md"
)

LOCAL_STATE_PATHS=(
	".env"
	".env.age"
)

LOCAL_STATE_DOCS=(
	"$ROOT_DIR/README.md"
	"$ROOT_DIR/docs/repository-structure.md"
	"$ROOT_DIR/docs/implementation-instructions.md"
	"$ROOT_DIR/docs/operator-workflow.md"
	"$ROOT_DIR/docs/synchronization-workflow.md"
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
	rg -F --quiet -- "$needle" "$path" || fail "Expected '$needle' in $path"
}

if [[ "${AWCMS_RUNTIME_PREREQS_CHECKED:-0}" != "1" ]]; then
	bash "$ROOT_DIR/scripts/check-runtime-prereqs.sh"
	export AWCMS_RUNTIME_PREREQS_CHECKED=1
fi

require_dir "$ROOT_DIR/emdash-latest"
require_dir "$ROOT_DIR/awcmsmicro-dev"
require_file "$BOUNDARIES_DOC"
require_file "$ALLOWLIST_FILE"
require_file "$RUNTIME_PREREQS_SCRIPT"
require_file "$SYNC_SCRIPT"
require_file "$PREFLIGHT_SCRIPT"
require_file "$VALIDATION_SCRIPT"
require_file "$COMBINED_SCRIPT"

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

log "Checking admin navigation persistence overlays"
for relative_path in "${ADMIN_NAV_PERSISTENCE_PATHS[@]}"; do
	require_contains "$relative_path" "$BOUNDARIES_DOC"
	require_contains "$relative_path" "$ALLOWLIST_FILE"
	dir_path="$ROOT_DIR/awcmsmicro-dev/$relative_path"
	require_path "$dir_path"
done

log "Checking local bootstrap state preservation"
for relative_path in "${LOCAL_STATE_PATHS[@]}"; do
	require_contains "$relative_path" "$BOUNDARIES_DOC"
	require_contains "$relative_path" "$ALLOWLIST_FILE"
	for doc in "${LOCAL_STATE_DOCS[@]}"; do
		require_contains "$relative_path" "$doc"
	done
done

log "Checking sync allowlist strategy"
require_contains 'check-runtime-prereqs.sh' "$SYNC_SCRIPT"
require_contains 'PROTECTED_PATHS_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"' "$SYNC_SCRIPT"
require_contains 'backup_protected_paths()' "$SYNC_SCRIPT"
require_contains 'restore_protected_paths()' "$SYNC_SCRIPT"
require_contains 'RSYNC_PROTECTED_ARGS+=("--exclude=$relative_path")' "$SYNC_SCRIPT"
require_contains 'Missing protected paths file' "$SYNC_SCRIPT"

log "Checking runtime prerequisite preflight"
require_contains 'Supported hosts are Linux, macOS, and Windows via a Bash-compatible shell' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'Darwin)' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'MINGW*|MSYS*|CYGWIN*)' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'command -v "$command_name"' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'Required runtime commands are available' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'Platform:' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'User:' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'git --version' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'node --version' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'pnpm --version' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'python3 --version' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'rsync --version' "$RUNTIME_PREREQS_SCRIPT"
require_contains 'check-runtime-prereqs.sh' "$VALIDATION_SCRIPT"
require_contains 'check-runtime-prereqs.sh' "$COMBINED_SCRIPT"

log "Checking sync preflight gate"
require_contains 'MODE="continuation"' "$PREFLIGHT_SCRIPT"
require_contains '--fresh-clone' "$PREFLIGHT_SCRIPT"
require_contains 'AWCMSMICRO_TEMPLATE_NAME' "$PREFLIGHT_SCRIPT"
require_contains 'AWCMSMICRO_USE_BUILTIN_PLUGINS' "$PREFLIGHT_SCRIPT"
require_contains 'check-runtime-prereqs.sh' "$PREFLIGHT_SCRIPT"
require_contains 'validate-awcmsmicro-boundaries.sh' "$PREFLIGHT_SCRIPT"

log "Checking tracked files for secret-like paths"
secret_like_paths="$(git -C "$ROOT_DIR" ls-files \
	| rg -n '(^|/)\.env($|\.[^.]+$)|(^|/)\.dev\.vars$|(^|/)(secret|secrets|credential|credentials)\.(json|ya?ml|toml|ini|txt)$|\.(pem|key|p12|pfx)$|(^|/)id_(rsa|ed25519)$' \
	| rg -v '(^|/)\.env\.example$' || true)"
if [[ -n "$secret_like_paths" ]]; then
	printf '%s\n' "$secret_like_paths"
	fail "Tracked secret-like file paths detected"
fi

log "Boundary validation completed successfully"

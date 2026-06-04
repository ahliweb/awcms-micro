#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BOUNDARIES_DOC="$ROOT_DIR/docs/awcms-micro-implementation-boundaries.md"
ALLOWLIST_FILE="$SCRIPT_DIR/awcmsmicro-dev-protected-paths.txt"
DIVERGENCE_LOG="$ROOT_DIR/docs/upstream-sync/DIVERGENCE_LOG.md"
RUNTIME_PREREQS_SCRIPT="$SCRIPT_DIR/check-runtime-prereqs.sh"
SYNC_SCRIPT="$SCRIPT_DIR/update-awcmsmicro-dev.sh"
PREFLIGHT_SCRIPT="$SCRIPT_DIR/sync-preflight-checklist.sh"
VALIDATION_SCRIPT="$SCRIPT_DIR/validate-awcmsmicro-dev.sh"
COMBINED_SCRIPT="$SCRIPT_DIR/sync-and-validate-awcmsmicro-dev.sh"

REQUIRED_PATHS=(
	"templates/awcms-micro-default"
	"templates/awcms-micro-default-cloudflare"
	"packages/plugins/awcms-micro-sikesra"
	"packages/plugins/awcms-micro-docs"
	"packages/plugins/awcms-micro-gallery"
	"demos/awcms-micro-cloudflare"
	"docs/awcms-micro"
	"docs/package.json"
	"packages/blocks/playground/package.json"
	"templates/awcms-micro-default/data.db"
	"e2e/awcms-micro"
	".awcms-changesets"
	".awcms-patches"
	".changeset"
	".github/workflows"
	".github/scripts"
	".github/dependabot.yml"
	"pnpm-workspace.yaml"
	"infra/perf-monitor/package.json"
	"AGENTS.md"
)

ADMIN_NAV_PERSISTENCE_PATHS=(
	"packages/admin/src/components/Sidebar.tsx"
	"packages/admin/src/components/Shell.tsx"
	"packages/admin/src/components/AdminCommandPalette.tsx"
	"packages/admin/src/components/WelcomeModal.tsx"
	"packages/admin/tests/components/Sidebar.test.tsx"
	"packages/admin/tests/components/AdminCommandPalette.test.tsx"
	"packages/admin/tests/components/WelcomeModal.test.tsx"
	"AGENTS.md"
)

LOCAL_STATE_PATHS=(
	".env"
	".env.age"
)

LOCAL_STATE_DOCS=(
	"$ROOT_DIR/README.md"
	"$ROOT_DIR/docs/awcmsmicro-dev-protected-paths.md"
	"$ROOT_DIR/docs/repository-structure.md"
	"$ROOT_DIR/docs/implementation-instructions.md"
	"$ROOT_DIR/docs/operator-workflow.md"
	"$ROOT_DIR/docs/synchronization-workflow.md"
)

ROOT_DOCS=(
	"$ROOT_DIR/README.md"
	"$ROOT_DIR/docs/README.md"
	"$ROOT_DIR/docs/awcmsmicro-dev-protected-paths.md"
	"$ROOT_DIR/docs/repository-structure.md"
	"$ROOT_DIR/docs/synchronization-workflow.md"
	"$ROOT_DIR/docs/implementation-instructions.md"
)

PATH_REFERENCE_DOCS=(
	"$ROOT_DIR/docs/awcms-micro-implementation-boundaries.md"
	"$ROOT_DIR/docs/awcmsmicro-dev-protected-paths.md"
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

patch_target_paths() {
	local patch_file
	shopt -s nullglob
	for patch_file in "$ROOT_DIR"/awcmsmicro-dev/.awcms-patches/*.patch; do
		while IFS= read -r patch_line; do
			if [[ "$patch_line" =~ ^diff[[:space:]]--git[[:space:]]a/([^[:space:]]+) ]]; then
				printf '%s\n' "${BASH_REMATCH[1]}"
			fi
		done < "$patch_file"
	done
	shopt -u nullglob
}

is_patch_target_path() {
	local candidate="$1"
	local target
	while IFS= read -r target; do
		if [[ "$candidate" == "$target" ]]; then
			return 0
		fi
	done < <(patch_target_paths)
	return 1
}

check_unprotected_downstream_drift() {
	local rsync_args=()
	local relative_path
	while IFS= read -r relative_path || [[ -n "$relative_path" ]]; do
		if [[ -z "$relative_path" || "$relative_path" == \#* ]]; then
			continue
		fi
		rsync_args+=("--exclude=$relative_path")
	done < "$ALLOWLIST_FILE"

	local drift_output
	drift_output="$(rsync -anic --delete \
		--exclude='.git' \
		--exclude='node_modules' \
		--exclude='dist' \
		--exclude='.astro' \
		--exclude='.wrangler' \
		--exclude='.vite' \
		--exclude='.mf' \
		"${rsync_args[@]}" \
		"$ROOT_DIR/emdash-latest/" "$ROOT_DIR/awcmsmicro-dev/")"

	local line
	while IFS= read -r line; do
		local itemized_change
		if [[ -z "$line" ]]; then
			continue
		fi

		if [[ "$line" =~ ^\*deleting[[:space:]]+(.+)$ ]]; then
			relative_path="${BASH_REMATCH[1]}"
			if git -C "$ROOT_DIR" ls-files --error-unmatch "awcmsmicro-dev/$relative_path" >/dev/null 2>&1; then
				fail "Tracked unprotected downstream-only path would be deleted on rebuild: awcmsmicro-dev/$relative_path"
			fi
			continue
		fi

		if [[ "$line" =~ ^.{11}[[:space:]]+(.+)$ ]]; then
			itemized_change="${line:0:11}"
			relative_path="${BASH_REMATCH[1]}"
			if [[ "$itemized_change" != '>'* ]]; then
				continue
			fi
			if [[ "$itemized_change" != *c* && "$itemized_change" != *s* ]]; then
				continue
			fi
			if is_patch_target_path "$relative_path"; then
				continue
			fi
			fail "Unprotected downstream content drift is not covered by a patch overlay: awcmsmicro-dev/$relative_path"
		fi
	done <<< "$drift_output"
}

check_patch_overlays_apply() { (
	local patch_check_dir
	patch_check_dir="$(mktemp -d)"
	trap 'rm -rf "$patch_check_dir"' EXIT

	rsync -a \
		--delete \
		--exclude='.git' \
		--exclude='node_modules' \
		--exclude='dist' \
		--exclude='.astro' \
		--exclude='.wrangler' \
		--exclude='.vite' \
		--exclude='.mf' \
		"$ROOT_DIR/emdash-latest/" "$patch_check_dir/"

	local patch_file_path
	for patch_file_path in "${patch_overlay_files[@]}"; do
		(
			cd "$patch_check_dir"
			git apply --check --whitespace=nowarn "$patch_file_path"
			git apply --whitespace=nowarn "$patch_file_path"
		) || fail "Patch overlay does not apply cleanly to current emdash-latest: $(basename "$patch_file_path")"
	done
); }

check_docs_index_coverage() {
	python3 - "$ROOT_DIR/docs" <<'PY'
from pathlib import Path
import sys

docs_dir = Path(sys.argv[1])
index_path = docs_dir / "README.md"
index_text = index_path.read_text()
missing = []

for path in sorted(docs_dir.rglob("*.md")):
    if path == index_path:
        continue
    relative_path = path.relative_to(docs_dir).as_posix()
    if relative_path not in index_text and f"`{relative_path}`" not in index_text:
        missing.append(relative_path)

if missing:
    print("Docs missing from docs/README.md:", file=sys.stderr)
    for relative_path in missing:
        print(f"- {relative_path}", file=sys.stderr)
    raise SystemExit(1)
PY
}

if [[ "${AWCMS_RUNTIME_PREREQS_CHECKED:-0}" != "1" ]]; then
	bash "$ROOT_DIR/scripts/check-runtime-prereqs.sh"
	export AWCMS_RUNTIME_PREREQS_CHECKED=1
fi

require_dir "$ROOT_DIR/emdash-latest"
require_dir "$ROOT_DIR/awcmsmicro-dev"
require_file "$BOUNDARIES_DOC"
require_file "$ALLOWLIST_FILE"
require_file "$DIVERGENCE_LOG"
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
log "Checking documentation index coverage"
check_docs_index_coverage

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
	require_contains "$relative_path" "$ROOT_DIR/docs/awcmsmicro-dev-protected-paths.md"
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

log "Checking downstream patch overlay records"
require_contains ".awcms-patches" "$BOUNDARIES_DOC"
require_contains ".awcms-patches" "$ALLOWLIST_FILE"
require_contains ".awcms-patches" "$ROOT_DIR/docs/awcmsmicro-dev-protected-paths.md"
shopt -s nullglob
patch_overlay_files=("$ROOT_DIR"/awcmsmicro-dev/.awcms-patches/*.patch)
shopt -u nullglob
for patch_file_path in "${patch_overlay_files[@]}"; do
	patch_file="$(basename "$patch_file_path")"
	require_file "$patch_file_path"
	require_contains "$patch_file" "$DIVERGENCE_LOG"
done
log "Checking downstream patch overlays apply cleanly"
check_patch_overlays_apply

if [[ "${AWCMS_SKIP_UNPROTECTED_DRIFT_CHECK:-0}" == "1" ]]; then
	log "Skipping unprotected downstream drift check for pre-sync overwrite path"
else
	log "Checking unprotected downstream drift"
	check_unprotected_downstream_drift
fi

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

log "Checking tracked files for temporary artifacts"
temporary_artifact_paths="$(git -C "$ROOT_DIR" ls-files 'awcmsmicro-dev/*' \
	| rg '(^|/)(tmp|temp)([-_.][^/]*)?\.[^/]+$|(~$|\.bak$|\.orig$|\.rej$|\.tmp$|\.swp$)' \
	| while IFS= read -r relative_path; do
		[[ -e "$ROOT_DIR/$relative_path" ]] && printf '%s\n' "$relative_path"
	done || true)"
if [[ -n "$temporary_artifact_paths" ]]; then
	printf '%s\n' "$temporary_artifact_paths"
	fail "Tracked temporary artifact paths detected"
fi

log "Boundary validation completed successfully"

#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
MODE="continuation"

REQUIRED_FILES=(
	"README.md"
	"AGENTS.md"
	"docs/README.md"
	"docs/synchronization-workflow.md"
	"docs/implementation-instructions.md"
	"docs/awcms-micro-implementation-boundaries.md"
	"docs/repository-structure.md"
	"docs/operator-workflow.md"
	"scripts/awcmsmicro-dev-protected-paths.txt"
	"scripts/update-emdash-latest.sh"
	"scripts/update-awcmsmicro-dev.sh"
	"scripts/validate-awcmsmicro-dev.sh"
	"scripts/sync-and-validate-awcmsmicro-dev.sh"
	"scripts/validate-awcmsmicro-boundaries.sh"
)

while [[ $# -gt 0 ]]; do
	case "$1" in
		--fresh-clone)
			MODE="fresh-clone"
			;;
		--continuation|--continue)
			MODE="continuation"
			;;
		--mode)
			shift
			[[ $# -gt 0 ]] || {
				printf '%s\n' '[sync preflight] ERROR: --mode requires a value' >&2
				exit 1
			}
			MODE="$1"
			;;
		*)
			printf '%s\n' "[sync preflight] ERROR: Unknown argument: $1" >&2
			exit 1
			;;
	esac
	shift
done

fail() {
	printf '%s\n' "[sync preflight] ERROR: $1" >&2
	exit 1
}

for relative_path in "${REQUIRED_FILES[@]}"; do
	if [[ ! -e "$ROOT_DIR/$relative_path" ]]; then
		fail "Missing required file: $relative_path"
	fi
done

if [[ "$MODE" == "fresh-clone" ]]; then
	if [[ ! -e "$ROOT_DIR/.env" && ! -e "$ROOT_DIR/awcmsmicro-dev/.env" && ! -e "$ROOT_DIR/scripts/backup/.backup-config" && ! -e "$ROOT_DIR/scripts/backup/.backup-config.age" ]]; then
		fail "Fresh-clone mode requires local config bootstrap files (.env, awcmsmicro-dev/.env, or scripts/backup/.backup-config[.age]) before sync"
	fi
	printf '%s\n' '[sync preflight] Fresh-clone mode selected: verify GitHub and Cloudflare config bootstrap before sync.'
	printf '%s\n' '[sync preflight] Required values should be prepared in local .env files or backup config before proceeding.'
else
	printf '%s\n' '[sync preflight] Continuation mode selected: proceeding with existing workspace configuration.'
fi

printf '%s\n' '[sync preflight] Checklist'
printf '%s\n' '[sync preflight] 1. Confirm upstream/downstream analysis is complete.'
printf '%s\n' '[sync preflight] 2. Confirm required script or validation updates are applied first.'
printf '%s\n' '[sync preflight] 3. Confirm protected paths, docs, and local config bootstrap match the intended downstream changes.'
printf '%s\n' '[sync preflight] 4. Confirm rebuild and validation are safe to run.'
printf '%s\n' "[sync preflight] Workspace: $ROOT_DIR"

bash "$ROOT_DIR/scripts/validate-awcmsmicro-boundaries.sh"

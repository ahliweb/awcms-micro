#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

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

fail() {
	printf '%s\n' "[sync preflight] ERROR: $1" >&2
	exit 1
}

for relative_path in "${REQUIRED_FILES[@]}"; do
	if [[ ! -e "$ROOT_DIR/$relative_path" ]]; then
		fail "Missing required file: $relative_path"
	fi
done

printf '%s\n' '[sync preflight] Checklist'
printf '%s\n' '[sync preflight] 1. Confirm upstream/downstream analysis is complete.'
printf '%s\n' '[sync preflight] 2. Confirm required script or validation updates are applied first.'
printf '%s\n' '[sync preflight] 3. Confirm protected paths and docs match the intended downstream changes.'
printf '%s\n' '[sync preflight] 4. Confirm rebuild and validation are safe to run.'
printf '%s\n' "[sync preflight] Workspace: $ROOT_DIR"

bash "$ROOT_DIR/scripts/validate-awcmsmicro-boundaries.sh"

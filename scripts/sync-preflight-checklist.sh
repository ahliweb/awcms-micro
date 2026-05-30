#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
MODE="continuation"
LOCAL_BOOTSTRAP_FILE="$ROOT_DIR/awcmsmicro-dev/.env"

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

if [[ "${AWCMS_RUNTIME_PREREQS_CHECKED:-0}" != "1" ]]; then
	bash "$ROOT_DIR/scripts/check-runtime-prereqs.sh"
	export AWCMS_RUNTIME_PREREQS_CHECKED=1
fi

persist_local_value() {
	local key="$1"
	local value="$2"
	local file="$3"

	mkdir -p "$(dirname "$file")"
	python3 - "$file" "$key" "$value" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
key = sys.argv[2]
value = sys.argv[3]
prefix = f"{key}="
lines = path.read_text().splitlines() if path.exists() else []
out = []
found = False
for line in lines:
    if line.startswith(prefix):
        out.append(f"{prefix}{value}")
        found = True
    else:
        out.append(line)
if not found:
    out.append(f"{prefix}{value}")
path.write_text("\n".join(out) + ("\n" if out else ""))
PY
}

prompt_fresh_clone_bootstrap() {
	local template_name="${AWCMSMICRO_TEMPLATE_NAME:-}"
	local built_in_plugins="${AWCMSMICRO_USE_BUILTIN_PLUGINS:-}"

	if [[ -z "$template_name" ]]; then
		if [[ ! -t 0 ]]; then
			fail "Fresh-clone mode requires AWCMSMICRO_TEMPLATE_NAME to be set in awcmsmicro-dev/.env or the environment"
		fi
		printf '%s' '[sync preflight] Enter a new template folder name (avoid awcms-micro-default and awcms-micro-default-cloudflare): '
		read -r template_name
	fi

	if [[ -z "$template_name" ]]; then
		fail "Template name cannot be empty"
	fi
	case "$template_name" in
		awcms-micro-default|awcms-micro-default-cloudflare)
			fail "Template name must not collide with the built-in AWCMS-Micro template folders"
			;;
	esac
	if [[ ! "$template_name" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
		fail "Template name must use lowercase letters, numbers, and hyphens only"
	fi

	if [[ -z "$built_in_plugins" ]]; then
		if [[ ! -t 0 ]]; then
			fail "Fresh-clone mode requires AWCMSMICRO_USE_BUILTIN_PLUGINS to be set in awcmsmicro-dev/.env or the environment"
		fi
		printf '%s' '[sync preflight] Use built-in plugins for this template? [y/N]: '
		read -r built_in_plugins
	fi

	case "${built_in_plugins,,}" in
		y|yes|true|1)
			built_in_plugins="true"
			;;
		""|n|no|false|0)
			built_in_plugins="false"
			;;
		*)
			fail "Use built-in plugins answer must be yes or no"
			;;
	esac

	export AWCMSMICRO_TEMPLATE_NAME="$template_name"
	export AWCMSMICRO_USE_BUILTIN_PLUGINS="$built_in_plugins"
	persist_local_value "AWCMSMICRO_TEMPLATE_NAME" "$template_name" "$LOCAL_BOOTSTRAP_FILE"
	persist_local_value "AWCMSMICRO_USE_BUILTIN_PLUGINS" "$built_in_plugins" "$LOCAL_BOOTSTRAP_FILE"

	printf '%s\n' "[sync preflight] Fresh-clone template name set to: $template_name"
	printf '%s\n' "[sync preflight] Built-in plugins enabled: $built_in_plugins"
}

for relative_path in "${REQUIRED_FILES[@]}"; do
	if [[ ! -e "$ROOT_DIR/$relative_path" ]]; then
		fail "Missing required file: $relative_path"
	fi
done

if [[ "$MODE" == "fresh-clone" ]]; then
	prompt_fresh_clone_bootstrap
	if [[ ! -e "$ROOT_DIR/.env" && ! -e "$ROOT_DIR/awcmsmicro-dev/.env" && ! -e "$ROOT_DIR/scripts/backup/.backup-config" && ! -e "$ROOT_DIR/scripts/backup/.backup-config.age" ]]; then
		fail "Fresh-clone mode still requires local GitHub/Cloudflare bootstrap config (.env or scripts/backup/.backup-config[.age]) before sync"
	fi
	printf '%s\n' '[sync preflight] Fresh-clone mode selected: verify GitHub and Cloudflare config bootstrap before sync.'
	printf '%s\n' '[sync preflight] Required values should be prepared in local .env files or backup config before proceeding.'
else
	printf '%s\n' '[sync preflight] Continuation mode selected: proceeding with existing workspace configuration.'
fi

printf '%s\n' '[sync preflight] Checklist'
printf '%s\n' '[sync preflight] 1. Confirm upstream/downstream analysis is complete.'
printf '%s\n' '[sync preflight] 2. Confirm required script or validation updates are applied first.'
printf '%s\n' '[sync preflight] 3. Confirm protected paths, docs, local config bootstrap, and fresh-clone template/plugin choices match the intended downstream changes.'
printf '%s\n' '[sync preflight] 4. Confirm rebuild and validation are safe to run.'
printf '%s\n' "[sync preflight] Workspace: $ROOT_DIR"

bash "$ROOT_DIR/scripts/validate-awcmsmicro-boundaries.sh"

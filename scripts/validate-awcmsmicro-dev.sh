#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE_DIR="$ROOT_DIR/awcmsmicro-dev"
REPORT_FILE="$ROOT_DIR/docs/upstream-sync/LAST_VALIDATION.md"
FETCH_METADATA_FILE="$ROOT_DIR/docs/upstream-sync/LAST_UPSTREAM_FETCH.md"

if [[ ! -d "$WORKSPACE_DIR" ]]; then
	echo "Missing workspace directory: $WORKSPACE_DIR" >&2
	exit 1
fi

if [[ "${AWCMS_RUNTIME_PREREQS_CHECKED:-0}" != "1" ]]; then
	bash "$ROOT_DIR/scripts/check-runtime-prereqs.sh"
	export AWCMS_RUNTIME_PREREQS_CHECKED=1
fi

mkdir -p "$(dirname "$REPORT_FILE")"

STARTED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
BRANCH_NAME="$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || printf 'unknown')"
OPERATOR_NAME="${SYNC_OPERATOR:-${USER:-unknown}}"
TMP_OUTPUT="$(mktemp)"
STATUS="Running"
FAILURE_CATEGORY="None"
CURRENT_STEP="Not started"
REPORT_TMP="$(mktemp)"
TERMINATING="0"

cleanup() {
	rm -f "$TMP_OUTPUT"
	rm -f "$REPORT_TMP"
}

read_upstream_sha() {
	local path="$1"
	if [[ -f "$path" ]]; then
		python3 - "$path" <<'PY'
from pathlib import Path
import re
import sys

text = Path(sys.argv[1]).read_text()
match = re.search(r"^\s*- Upstream commit SHA: (.+)$", text, re.M)
print(match.group(1) if match else "unknown")
PY
	else
		printf 'unknown'
	fi
}

UPSTREAM_SHA="$(read_upstream_sha "$FETCH_METADATA_FILE")"

trap cleanup EXIT

write_report() {
	local completed_at="$1"
	local normalized_output
	normalized_output="$(sed -E 's/[[:space:]]+$//' "$TMP_OUTPUT")"
	cat >"$REPORT_TMP" <<EOF
# Last Validation

## Validation Run Metadata

- Date:
  - Started: $STARTED_AT
  - Completed: $completed_at
- Operator: $OPERATOR_NAME
- Branch: \`$BRANCH_NAME\`
- Upstream commit SHA: \`$UPSTREAM_SHA\`
- Validation scope: \`awcmsmicro-dev\` workspace validation

## Commands

\`\`\`bash
bash scripts/validate-awcmsmicro-dev.sh
bash -n scripts/update-emdash-latest.sh
bash -n scripts/update-awcmsmicro-dev.sh
bash -n scripts/validate-awcmsmicro-dev.sh
bash -n scripts/sync-and-validate-awcmsmicro-dev.sh
\`\`\`

## Result Summary

- Overall status: $STATUS
- Notes: Current step: $CURRENT_STEP

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | $( [[ "$FAILURE_CATEGORY" == "Script failure" ]] && printf 'Failed' || printf 'Not triggered' ) | Validation wrapper or shell orchestration failure |
| Dependency install failure | $( [[ "$FAILURE_CATEGORY" == "Dependency install failure" ]] && printf 'Failed' || printf 'Not triggered' ) | \`pnpm install\` failed |
| Upstream EmDash test failure | $( [[ "$FAILURE_CATEGORY" == "Upstream EmDash test failure" ]] && printf 'Failed' || printf 'Not triggered' ) | \`pnpm --filter @emdash-cms/admin exec node --run locale:compile\` or \`pnpm test\` failed |
| AWCMS-Micro added file failure | $( [[ "$FAILURE_CATEGORY" == "AWCMS-Micro added file failure" ]] && printf 'Failed' || printf 'Not triggered' ) | \`pnpm --filter emdash build\`, \`pnpm typecheck\`, \`pnpm lint:quick\`, or \`pnpm build\` failed |

## Detailed Output

\`\`\`text
$normalized_output
\`\`\`
EOF
	mv "$REPORT_TMP" "$REPORT_FILE"
}

finalize_report() {
	local completed_at
	completed_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
	write_report "$completed_at"
}

handle_termination() {
	if [[ "$TERMINATING" == "1" ]]; then
		exit 1
	fi
	TERMINATING="1"
	trap - TERM INT
	STATUS="Failed"
	if [[ "$FAILURE_CATEGORY" == "None" ]]; then
		FAILURE_CATEGORY="Script failure"
	fi
	CURRENT_STEP="$CURRENT_STEP (terminated)"
	finalize_report
	exit 1
}

trap handle_termination TERM INT

run_step() {
	local name="$1"
	local category="$2"
	shift 2

	CURRENT_STEP="$name"
	printf '$ %s\n' "$*" >>"$TMP_OUTPUT"
	echo "==> $name" >>"$TMP_OUTPUT"

	set +e
	(
		cd "$WORKSPACE_DIR"
		"$@"
	) >>"$TMP_OUTPUT" 2>&1
	local exit_code=$?
	set -e

	if [[ $exit_code -ne 0 ]]; then
		STATUS="Failed"
		FAILURE_CATEGORY="$category"
		finalize_report
		echo "Validation failed: $FAILURE_CATEGORY" >&2
		exit "$exit_code"
	fi

	finalize_report
}

finalize_report

run_step "pnpm-install" "Dependency install failure" bash -lc 'rm -rf node_modules && pnpm install --frozen-lockfile'
run_step "pnpm-build-emdash" "AWCMS-Micro added file failure" pnpm --filter emdash build
run_step "pnpm-build-registry-lexicons" "AWCMS-Micro added file failure" pnpm --filter @emdash-cms/registry-lexicons build
run_step "pnpm-build-workspace" "AWCMS-Micro added file failure" pnpm build
run_step "pnpm-typecheck" "AWCMS-Micro added file failure" pnpm typecheck
run_step "pnpm-lint-quick" "AWCMS-Micro added file failure" pnpm lint:quick
run_step "pnpm-admin-locale-compile" "Upstream EmDash test failure" pnpm --filter @emdash-cms/admin exec node --run locale:compile
run_step "playwright-install-chromium" "Upstream EmDash test failure" pnpm --filter @emdash-cms/admin exec playwright install chromium
export EMDASH_WORKERD_PLUGIN_PORT_BASE=28000
run_step "pnpm-test" "Upstream EmDash test failure" pnpm test

STATUS="Passed"
CURRENT_STEP="Completed"
finalize_report

cat "$REPORT_FILE"

echo "Validation completed successfully."

#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE_DIR="$ROOT_DIR/awcmsmicro-dev"
REPORT_FILE="$ROOT_DIR/docs/upstream-sync/LAST_VALIDATION.md"

if [[ ! -d "$WORKSPACE_DIR" ]]; then
	echo "Missing workspace directory: $WORKSPACE_DIR" >&2
	exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
	echo "Missing required command: pnpm" >&2
	exit 1
fi

mkdir -p "$(dirname "$REPORT_FILE")"

STARTED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
BRANCH_NAME="$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || printf 'unknown')"
UPSTREAM_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD:emdash-latest 2>/dev/null || printf 'unknown')"
TMP_OUTPUT="$(mktemp)"
STATUS="Running"
FAILURE_CATEGORY="None"
CURRENT_STEP="Not started"

cleanup() {
	rm -f "$TMP_OUTPUT"
}

trap cleanup EXIT

write_report() {
	local completed_at="$1"
	cat >"$REPORT_FILE" <<EOF
# Last Validation

## Validation Run Metadata

- Date:
  - Started: \
    \
    $STARTED_AT
  - Completed: \
    \
    $completed_at
- Operator: \
  - Placeholder: update manually if needed
- Branch: \
  - $BRANCH_NAME
- Upstream commit SHA: \
  - $UPSTREAM_SHA
- Validation scope: \
  - \
    awcmsmicro-dev workspace validation

## Commands

```bash
bash scripts/validate-awcmsmicro-dev.sh
bash -n scripts/update-emdash-latest.sh
bash -n scripts/update-awcmsmicro-dev.sh
bash -n scripts/validate-awcmsmicro-dev.sh
bash -n scripts/sync-and-validate-awcmsmicro-dev.sh
```

## Result Summary

- Overall status: \
  - $STATUS
- Notes: \
  - Current step: $CURRENT_STEP

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | $( [[ "$FAILURE_CATEGORY" == "Script failure" ]] && printf 'Failed' || printf 'Not triggered' ) | Validation wrapper or shell orchestration failure |
| Dependency install failure | $( [[ "$FAILURE_CATEGORY" == "Dependency install failure" ]] && printf 'Failed' || printf 'Not triggered' ) | \
  \
  \
  \
  \
  `pnpm install` failed |
| Upstream EmDash test failure | $( [[ "$FAILURE_CATEGORY" == "Upstream EmDash test failure" ]] && printf 'Failed' || printf 'Not triggered' ) | `pnpm test` failed |
| AWCMS-Micro added file failure | $( [[ "$FAILURE_CATEGORY" == "AWCMS-Micro added file failure" ]] && printf 'Failed' || printf 'Not triggered' ) | `pnpm typecheck`, `pnpm lint:quick`, or `pnpm build` failed |

## Detailed Output

```text
$(cat "$TMP_OUTPUT")
```
EOF
}

finalize_report() {
	local completed_at
	completed_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
	write_report "$completed_at"
}

handle_termination() {
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

run_step "pnpm-install" "Dependency install failure" pnpm install
run_step "pnpm-typecheck" "AWCMS-Micro added file failure" pnpm typecheck
run_step "pnpm-lint-quick" "AWCMS-Micro added file failure" pnpm lint:quick
run_step "pnpm-test" "Upstream EmDash test failure" pnpm test
run_step "pnpm-build" "AWCMS-Micro added file failure" pnpm build

STATUS="Passed"
CURRENT_STEP="Completed"
finalize_report

cat "$REPORT_FILE"

echo "Validation completed successfully."

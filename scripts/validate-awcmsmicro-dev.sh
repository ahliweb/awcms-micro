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

run_step() {
	local name="$1"
	shift
	echo "==> $name"
	"$@"
}

STARTED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
BRANCH_NAME="$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || printf 'unknown')"
UPSTREAM_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD:emdash-latest 2>/dev/null || printf 'unknown')"
TMP_OUTPUT="$(mktemp)"
STATUS="Passed"
FAILURE_CATEGORY="None"

cleanup() {
	rm -f "$TMP_OUTPUT"
}

trap cleanup EXIT

{
	echo "$ run_step pnpm-install pnpm install"
	(
		cd "$WORKSPACE_DIR"
		run_step pnpm-install pnpm install
	)

	echo "$ run_step pnpm-typecheck pnpm typecheck"
	(
		cd "$WORKSPACE_DIR"
		run_step pnpm-typecheck pnpm typecheck
	)

	echo "$ run_step pnpm-lint-quick pnpm lint:quick"
	(
		cd "$WORKSPACE_DIR"
		run_step pnpm-lint-quick pnpm lint:quick
	)

	echo "$ run_step pnpm-test pnpm test"
	(
		cd "$WORKSPACE_DIR"
		run_step pnpm-test pnpm test
	)

	echo "$ run_step pnpm-build pnpm build"
	(
		cd "$WORKSPACE_DIR"
		run_step pnpm-build pnpm build
	)
	} >"$TMP_OUTPUT" 2>&1 || {
		STATUS="Failed"
		if grep -q "pnpm install" "$TMP_OUTPUT"; then
			FAILURE_CATEGORY="Dependency install failure"
		elif grep -q "pnpm test" "$TMP_OUTPUT"; then
			FAILURE_CATEGORY="Upstream EmDash test failure"
		elif grep -q "pnpm typecheck\|pnpm lint:quick\|pnpm build" "$TMP_OUTPUT"; then
			FAILURE_CATEGORY="AWCMS-Micro added file failure"
		else
			FAILURE_CATEGORY="Script failure"
		fi
	}

COMPLETED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cat >"$REPORT_FILE" <<EOF
# Last Validation

## Validation Run Metadata

- Date: \
  - Started: \
    \
    $STARTED_AT
  - Completed: \
    \
    $COMPLETED_AT
- Operator: \
  - Placeholder: update manually if needed
- Branch: \
  - $BRANCH_NAME
- Upstream commit SHA: \
  - $UPSTREAM_SHA
- Validation scope: \
  - \
    \
    Rebuilt \
    \
    \
    \
    \
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
  - See detailed output below

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | $( [[ "$FAILURE_CATEGORY" == "Script failure" ]] && printf 'Failed' || printf 'Not triggered' ) | Validation wrapper or shell orchestration failure |
| Dependency install failure | $( [[ "$FAILURE_CATEGORY" == "Dependency install failure" ]] && printf 'Failed' || printf 'Not triggered' ) | `pnpm install` failed |
| Upstream EmDash test failure | $( [[ "$FAILURE_CATEGORY" == "Upstream EmDash test failure" ]] && printf 'Failed' || printf 'Not triggered' ) | `pnpm test` failed |
| AWCMS-Micro added file failure | $( [[ "$FAILURE_CATEGORY" == "AWCMS-Micro added file failure" ]] && printf 'Failed' || printf 'Not triggered' ) | `pnpm typecheck`, `pnpm lint:quick`, or `pnpm build` failed |

## Detailed Output

```text
$(cat "$TMP_OUTPUT")
```
EOF

cat "$REPORT_FILE"

if [[ "$STATUS" != "Passed" ]]; then
	echo "Validation failed: $FAILURE_CATEGORY" >&2
	exit 1
fi

echo "Validation completed successfully."

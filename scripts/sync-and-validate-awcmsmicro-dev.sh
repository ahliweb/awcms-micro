#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
STATUS_FILE="$ROOT_DIR/docs/upstream-sync/UPSTREAM_SYNC_STATUS.md"

bash "$ROOT_DIR/scripts/update-emdash-latest.sh"
bash "$ROOT_DIR/scripts/update-awcmsmicro-dev.sh"
bash "$ROOT_DIR/scripts/validate-awcmsmicro-dev.sh"

UPSTREAM_SHA="$(git -C "$ROOT_DIR" rev-parse HEAD:emdash-latest 2>/dev/null || printf 'TBD')"
SYNC_DATE="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

if [[ -f "$STATUS_FILE" ]]; then
	python3 - <<'PY' "$STATUS_FILE" "$UPSTREAM_SHA" "$SYNC_DATE"
from pathlib import Path
import re
import sys

status_file = Path(sys.argv[1])
sha = sys.argv[2]
sync_date = sys.argv[3]
text = status_file.read_text()
text = re.sub(r"- Upstream commit SHA: `[^`]*`", f"- Upstream commit SHA: `{sha}`", text, count=1)
text = re.sub(r"- Sync date: `[^`]*`", f"- Sync date: `{sync_date}`", text, count=1)
text = text.replace("| Upstream fetch into `emdash-latest/` | Pending | Update after sync |", "| Upstream fetch into `emdash-latest/` | Passed | Refreshed by sync-and-validate script |", 1)
text = text.replace("| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Pending | Update after sync |", "| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt by sync-and-validate script |", 1)
text = re.sub(r"\| Validation script execution \| [^|]+ \| [^\n]+ \|", "| Validation script execution | Passed | See `LAST_VALIDATION.md` |", text, count=1)
status_file.write_text(text)
PY
else
	echo "Missing status file: $STATUS_FILE" >&2
	exit 1
fi

echo "Sync and validation workflow completed."

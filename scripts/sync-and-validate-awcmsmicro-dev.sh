#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
STATUS_FILE="$ROOT_DIR/docs/upstream-sync/UPSTREAM_SYNC_STATUS.md"
FETCH_METADATA_FILE="$ROOT_DIR/docs/upstream-sync/LAST_UPSTREAM_FETCH.md"

bash "$ROOT_DIR/scripts/update-emdash-latest.sh"
bash "$ROOT_DIR/scripts/update-awcmsmicro-dev.sh"
bash "$ROOT_DIR/scripts/validate-awcmsmicro-dev.sh"

UPSTREAM_SHA="$(python3 - "$FETCH_METADATA_FILE" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
if not path.exists():
    print("TBD")
    raise SystemExit(0)

text = path.read_text()
match = re.search(r"^\s*- Upstream commit SHA: (.+)$", text, re.M)
print(match.group(1) if match else "TBD")
PY
)"
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
text = re.sub(r"Synced to EmDash `[^`]+`\.", f"Synced to EmDash `{sha[:8]}`.", text, count=1)
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

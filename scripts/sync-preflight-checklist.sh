#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

printf '%s\n' '[sync preflight] Checklist'
printf '%s\n' '[sync preflight] 1. Confirm upstream/downstream analysis is complete.'
printf '%s\n' '[sync preflight] 2. Confirm required script or validation updates are applied first.'
printf '%s\n' '[sync preflight] 3. Confirm protected paths and docs match the intended downstream changes.'
printf '%s\n' '[sync preflight] 4. Confirm rebuild and validation are safe to run.'
printf '%s\n' "[sync preflight] Workspace: $ROOT_DIR"

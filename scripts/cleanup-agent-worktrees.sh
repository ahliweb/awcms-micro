#!/usr/bin/env bash
#
# Remove leftover agent worktrees under `.claude/worktrees/`.
#
# WHY THIS NEEDS sudo
# -------------------
# Parallel agents run integration tests against a throwaway PostgreSQL
# container. Anything the container writes into the mounted worktree —
# `var/reporting-exports/**/*.csv`, for example — is owned by the container's
# root, not by you. `git worktree remove` then fails with EPERM and leaves the
# directory behind even though git has already deregistered the worktree.
#
# Run this from a terminal where you can type your password (the integrated
# VS Code terminal is fine):
#
#   ./scripts/cleanup-agent-worktrees.sh            # show what would be removed
#   ./scripts/cleanup-agent-worktrees.sh --apply    # actually remove it
#
# It never touches anything outside `<repo>/.claude/worktrees/`, and it refuses
# to run if that resolves outside the repository.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREES_DIR="$REPO_ROOT/.claude/worktrees"

APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

# Refuse to operate on a path that is not inside this repository — a symlinked
# or relocated `.claude` must not turn this into `rm -rf` somewhere else.
resolved="$(readlink -f "$WORKTREES_DIR" 2>/dev/null || true)"
if [[ -z "$resolved" ]]; then
  echo "Tidak ada $WORKTREES_DIR — tidak ada yang perlu dibersihkan."
  exit 0
fi
case "$resolved" in
  "$REPO_ROOT"/*) ;;
  *)
    echo "MENOLAK: $WORKTREES_DIR me-resolve ke $resolved, di luar $REPO_ROOT." >&2
    exit 1
    ;;
esac

shopt -s nullglob
targets=("$resolved"/agent-*)
shopt -u nullglob

if [[ ${#targets[@]} -eq 0 ]]; then
  echo "Bersih — tidak ada worktree agent tersisa."
  exit 0
fi

echo "Worktree agent yang tersisa di $resolved:"
for t in "${targets[@]}"; do
  printf '  %-24s %s\n' "$(basename "$t")" "$(du -sh "$t" 2>/dev/null | cut -f1)"
done
echo

if [[ $APPLY -eq 0 ]]; then
  echo "Dry run. Jalankan ulang dengan --apply untuk menghapus."
  exit 0
fi

# Deregister first so git never keeps a record pointing at a path we are about
# to delete; `|| true` because git may already have dropped it (that is the
# normal case here — the removal is what failed, not the deregistration).
for t in "${targets[@]}"; do
  git -C "$REPO_ROOT" worktree remove --force "$t" 2>/dev/null || true
done

for t in "${targets[@]}"; do
  [[ -e "$t" ]] || continue
  if rm -rf "$t" 2>/dev/null; then
    echo "dihapus: $(basename "$t")"
  else
    echo "butuh sudo untuk $(basename "$t") — masukkan password bila diminta:"
    sudo rm -rf "$t"
    echo "dihapus (sudo): $(basename "$t")"
  fi
done

git -C "$REPO_ROOT" worktree prune

echo
echo "Selesai. Sisa worktree terdaftar:"
git -C "$REPO_ROOT" worktree list

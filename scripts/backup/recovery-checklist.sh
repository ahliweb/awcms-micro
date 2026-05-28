#!/usr/bin/env bash
# Disaster Recovery Checklist - Interactive Guide
# Usage: bash scripts/backup/recovery-checklist.sh

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/load-config.sh" ]; then
    source "$SCRIPT_DIR/load-config.sh" 2>/dev/null || true
fi

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          DISASTER RECOVERY CHECKLIST                     ║${NC}"
echo -e "${BLUE}║          AWCMS-Micro Development Environment             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo

# Track progress
TOTAL=0
COMPLETED=0

# Function to show a checklist item
check_item() {
    local description="$1"
    local command="${2:-}"
    local is_critical="${3:-true}"
    TOTAL=$((TOTAL + 1))

    local icon="[ ]"
    local color="$NC"

    if [ -n "$command" ]; then
        if eval "$command" &>/dev/null; then
            icon="[x]"
            color="$GREEN"
            COMPLETED=$((COMPLETED + 1))
        elif [ "$is_critical" = "true" ]; then
            icon="[!]"
            color="$RED"
        else
            icon="[?]"
            color="$YELLOW"
        fi
    fi

    echo -e "  ${color}${icon} $description${NC}"

    if [ -n "$command" ] && ! eval "$command" &>/dev/null; then
        echo -e "      ${YELLOW}→ Need to set this up${NC}"
    fi
}

echo -e "${CYAN}Phase 1: Prerequisites${NC}"
echo "────────────────────────────────────────"
check_item "Git installed" "command -v git"
check_item "Node.js installed" "command -v node"
check_item "pnpm installed" "command -v pnpm"
check_item "age (encryption tool)" "command -v age"
check_item "wrangler CLI" "command -v wrangler"
echo

echo -e "${CYAN}Phase 2: Clone Repository${NC}"
echo "────────────────────────────────────────"
check_item "GitHub repo accessible" "git ls-remote git@github.com:ahliweb/awcms-micro.git &>/dev/null"
check_item "GitLab backup accessible" "git ls-remote \"${GITLAB_REPO_URL:-https://oauth2:${GITLAB_PAT:-token}@gitlab.com/${GITLAB_USERNAME:-username}/${GITLAB_REPO_NAME:-awcms-micro}.git}\" &>/dev/null" false
echo
echo -e "  ${YELLOW}Commands:${NC}"
echo "    git clone git@github.com:ahliweb/awcms-micro.git"
echo "    cd awcms-micro"
echo "    git remote add backup \"${GITLAB_REPO_URL:-https://oauth2:GITLAB_PAT@gitlab.com/username/awcms-micro.git}\""
echo

echo -e "${CYAN}Phase 3: Restore Secrets & Configs${NC}"
echo "────────────────────────────────────────"
check_item "SSH keys exist" "ls ~/.ssh/id_ed25519 2>/dev/null"
check_item "GPG keys exist" "gpg --list-secret-keys 2>/dev/null" false
check_item "GitHub CLI authenticated" "gh auth status 2>/dev/null" false
echo
echo -e "  ${YELLOW}Restore SSH keys from backup:${NC}"
echo "    bash scripts/backup/restore-dotfiles.sh ~/dotfiles-backup-*.age"
echo
echo -e "  ${YELLOW}Or restore manually:${NC}"
echo "    1. Copy SSH keys from password manager"
echo "    2. chmod 600 ~/.ssh/id_ed25519"
echo "    3. ssh-add ~/.ssh/id_ed25519"
echo

echo -e "${CYAN}Phase 4: Restore Environment Variables${NC}"
echo "────────────────────────────────────────"
check_item ".env files exist" "find . -name '.env' -not -name '*.example' | grep -q ." false
check_item "Encrypted .env backups" "find . -name '.env.age' | grep -q ." false
echo
echo -e "  ${YELLOW}Decrypt .env files:${NC}"
echo "    bash scripts/backup/decrypt-env.sh .env.age"
echo "    bash scripts/backup/decrypt-env.sh awcmsmicro-dev/.env.age"
echo

echo -e "${CYAN}Phase 5: Install Dependencies & Build${NC}"
echo "────────────────────────────────────────"
check_item "node_modules installed" "test -d awcmsmicro-dev/node_modules" false
echo
echo -e "  ${YELLOW}Install and build:${NC}"
echo "    cd awcmsmicro-dev"
echo "    pnpm install"
echo "    pnpm build"
echo

echo -e "${CYAN}Phase 6: Restore Databases${NC}"
echo "────────────────────────────────────────"
check_item "D1 databases exist" "wrangler d1 list 2>/dev/null | grep -q ." false
echo
echo -e "  ${YELLOW}Restore database from R2 backup:${NC}"
echo "    # Download backup"
echo "    wrangler r2 object get <bucket>/backups/db/backup-YYYYMMDD-HHMMSS.sql.age"
echo ""
echo "    # Decrypt"
echo "    age --decrypt --output backup.sql backup.sql.age"
echo ""
echo "    # Import to D1"
echo "    wrangler d1 execute <database-name> --file backup.sql --remote"
echo

echo -e "${CYAN}Phase 7: Verify Deployment${NC}"
echo "────────────────────────────────────────"
check_item "Cloudflare Workers deployed" "curl -s https://awcms-micro.ahliweb.workers.dev/ | head -1" false
echo
echo -e "  ${YELLOW}Deploy:${NC}"
echo "    pnpm run deploy"
echo "    # or"
echo "    bash scripts/sync-and-validate-awcmsmicro-dev.sh"
echo

echo -e "${CYAN}Phase 8: Verify GitLab Mirror${NC}"
echo "────────────────────────────────────────"
check_item "GitLab mirror working" "git push backup --dry-run 2>/dev/null" false
echo
echo -e "  ${YELLOW}Verify mirror:${NC}"
echo "    git push --all backup"
echo "    git push --tags backup"
echo

# Summary
echo
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    SUMMARY                               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "  Progress: ${GREEN}$COMPLETED${NC}/${TOTAL} items complete"
echo

if [ $COMPLETED -lt $TOTAL ]; then
    echo -e "${YELLOW}Remaining items need attention before full recovery.${NC}"
    echo -e "${YELLOW}Re-run this script after completing each phase.${NC}"
else
    echo -e "${GREEN}All checks passed! Recovery complete.${NC}"
fi

echo
echo -e "${BLUE}Backup scripts location: scripts/backup/${NC}"
echo -e "  - encrypt-env.sh       Encrypt .env files"
echo -e "  - decrypt-env.sh       Decrypt .env files"
echo -e "  - backup-db.sh         Backup database to R2"
echo -e "  - backup-dotfiles.sh   Backup dotfiles"
echo -e "  - restore-dotfiles.sh  Restore dotfiles"
echo

#!/usr/bin/env bash
# Backup dotfiles and dev configs to encrypted archive
# Usage: bash scripts/backup/backup-dotfiles.sh [options]
#
# Options:
#   --output <file>       Output file (default: ~/dotfiles-backup-YYYYMMDD.tar.gz.age)
#   --encrypt             Encrypt with age (default: true)
#   --no-encrypt          Skip encryption
#   --dry-run             Show what would be backed up
#   --include-secrets     Include SSH/GPG keys (requires extra passphrase)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP="$(date +%Y%m%d)"
TEMP_DIR="/tmp/dotfiles-backup-$(date +%s)"

# Load unified config if available
if [ -f "$SCRIPT_DIR/load-config.sh" ]; then
    source "$SCRIPT_DIR/load-config.sh" 2>/dev/null || true
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Defaults from config or fallbacks
OUTPUT_FILE="${LOCAL_BACKUP_DIR:-/tmp}/dotfiles-backup-${TIMESTAMP}.tar.gz"
ENCRYPT=true
DRY_RUN=false
INCLUDE_SECRETS="${BACKUP_SSH_KEYS:-false}"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --output) OUTPUT_FILE="$2"; shift 2 ;;
        --no-encrypt) ENCRYPT=false; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        --include-secrets) INCLUDE_SECRETS=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Check for age if encryption enabled
if [ "$ENCRYPT" = true ] && ! command -v age &> /dev/null; then
    echo -e "${RED}Error: 'age' is required for encryption. Install: https://github.com/FiloSottile/age${NC}"
    exit 1
fi

# Create temp directory
mkdir -p "$TEMP_DIR/dotfiles"

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

echo -e "${BLUE}Collecting dotfiles and dev configs...${NC}"

# Files to backup (safe configs, no secrets)
SAFE_FILES=(
    "$HOME/.gitconfig"
    "$HOME/.gitignore_global"
    "$HOME/.zshrc"
    "$HOME/.bashrc"
    "$HOME/.bash_profile"
    "$HOME/.vimrc"
    "$HOME/.config/nvim/init.vim"
    "$HOME/.config/nvim/init.lua"
    "$HOME/.config/alacritty/alacritty.toml"
    "$HOME/.config/starship.toml"
    "$HOME/.tmux.conf"
    "$HOME/.editorconfig"
    "$HOME/.prettierrc"
    "$HOME/.eslintrc.js"
    "$HOME/.eslintrc.json"
    "$HOME/.npmrc"
    "$HOME/.nvmrc"
    "$HOME/.python-version"
    "$HOME/.docker/config.json"
    "$HOME/.vscode/extensions.json"
    "$HOME/.vscode/settings.json"
)

# Secret files (optional, requires extra care)
SECRET_FILES=(
    "$HOME/.ssh/config"
    "$HOME/.ssh/id_ed25519"
    "$HOME/.ssh/id_ed25519.pub"
    "$HOME/.ssh/id_rsa"
    "$HOME/.ssh/id_rsa.pub"
    "$HOME/.gnupg/gpg.conf"
    "$HOME/.gnupg/pubring.kbx"
    "$HOME/.aws/config"
    "$HOME/.aws/credentials"
    "$HOME/.config/gcloud/credentials.db"
    "$HOME/.netrc"
    "$HOME/.npmrc"
)

# Collect safe files
COPIED_COUNT=0
for file in "${SAFE_FILES[@]}"; do
    if [ -e "$file" ]; then
        rel_path="${file#$HOME/}"
        dest_dir="$TEMP_DIR/dotfiles/$(dirname "$rel_path")"
        mkdir -p "$dest_dir"
        cp -a "$file" "$dest_dir/"
        echo -e "${GREEN}  + $rel_path${NC}"
        COPIED_COUNT=$((COPIED_COUNT + 1))
    fi
done

# Collect secret files if requested
if [ "$INCLUDE_SECRETS" = true ]; then
    echo -e "${YELLOW}Including secret files (SSH/GPG keys)...${NC}"
    for file in "${SECRET_FILES[@]}"; do
        if [ -e "$file" ]; then
            rel_path="${file#$HOME/}"
            dest_dir="$TEMP_DIR/dotfiles/$(dirname "$rel_path")"
            mkdir -p "$dest_dir"
            cp -a "$file" "$dest_dir/"
            echo -e "${YELLOW}  + $rel_path (secret)${NC}"
            COPIED_COUNT=$((COPIED_COUNT + 1))
        fi
    done
fi

# Create VS Code extensions list
if command -v code &> /dev/null; then
    code --list-extensions > "$TEMP_DIR/dotfiles/vscode-extensions.txt" 2>/dev/null || true
    echo -e "${GREEN}  + VS Code extensions list${NC}"
fi

# Create npm global packages list
if command -v npm &> /dev/null; then
    npm list -g --depth=0 > "$TEMP_DIR/dotfiles/npm-global.txt" 2>/dev/null || true
    echo -e "${GREEN}  + npm global packages list${NC}"
fi

# Create pnpm global packages list
if command -v pnpm &> /dev/null; then
    pnpm list -g --depth=0 > "$TEMP_DIR/dotfiles/pnpm-global.txt" 2>/dev/null || true
    echo -e "${GREEN}  + pnpm global packages list${NC}"
fi

# Create brew list (macOS)
if command -v brew &> /dev/null; then
    brew list > "$TEMP_DIR/dotfiles/brew-list.txt" 2>/dev/null || true
    brew list --cask > "$TEMP_DIR/dotfiles/brew-cask-list.txt" 2>/dev/null || true
    echo -e "${GREEN}  + Homebrew packages list${NC}"
fi

echo
echo -e "${GREEN}Collected $COPIED_COUNT file(s).${NC}"

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN] Would create archive: $OUTPUT_FILE${NC}"
    exit 0
fi

# Create tar archive
echo -e "${BLUE}Creating archive...${NC}"
tar -czf "$TEMP_DIR/dotfiles-backup.tar.gz" -C "$TEMP_DIR" dotfiles

# Encrypt if requested
if [ "$ENCRYPT" = true ]; then
    echo -e "${BLUE}Encrypting archive...${NC}"
    PASSPHRASE="${BACKUP_PASSPHRASE:-}"
    if [ -z "$PASSPHRASE" ] || [ "$PASSPHRASE" = "your-secure-master-passphrase-min-8-chars" ]; then
        read -s -p "Enter passphrase (min 8 chars): " PASSPHRASE
        echo
    fi

    if [ ${#PASSPHRASE} -lt 8 ]; then
        echo -e "${RED}Error: Passphrase must be at least 8 characters.${NC}"
        exit 1
    fi

    ENCRYPTED_FILE="${OUTPUT_FILE}.age"
    echo "$PASSPHRASE" | age --passphrase --output "$ENCRYPTED_FILE" "$TEMP_DIR/dotfiles-backup.tar.gz" 2>/dev/null

    if [ -f "$ENCRYPTED_FILE" ]; then
        echo -e "${GREEN}Encrypted to: $ENCRYPTED_FILE${NC}"
        OUTPUT_FILE="$ENCRYPTED_FILE"
    else
        echo -e "${RED}Encryption failed.${NC}"
        exit 1
    fi
else
    mv "$TEMP_DIR/dotfiles-backup.tar.gz" "$OUTPUT_FILE"
    echo -e "${GREEN}Archive created: $OUTPUT_FILE${NC}"
fi

# Show file size
FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
echo -e "${GREEN}Final size: $FILE_SIZE${NC}"
echo
echo -e "${YELLOW}IMPORTANT:${NC}"
echo -e "  1. Store passphrase in your password manager"
echo -e "  2. Upload to cloud storage (R2, S3, etc)"
echo -e "  3. Test restore: bash scripts/backup/restore-dotfiles.sh $OUTPUT_FILE"

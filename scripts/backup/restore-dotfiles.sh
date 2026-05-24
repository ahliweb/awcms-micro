#!/usr/bin/env bash
# Restore dotfiles from encrypted backup
# Usage: bash scripts/backup/restore-dotfiles.sh <backup-file.age>

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check args
if [ $# -lt 1 ]; then
    echo -e "${RED}Usage: bash scripts/backup/restore-dotfiles.sh <backup-file.age>${NC}"
    exit 1
fi

BACKUP_FILE="$1"
TEMP_DIR="/tmp/dotfiles-restore-$(date +%s)"

# Check if age is installed
if ! command -v age &> /dev/null; then
    echo -e "${RED}Error: 'age' is not installed.${NC}"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

mkdir -p "$TEMP_DIR"

echo -e "${BLUE}Restoring dotfiles from: $BACKUP_FILE${NC}"

# Decrypt
DECRYPTED_FILE="$TEMP_DIR/dotfiles-backup.tar.gz"
read -s -p "Enter passphrase: " PASSPHRASE
echo

echo "$PASSPHRASE" | age --passphrase --decrypt --output "$DECRYPTED_FILE" "$BACKUP_FILE" 2>/dev/null

if [ ! -f "$DECRYPTED_FILE" ]; then
    echo -e "${RED}Decryption failed. Check your passphrase.${NC}"
    exit 1
fi

# Extract
echo -e "${BLUE}Extracting archive...${NC}"
tar -xzf "$DECRYPTED_FILE" -C "$TEMP_DIR"

# List what will be restored
echo -e "${GREEN}Files to restore:${NC}"
find "$TEMP_DIR/dotfiles" -type f | sed "s|$TEMP_DIR/dotfiles/|  |" | sort

echo
read -p "Restore to $HOME? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# Restore files
RESTORED_COUNT=0
for file in "$TEMP_DIR"/dotfiles/*; do
    if [ -f "$file" ]; then
        rel_path="${file#$TEMP_DIR/dotfiles/}"
        dest="$HOME/$rel_path"

        # Create parent directory
        mkdir -p "$(dirname "$dest")"

        # Backup existing file if present
        if [ -e "$dest" ]; then
            mv "$dest" "${dest}.bak.$(date +%Y%m%d)"
            echo -e "${YELLOW}  Backed up existing: $rel_path -> ${rel_path}.bak${NC}"
        fi

        cp -a "$file" "$dest"
        echo -e "${GREEN}  Restored: $rel_path${NC}"
        RESTORED_COUNT=$((RESTORED_COUNT + 1))
    fi
done

echo
echo -e "${GREEN}Restored $RESTORED_COUNT file(s).${NC}"
echo -e "${YELLOW}Note: You may need to restart your terminal or run 'source ~/.zshrc'${NC}"

# Show extension restore instructions
if [ -f "$TEMP_DIR/dotfiles/vscode-extensions.txt" ]; then
    echo
    echo -e "${BLUE}To restore VS Code extensions:${NC}"
    echo "  cat $TEMP_DIR/dotfiles/vscode-extensions.txt | xargs -L 1 code --install-extension"
fi

if [ -f "$TEMP_DIR/dotfiles/npm-global.txt" ]; then
    echo
    echo -e "${BLUE}To restore npm global packages:${NC}"
    echo "  cat $TEMP_DIR/dotfiles/npm-global.txt | grep -E '^\S' | cut -d' ' -f1 | xargs npm install -g"
fi

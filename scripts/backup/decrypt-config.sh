#!/usr/bin/env bash
# Decrypt the backup configuration file for editing
# Usage: bash scripts/backup/decrypt-config.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENCRYPTED_FILE="$SCRIPT_DIR/.backup-config.age"
CONFIG_FILE="$SCRIPT_DIR/.backup-config"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if age is installed
if ! command -v age &> /dev/null; then
    echo -e "${RED}Error: 'age' is not installed.${NC}"
    exit 1
fi

# Check if encrypted config exists
if [ ! -f "$ENCRYPTED_FILE" ]; then
    echo -e "${RED}Error: Encrypted config not found: $ENCRYPTED_FILE${NC}"
    echo "Create config first: cp $SCRIPT_DIR/.backup-config.example $CONFIG_FILE"
    echo "Then encrypt: bash $SCRIPT_DIR/encrypt-config.sh"
    exit 1
fi

# Check if unencrypted already exists
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}Warning: Unencrypted config already exists.${NC}"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Config is already available at: $CONFIG_FILE"
        exit 0
    fi
fi

echo -e "${BLUE}Decrypting backup configuration...${NC}"
read -s -p "Enter passphrase: " PASSPHRASE
echo

# Decrypt
echo "$PASSPHRASE" | age --passphrase --decrypt --output "$CONFIG_FILE" "$ENCRYPTED_FILE" 2>/dev/null

if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}Config decrypted: $CONFIG_FILE${NC}"
    echo
    echo -e "${YELLOW}Configuration summary:${NC}"

    # Show non-sensitive values
    echo "  GITLAB_USERNAME:     $(grep '^GITLAB_USERNAME=' "$CONFIG_FILE" | cut -d'"' -f2)"
    echo "  GITLAB_REPO_NAME:    $(grep '^GITLAB_REPO_NAME=' "$CONFIG_FILE" | cut -d'"' -f2)"
    echo "  R2_BUCKET_NAME:      $(grep '^R2_BUCKET_NAME=' "$CONFIG_FILE" | cut -d'"' -f2)"
    echo "  D1_DATABASE_NAME:    $(grep '^D1_DATABASE_NAME=' "$CONFIG_FILE" | cut -d'"' -f2)"
    echo "  ENCRYPTION_TOOL:     $(grep '^ENCRYPTION_TOOL=' "$CONFIG_FILE" | cut -d'"' -f2)"
    echo "  BACKUP_CRON:         $(grep '^BACKUP_CRON_SCHEDULE=' "$CONFIG_FILE" | cut -d'"' -f2)"
    echo "  NOTIFICATION:        $(grep '^NOTIFICATION_METHOD=' "$CONFIG_FILE" | cut -d'"' -f2)"
    echo
    echo -e "${YELLOW}IMPORTANT: After editing, re-encrypt and secure delete:${NC}"
    echo "  1. Edit: nano $CONFIG_FILE"
    echo "  2. Encrypt: bash $SCRIPT_DIR/encrypt-config.sh"
    echo "  3. Delete unencrypted: shred -u $CONFIG_FILE"
else
    echo -e "${RED}Decryption failed. Check your passphrase.${NC}"
    exit 1
fi

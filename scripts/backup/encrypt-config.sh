#!/usr/bin/env bash
# Encrypt the backup configuration file
# Usage: bash scripts/backup/encrypt-config.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.backup-config"
ENCRYPTED_FILE="$SCRIPT_DIR/.backup-config.age"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if age is installed
if ! command -v age &> /dev/null; then
    echo -e "${RED}Error: 'age' is not installed.${NC}"
    echo "Install: https://github.com/FiloSottile/age#installation"
    exit 1
fi

# Check if config exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: Config file not found: $CONFIG_FILE${NC}"
    echo "Create it from template: cp $SCRIPT_DIR/.backup-config.example $CONFIG_FILE"
    exit 1
fi

# Check if already encrypted
if [ -f "$ENCRYPTED_FILE" ]; then
    echo -e "${YELLOW}Warning: Encrypted config already exists.${NC}"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

echo -e "${BLUE}Encrypting backup configuration...${NC}"
echo

# Show current config summary
echo -e "${YELLOW}Current configuration summary:${NC}"
source <(grep -E '^[A-Z_]+=' "$CONFIG_FILE" | grep -v 'PASSPHRASE\|TOKEN\|SECRET\|KEY\|URL' | sed 's/=.*$/=***/')
echo "  BACKUP_PASSPHRASE=***"
echo "  CLOUDFLARE_API_TOKEN=***"
echo

read -s -p "Enter encryption passphrase (or press Enter to use BACKUP_PASSPHRASE from config): " PASSPHRASE
echo

if [ -z "$PASSPHRASE" ]; then
    PASSPHRASE=$(grep '^BACKUP_PASSPHRASE=' "$CONFIG_FILE" | cut -d'"' -f2)
    if [ -z "$PASSPHRASE" ] || [ "$PASSPHRASE" = "your-secure-master-passphrase-min-8-chars" ]; then
        echo -e "${RED}Error: No valid BACKUP_PASSPHRASE found in config.${NC}"
        echo "Edit $CONFIG_FILE and set a secure passphrase first."
        exit 1
    fi
    echo -e "${YELLOW}Using BACKUP_PASSPHRASE from config.${NC}"
fi

if [ ${#PASSPHRASE} -lt 8 ]; then
    echo -e "${RED}Error: Passphrase must be at least 8 characters.${NC}"
    exit 1
fi

# Encrypt
age --passphrase --output "$ENCRYPTED_FILE" "$CONFIG_FILE" 2>/dev/null

if [ -f "$ENCRYPTED_FILE" ]; then
    echo -e "${GREEN}Config encrypted: $ENCRYPTED_FILE${NC}"
    echo
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Verify: bash scripts/backup/decrypt-config.sh"
    echo "  2. Securely delete unencrypted config: shred -u $CONFIG_FILE"
    echo "  3. The .age file is safe to commit to private repos"
else
    echo -e "${RED}Encryption failed.${NC}"
    exit 1
fi

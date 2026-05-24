#!/usr/bin/env bash
# Encrypt .env files using age (passphrase-based encryption)
# Usage: bash scripts/backup/encrypt-env.sh [path-to-env-file]
#
# Prerequisites: Install age → https://github.com/FiloSottile/age
#   macOS: brew install age
#   Ubuntu: sudo apt install age
#   Arch: sudo pacman -S age

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Load unified config if available
if [ -f "$SCRIPT_DIR/load-config.sh" ]; then
    source "$SCRIPT_DIR/load-config.sh" 2>/dev/null || true
fi

# Default env file
ENV_FILE="${1:-$ROOT_DIR/../.env}"
ENCRYPTED_FILE="${ENV_FILE}.age"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if age is installed
if ! command -v age &> /dev/null; then
    echo -e "${RED}Error: 'age' is not installed.${NC}"
    echo "Install it: https://github.com/FiloSottile/age#installation"
    exit 1
fi

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: File not found: $ENV_FILE${NC}"
    exit 1
fi

# Check if already encrypted
if [ -f "$ENCRYPTED_FILE" ]; then
    echo -e "${YELLOW}Warning: Encrypted file already exists: $ENCRYPTED_FILE${NC}"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Get passphrase - try config first, then prompt
PASSPHRASE="${BACKUP_PASSPHRASE:-}"
if [ -z "$PASSPHRASE" ] || [ "$PASSPHRASE" = "your-secure-master-passphrase-min-8-chars" ]; then
    echo -e "${GREEN}Encrypting: $ENV_FILE${NC}"
    read -s -p "Enter passphrase (min 8 chars): " PASSPHRASE
    echo
fi

if [ ${#PASSPHRASE} -lt 8 ]; then
    echo -e "${RED}Error: Passphrase must be at least 8 characters.${NC}"
    exit 1
fi

# Encrypt
age --passphrase --output "$ENCRYPTED_FILE" "$ENV_FILE" 2>/dev/null

# Verify encryption
if [ -f "$ENCRYPTED_FILE" ]; then
    echo -e "${GREEN}Successfully encrypted to: $ENCRYPTED_FILE${NC}"
    echo -e "${YELLOW}IMPORTANT: Store this passphrase securely (password manager).${NC}"
    echo -e "${YELLOW}You will need it to decrypt.${NC}"

    # Zero out the original file (secure delete)
    echo -e "${YELLOW}Securely removing original .env file...${NC}"
    shred -u "$ENV_FILE" 2>/dev/null || rm "$ENV_FILE"
    echo -e "${GREEN}Original file securely deleted.${NC}"
    echo -e "${YELLOW}Now you can safely commit the .age file to your private backup repo.${NC}"
else
    echo -e "${RED}Encryption failed.${NC}"
    exit 1
fi

#!/usr/bin/env bash
# Decrypt .env.age files using age (passphrase-based decryption)
# Usage: bash scripts/backup/decrypt-env.sh [path-to-encrypted-file]
#
# Prerequisites: Install age → https://github.com/FiloSottile/age

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Load unified config if available
if [ -f "$SCRIPT_DIR/load-config.sh" ]; then
    source "$SCRIPT_DIR/load-config.sh" 2>/dev/null || true
fi

# Default encrypted file
ENCRYPTED_FILE="${1:-$ROOT_DIR/../.env.age}"

# Derive output filename (remove .age extension)
OUTPUT_FILE="${ENCRYPTED_FILE%.age}"

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

# Check if encrypted file exists
if [ ! -f "$ENCRYPTED_FILE" ]; then
    echo -e "${RED}Error: Encrypted file not found: $ENCRYPTED_FILE${NC}"
    exit 1
fi

# Check if output file already exists
if [ -f "$OUTPUT_FILE" ]; then
    echo -e "${YELLOW}Warning: Output file already exists: $OUTPUT_FILE${NC}"
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
    echo -e "${GREEN}Decrypting: $ENCRYPTED_FILE${NC}"
    read -s -p "Enter passphrase: " PASSPHRASE
    echo
fi

# Decrypt
echo "$PASSPHRASE" | age --passphrase --decrypt --output "$OUTPUT_FILE" "$ENCRYPTED_FILE" 2>/dev/null

# Verify decryption
if [ -f "$OUTPUT_FILE" ]; then
    # Check if it looks like a valid env file
    if grep -q '=' "$OUTPUT_FILE" 2>/dev/null; then
        echo -e "${GREEN}Successfully decrypted to: $OUTPUT_FILE${NC}"
        echo -e "${YELLOW}Remember to add .env to .gitignore and never commit it.${NC}"
    else
        echo -e "${RED}Decryption may have failed - output doesn't look like an env file.${NC}"
        rm -f "$OUTPUT_FILE"
        exit 1
    fi
else
    echo -e "${RED}Decryption failed. Check your passphrase.${NC}"
    exit 1
fi

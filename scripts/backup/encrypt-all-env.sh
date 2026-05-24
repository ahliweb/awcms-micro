#!/usr/bin/env bash
# Batch encrypt all .env files in the project
# Usage: bash scripts/backup/encrypt-all-env.sh
#
# Finds all .env files (not .env.example) and encrypts them

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

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

# Check if age is installed
if ! command -v age &> /dev/null; then
    echo -e "${RED}Error: 'age' is not installed.${NC}"
    echo "Install it: https://github.com/FiloSottile/age#installation"
    exit 1
fi

echo -e "${BLUE}Searching for .env files...${NC}"

# Find all .env files, excluding .env.example and .env.age
mapfile -t ENV_FILES < <(find "$ROOT_DIR" -name ".env" -not -name "*.example" -not -name "*.age" -type f 2>/dev/null || true)

if [ ${#ENV_FILES[@]} -eq 0 ]; then
    echo -e "${YELLOW}No .env files found.${NC}"
    exit 0
fi

echo -e "${GREEN}Found ${#ENV_FILES[@]} .env file(s):${NC}"
for f in "${ENV_FILES[@]}"; do
    echo "  - $f"
done
echo

# Get passphrase - try config first, then prompt
PASSPHRASE="${BACKUP_PASSPHRASE:-}"
if [ -z "$PASSPHRASE" ] || [ "$PASSPHRASE" = "your-secure-master-passphrase-min-8-chars" ]; then
    read -s -p "Enter passphrase (min 8 chars, used for all files): " PASSPHRASE
    echo
fi

if [ ${#PASSPHRASE} -lt 8 ]; then
    echo -e "${RED}Error: Passphrase must be at least 8 characters.${NC}"
    exit 1
fi

# Encrypt each file
ENCRYPTED_COUNT=0
FAILED_COUNT=0

for ENV_FILE in "${ENV_FILES[@]}"; do
    ENCRYPTED_FILE="${ENV_FILE}.age"

    echo -e "${BLUE}Encrypting: $ENV_FILE${NC}"

    # Skip if already encrypted and user doesn't want to overwrite
    if [ -f "$ENCRYPTED_FILE" ]; then
        echo -e "${YELLOW}  Already exists, skipping: $ENCRYPTED_FILE${NC}"
        continue
    fi

    # Encrypt
    if echo "$PASSPHRASE" | age --passphrase --output "$ENCRYPTED_FILE" "$ENV_FILE" 2>/dev/null; then
        echo -e "${GREEN}  Encrypted: $ENCRYPTED_FILE${NC}"
        ENCRYPTED_COUNT=$((ENCRYPTED_COUNT + 1))

        # Secure delete original
        shred -u "$ENV_FILE" 2>/dev/null || rm "$ENV_FILE"
    else
        echo -e "${RED}  Failed: $ENV_FILE${NC}"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
done

echo
echo -e "${GREEN}Summary: $ENCRYPTED_COUNT encrypted, $FAILED_COUNT failed${NC}"
echo -e "${YELLOW}IMPORTANT: Store passphrase securely in your password manager.${NC}"

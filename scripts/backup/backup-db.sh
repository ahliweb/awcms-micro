#!/usr/bin/env bash
# Backup database to R2/S3 with encryption
# Supports: PostgreSQL, MySQL, SQLite, D1
# Usage: bash scripts/backup/backup-db.sh [options]
#
# Options:
#   --type postgres|mysql|sqlite|d1   Database type (required)
#   --name <name>                      Database name or path
#   --bucket <bucket>                  R2 bucket name
#   --prefix <prefix>                  Key prefix (default: backups/db)
#   --keep <count>                     Number of backups to keep (default: 7)
#   --encrypt                          Encrypt backup with age
#   --dry-run                          Show what would be done

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="/tmp/db-backup-$(date +%s)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

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

# Defaults from config or hardcoded fallbacks
DB_TYPE=""
DB_NAME="${D1_DATABASE_NAME:-}"
R2_BUCKET="${R2_BUCKET_NAME:-}"
R2_PREFIX="backups/db"
KEEP_COUNT="${D1_BACKUP_KEEP_COUNT:-7}"
ENCRYPT=true
DRY_RUN=false
PASSPHRASE="${BACKUP_PASSPHRASE:-}"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type) DB_TYPE="$2"; shift 2 ;;
        --name) DB_NAME="$2"; shift 2 ;;
        --bucket) R2_BUCKET="$2"; shift 2 ;;
        --prefix) R2_PREFIX="$2"; shift 2 ;;
        --keep) KEEP_COUNT="$2"; shift 2 ;;
        --encrypt) ENCRYPT=true; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Validate required args
if [ -z "$DB_TYPE" ]; then
    echo -e "${RED}Error: --type is required (postgres|mysql|sqlite|d1)${NC}"
    exit 1
fi

if [ -z "$DB_NAME" ]; then
    echo -e "${RED}Error: --name is required${NC}"
    exit 1
fi

if [ -z "$R2_BUCKET" ]; then
    echo -e "${RED}Error: --bucket is required${NC}"
    exit 1
fi

# Check for wrangler (needed for R2)
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}Error: wrangler CLI is required. Install: npm install -g wrangler${NC}"
    exit 1
fi

# Check for age if encryption enabled
if [ "$ENCRYPT" = true ] && ! command -v age &> /dev/null; then
    echo -e "${RED}Error: 'age' is required for encryption.${NC}"
    exit 1
fi

# Create temp directory
mkdir -p "$BACKUP_DIR"

cleanup() {
    rm -rf "$BACKUP_DIR"
}
trap cleanup EXIT

echo -e "${BLUE}Starting database backup...${NC}"
echo -e "  Type:   $DB_TYPE"
echo -e "  Name:   $DB_NAME"
echo -e "  Bucket: $R2_BUCKET"
echo -e "  Prefix: $R2_PREFIX"
echo

# Backup function per database type
backup_database() {
    local output_file="$BACKUP_DIR/backup-$TIMESTAMP"

    case $DB_TYPE in
        postgres)
            output_file="${output_file}.sql"
            echo -e "${BLUE}Dumping PostgreSQL database: $DB_NAME${NC}"
            pg_dump "$DB_NAME" > "$output_file"
            ;;
        mysql)
            output_file="${output_file}.sql"
            echo -e "${BLUE}Dumping MySQL database: $DB_NAME${NC}"
            mysqldump "$DB_NAME" > "$output_file"
            ;;
        sqlite)
            output_file="${output_file}.sqlite"
            echo -e "${BLUE}Copying SQLite database: $DB_NAME${NC}"
            if [ ! -f "$DB_NAME" ]; then
                echo -e "${RED}Error: SQLite file not found: $DB_NAME${NC}"
                exit 1
            fi
            cp "$DB_NAME" "$output_file"
            ;;
        d1)
            output_file="${output_file}.sql"
            echo -e "${BLUE}Exporting D1 database: $DB_NAME${NC}"
            wrangler d1 export "$DB_NAME" --output "$output_file" --remote
            ;;
        *)
            echo -e "${RED}Error: Unsupported database type: $DB_TYPE${NC}"
            exit 1
            ;;
    esac

    echo "$output_file"
}

# Run backup
BACKUP_FILE=$(backup_database)

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file was not created.${NC}"
    exit 1
fi

# Get file size
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo -e "${GREEN}Backup created: $BACKUP_FILE ($FILE_SIZE)${NC}"

# Encrypt if requested
if [ "$ENCRYPT" = true ]; then
    echo -e "${BLUE}Encrypting backup...${NC}"

    if [ -z "$PASSPHRASE" ]; then
        read -s -p "Enter encryption passphrase: " PASSPHRASE
        echo
    fi

    ENCRYPTED_FILE="${BACKUP_FILE}.age"
    echo "$PASSPHRASE" | age --passphrase --output "$ENCRYPTED_FILE" "$BACKUP_FILE" 2>/dev/null

    if [ -f "$ENCRYPTED_FILE" ]; then
        echo -e "${GREEN}Encrypted: $ENCRYPTED_FILE${NC}"
        BACKUP_FILE="$ENCRYPTED_FILE"
        # Secure delete unencrypted
        shred -u "$BACKUP_FILE" 2>/dev/null || true
    else
        echo -e "${RED}Encryption failed, uploading unencrypted.${NC}"
    fi
fi

# Upload to R2
R2_KEY="${R2_PREFIX}/$(basename "$BACKUP_FILE")"

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN] Would upload to: r2://$R2_BUCKET/$R2_KEY${NC}"
else
    echo -e "${BLUE}Uploading to R2: $R2_BUCKET/$R2_KEY${NC}"
    wrangler r2 object put "$R2_BUCKET/$R2_KEY" --file "$BACKUP_FILE"
    echo -e "${GREEN}Uploaded to: r2://$R2_BUCKET/$R2_KEY${NC}"
fi

# Cleanup old backups (keep only KEEP_COUNT most recent)
echo -e "${BLUE}Cleaning up old backups (keeping $KEEP_COUNT)...${NC}"

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN] Would list and cleanup old backups.${NC}"
else
    # List backups, sort, delete oldest beyond keep count
    mapfile -t OLD_BACKUPS < <(
        wrangler r2 object list "$R2_BUCKET" --prefix "$R2_PREFIX/" --format json 2>/dev/null |
        jq -r '.objects[].key' |
        sort |
        head -n -$KEEP_COUNT
    )

    if [ ${#OLD_BACKUPS[@]} -gt 0 ]; then
        for old_key in "${OLD_BACKUPS[@]}"; do
            echo -e "${YELLOW}Deleting old backup: $old_key${NC}"
            wrangler r2 object delete "$R2_BUCKET/$old_key"
        done
        echo -e "${GREEN}Cleaned up ${#OLD_BACKUPS[@]} old backup(s).${NC}"
    else
        echo -e "${GREEN}No old backups to clean up.${NC}"
    fi
fi

echo
echo -e "${GREEN}Backup complete!${NC}"
echo -e "  Location: r2://$R2_BUCKET/$R2_KEY"
echo -e "  Retention: $KEEP_COUNT backups"

if [ "$ENCRYPT" = true ]; then
    echo -e "${YELLOW}  IMPORTANT: Store decryption passphrase securely!${NC}"
fi

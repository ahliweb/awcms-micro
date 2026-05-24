#!/usr/bin/env bash
# Load backup configuration - sourced by other scripts
# Usage: source scripts/backup/load-config.sh
#
# This script reads from .backup-config or decrypts .backup-config.age temporarily.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.backup-config"
ENCRYPTED_FILE="$SCRIPT_DIR/.backup-config.age"

_load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        set -a
        source "$CONFIG_FILE"
        set +a
        return 0
    fi

    if [ -f "$ENCRYPTED_FILE" ]; then
        # Decrypt to temp file, source, then cleanup
        local temp_config
        temp_config=$(mktemp /tmp/awcms-config.XXXXXX)

        # Check if running interactively
        if [ -t 0 ]; then
            read -s -p "Backup config passphrase: " BACKUP_PASSPHRASE_INPUT
            echo
            echo "$BACKUP_PASSPHRASE_INPUT" | age --passphrase --decrypt --output "$temp_config" "$ENCRYPTED_FILE" 2>/dev/null
        else
            # Non-interactive: use BACKUP_PASSPHRASE env var
            if [ -z "${BACKUP_PASSPHRASE:-}" ]; then
                echo "Error: BACKUP_PASSPHRASE env var required for non-interactive config load" >&2
                rm -f "$temp_config"
                return 1
            fi
            echo "$BACKUP_PASSPHRASE" | age --passphrase --decrypt --output "$temp_config" "$ENCRYPTED_FILE" 2>/dev/null
        fi

        if [ -f "$temp_config" ] && grep -q '=' "$temp_config" 2>/dev/null; then
            set -a
            source "$temp_config"
            set +a
            rm -f "$temp_config"
            return 0
        else
            rm -f "$temp_config"
            echo "Error: Failed to decrypt backup config" >&2
            return 1
        fi
    fi

    echo "Error: No backup config found. Run: cp $SCRIPT_DIR/.backup-config.example $CONFIG_FILE" >&2
    return 1
}

_load_config

if [ -n "${GITHUB_PAT:-}" ] && [ -z "${GITHUB_TOKEN:-}" ]; then
    export GITHUB_TOKEN="$GITHUB_PAT"
fi

if [ -n "${GITLAB_PAT:-}" ] && [ -z "${GITLAB_TOKEN:-}" ]; then
    export GITLAB_TOKEN="$GITLAB_PAT"
fi

#!/usr/bin/env bash
# Load backup configuration - sourced by other scripts
# Usage: source scripts/backup/load-config.sh
#
# This script reads from .backup-config or decrypts .backup-config.age temporarily.
# It also safely overlays local .env files when present.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.backup-config"
ENCRYPTED_FILE="$SCRIPT_DIR/.backup-config.age"

_trim() {
    local value="$1"
    value="${value#${value%%[!$' \t']*}}"
    value="${value%${value##*[!$' \t']}}"
    printf '%s' "$value"
}

_load_env_file() {
    local env_file="$1"
    [ -f "$env_file" ] || return 0

    while IFS= read -r raw_line || [ -n "$raw_line" ]; do
        local line="${raw_line%$'\r'}"

        case "$line" in
            ""|'#'*) continue ;;
            export\ *) line="${line#export }" ;;
        esac

        case "$line" in
            *=*) ;;
            *) continue ;;
        esac

        local key="${line%%=*}"
        local value="${line#*=}"

        key="$(_trim "$key")"
        value="$(_trim "$value")"

        case "$key" in
            ''|*[!A-Za-z0-9_]*|[0-9]*) continue ;;
        esac

        case "$key" in
            GITLAB_USERNAME|GITLAB_REPO_NAME|GITLAB_PAT|GITLAB_TOKEN|GITHUB_PAT|GITHUB_TOKEN|BACKUP_PASSPHRASE|CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID|D1_DATABASE_NAME|R2_BUCKET_NAME|BACKUP_CRON_SCHEDULE|BACKUP_CONTENT|BACKUP_SSH_KEYS|BACKUP_GPG_KEYS|BACKUP_CLOUD_CREDS|NOTIFICATION_METHOD|GITLAB_REPO_URL|GITLAB_VISIBILITY|GITLAB_SSH_KEY_PATH|GITHUB_REPO_URL|GITHUB_BRANCH|ENCRYPTION_TOOL|LOCAL_BACKUP_DIR|BACKUP_LOG_FILE|GITHUB_ACTION_DEPLOY_WORKFLOW|GITHUB_ACTION_BACKUP_WORKFLOW|GITHUB_ACTION_MIRROR_WORKFLOW|GITHUB_ACTION_DEPLOY_BRANCH|GITHUB_ACTION_BACKUP_CRON|GITHUB_ACTION_WORKER_TEMPLATE_PACKAGE|GITHUB_ACTION_NODE_VERSION|GITHUB_ACTION_PNPM_VERSION|CLOUDFLARE_WORKER_NAME|CLOUDFLARE_WORKER_MAIN|CLOUDFLARE_WORKER_COMPATIBILITY_DATE|CLOUDFLARE_WORKER_COMPATIBILITY_FLAGS|CLOUDFLARE_WORKER_PLACEMENT_MODE|CLOUDFLARE_WORKER_ROUTE_PATTERN|CLOUDFLARE_WORKER_ZONE_NAME|CLOUDFLARE_WORKER_CUSTOM_DOMAIN|CLOUDFLARE_WORKER_OBSERVABILITY|CLOUDFLARE_WORKER_D1_BINDING|CLOUDFLARE_WORKER_D1_DATABASE_NAME|CLOUDFLARE_WORKER_D1_DATABASE_ID|CLOUDFLARE_WORKER_R2_BINDING|CLOUDFLARE_WORKER_R2_BUCKET_NAME|CLOUDFLARE_WORKER_KV_BINDING|CLOUDFLARE_WORKER_KV_NAMESPACE_ID|CLOUDFLARE_WORKER_IMAGE_BINDING|CLOUDFLARE_WORKER_LOADER_BINDING|CLOUDFLARE_WORKER_SITE_URL|CLOUDFLARE_WORKER_STORAGE_PUBLIC_BASE_URL)
                if [ -z "${!key+x}" ]; then
                    case "$value" in
                        '"'*'"') value="${value:1:-1}" ;;
                        "'"*"'") value="${value:1:-1}" ;;
                    esac
                    printf -v "$key" '%s' "$value"
                    export "$key"
                fi
                ;;
        esac
    done < "$env_file"
}

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

_load_env_file "$ROOT_DIR/.env"
_load_env_file "$ROOT_DIR/awcmsmicro-dev/.env"

if [ -n "${GITHUB_PAT:-}" ] && [ -z "${GITHUB_TOKEN:-}" ]; then
    export GITHUB_TOKEN="$GITHUB_PAT"
fi

if [ -n "${GITLAB_PAT:-}" ] && [ -z "${GITLAB_TOKEN:-}" ]; then
    export GITLAB_TOKEN="$GITLAB_PAT"
fi

# Prefer PAT-based GitLab URLs for mirror/recovery flows, including legacy SSH configs.
if [ -n "${GITLAB_PAT:-}" ] && [ -n "${GITLAB_USERNAME:-}" ] && [ -n "${GITLAB_REPO_NAME:-}" ]; then
    if [ -z "${GITLAB_REPO_URL:-}" ] || printf '%s' "$GITLAB_REPO_URL" | grep -Eq '^(git@|ssh://git@)gitlab\.com[:/]'; then
        export GITLAB_REPO_URL="https://oauth2:${GITLAB_PAT}@gitlab.com/${GITLAB_USERNAME}/${GITLAB_REPO_NAME}.git"
    fi
fi

if [ -z "${GITLAB_REPO_URL:-}" ] && [ -n "${GITLAB_PAT:-}" ] && [ -n "${GITLAB_USERNAME:-}" ] && [ -n "${GITLAB_REPO_NAME:-}" ]; then
    export GITLAB_REPO_URL="https://oauth2:${GITLAB_PAT}@gitlab.com/${GITLAB_USERNAME}/${GITLAB_REPO_NAME}.git"
fi

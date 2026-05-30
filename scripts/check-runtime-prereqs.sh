#!/bin/bash

set -euo pipefail

fail() {
	printf '%s\n' "[runtime prereqs] ERROR: $1" >&2
	exit 1
}

detect_username() {
	if command -v id >/dev/null 2>&1; then
		id -un
		return
	fi
	if command -v whoami >/dev/null 2>&1; then
		whoami
		return
	fi
	printf '%s\n' unknown
}

detect_user_id() {
	if command -v id >/dev/null 2>&1; then
		id -u
		return
	fi
	printf '%s\n' unknown
}

check_command() {
	local command_name="$1"
	command -v "$command_name" >/dev/null 2>&1 || fail "Missing required command: $command_name"
}

check_version() {
	local command_name="$1"
	shift
	if ! "$command_name" "$@" >/dev/null 2>&1; then
		fail "Command exists but cannot run: $command_name $*"
	fi
}

OS_NAME="${AWCMS_RUNTIME_UNAME_S:-$(uname -s)}"
KERNEL_RELEASE="${AWCMS_RUNTIME_UNAME_R:-$(uname -r)}"
ARCHITECTURE="${AWCMS_RUNTIME_UNAME_M:-$(uname -m)}"
LOGIN_USER="${SUDO_USER:-$(detect_username)}"
EFFECTIVE_USER="$(detect_username)"
CURRENT_UID="$(detect_user_id)"

case "$OS_NAME" in
	Linux)
		OS_LABEL="Linux"
		;;
	Darwin)
		OS_LABEL="macOS"
		;;
	MINGW*|MSYS*|CYGWIN*)
		OS_LABEL="Windows"
		;;
	*)
		fail "Unsupported operating system: $OS_NAME. Supported hosts are Linux, macOS, and Windows via a Bash-compatible shell."
		;;
esac

printf '%s\n' "[runtime prereqs] Platform: $OS_LABEL ($OS_NAME $KERNEL_RELEASE $ARCHITECTURE)"
printf '%s\n' "[runtime prereqs] User: login=$LOGIN_USER effective=$EFFECTIVE_USER uid=$CURRENT_UID"

if [[ "$CURRENT_UID" == "0" ]]; then
	printf '%s\n' '[runtime prereqs] WARNING: Running as root is not recommended.' >&2
fi

for command_name in bash git node pnpm python3 rsync; do
	check_command "$command_name"
done

check_version git --version
check_version node --version
check_version pnpm --version
check_version python3 --version
check_version rsync --version

printf '%s\n' '[runtime prereqs] Required runtime commands are available.'

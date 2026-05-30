#!/bin/bash

set -euo pipefail

fail() {
	printf '%s\n' "[runtime prereqs] ERROR: $1" >&2
	exit 1
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

OS_NAME="$(uname -s)"
KERNEL_RELEASE="$(uname -r)"
ARCHITECTURE="$(uname -m)"
LOGIN_USER="${SUDO_USER:-$(id -un)}"
EFFECTIVE_USER="$(id -un)"
CURRENT_UID="$(id -u)"

case "$OS_NAME" in
	Linux) ;;
	*)
		fail "Unsupported operating system: $OS_NAME. This repository's scripts are validated on Linux only."
		;;
esac

printf '%s\n' "[runtime prereqs] OS: $OS_NAME $KERNEL_RELEASE ($ARCHITECTURE)"
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

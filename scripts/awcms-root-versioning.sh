#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
NODE_SCRIPT="$SCRIPT_DIR/awcms-version.mjs"
CHANGELOG_PATH="$ROOT_DIR/CHANGELOG.md"
UPSTREAM_FETCH_PATH="$ROOT_DIR/docs/upstream-sync/LAST_UPSTREAM_FETCH.md"
MODE="${1:-version}"

log() {
	printf '[awcms-root-versioning] %s\n' "$1"
}

has_pending_changesets() {
	local changeset
	for changeset in "$ROOT_DIR/.awcms-changesets"/*.md; do
		[[ -e "$changeset" ]] || continue
		[[ "$(basename "$changeset")" == "README.md" ]] && continue
		return 0
	done
	return 1
}

refresh_snapshot() {
	ROOT_DIR="$ROOT_DIR" UPSTREAM_FETCH_PATH="$UPSTREAM_FETCH_PATH" CHANGELOG_PATH="$CHANGELOG_PATH" node --input-type=module <<'NODE'
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.env.ROOT_DIR;
const upstreamFetchPath = process.env.UPSTREAM_FETCH_PATH;
const changelogPath = process.env.CHANGELOG_PATH;
const workspaceDir = path.join(rootDir, 'awcmsmicro-dev');

if (!rootDir || !upstreamFetchPath || !changelogPath) {
	throw new Error('Missing required environment for root snapshot refresh');
}

function readText(filePath, fallback = '') {
	return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : fallback;
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readUpstreamSha() {
	const text = readText(upstreamFetchPath);
	const match = text.match(/^\s*- Upstream commit SHA: (.+)$/m);
	return match ? match[1].trim() : 'unknown';
}

function readRootVersion() {
	return readText(path.join(rootDir, 'VERSION')).trim() || '0.1.0';
}

function listPackages(baseDir) {
	if (!fs.existsSync(baseDir)) return [];
	return fs.readdirSync(baseDir)
		.filter((name) => fs.existsSync(path.join(baseDir, name, 'package.json')))
		.map((name) => ({
			dir: path.join(baseDir, name),
			pkg: readJson(path.join(baseDir, name, 'package.json')),
		}))
		.sort((a, b) => {
			const aPriority = a.pkg.name.startsWith('@awcms-micro/') ? 0 : 1;
			const bPriority = b.pkg.name.startsWith('@awcms-micro/') ? 0 : 1;
			if (aPriority !== bPriority) return aPriority - bPriority;
			return a.pkg.name.localeCompare(b.pkg.name, 'en');
		});
}

function latestSectionHeader(lines) {
	const idx = lines.findIndex((line) => /^##\s+/.test(line));
	if (idx === -1) return null;
	return lines[idx].replace(/^##\s+/, '').trim();
}

function latestBodySummary(lines) {
	const idx = lines.findIndex((line) => /^##\s+/.test(line));
	if (idx === -1) return '';
	const body = [];
	for (let i = idx + 1; i < lines.length; i++) {
		if (/^##\s+/.test(lines[i])) break;
		if (lines[i].trim()) body.push(lines[i].trim());
	}
	return body.join(' ').replace(/\s+/g, ' ').trim();
}

function summarizeChangelog(pkgName, filePath) {
	if (!fs.existsSync(filePath)) return '(no changelog yet)';
	const lines = readText(filePath).split(/\r?\n/);
	const section = latestSectionHeader(lines);
	if (!section) return '(no versioned entry)';
	const body = latestBodySummary(lines);
	if (pkgName.startsWith('@awcms-micro/')) {
		return body.replace(/^-+\s*/, '').trim() || section;
	}
	return `latest changelog section: ${section.split(' - ')[0]}`;
}

function renderSection(title, packages) {
	const lines = [`### ${title}`, ''];
	for (const { pkg, dir } of packages) {
		const changelog = summarizeChangelog(pkg.name, path.join(dir, 'CHANGELOG.md'));
		lines.push(`- \`${pkg.name}\` \`${pkg.version}\` - ${changelog}`);
	}
	lines.push('');
	return lines.join('\n');
}

const upstreamSha = readUpstreamSha();
const rootVersion = readRootVersion();
const date = new Date().toISOString().slice(0, 10);
const plugins = listPackages(path.join(workspaceDir, 'packages', 'plugins'));
const templates = listPackages(path.join(workspaceDir, 'templates'));

const snapshot = [
	`## Workspace Snapshot - ${date}`,
	'',
	`- EmDash upstream: \`${upstreamSha}\` from \`emdash-latest/\``,
	`- Root version: \`${rootVersion}\``,
	'',
	renderSection('Plugins', plugins),
	renderSection('Templates', templates),
].join('\n').trimEnd();

const current = readText(changelogPath, '# AWCMS-Micro Changelog\n');
const snapshotMarker = /\n## Workspace Snapshot - [^\n]+\n[\s\S]*$/;
const base = snapshotMarker.test(current) ? current.replace(snapshotMarker, '').replace(/\s+$/, '') : current.replace(/\s+$/, '');
const next = `${base}\n\n${snapshot}\n`;

if (current !== next) {
	fs.writeFileSync(changelogPath, next, 'utf8');
}
NODE
}

case "$MODE" in
	status)
		log "Current root versioning status"
		node "$NODE_SCRIPT" status
		if has_pending_changesets; then
			log "Pending root changesets are present"
		else
			log "No pending root changesets"
		fi
		;;
	version|sync)
		if has_pending_changesets; then
			log "Applying pending root changesets"
			node "$NODE_SCRIPT" version
		else
			log "No pending root changesets to apply"
		fi
		log "Refreshing root workspace snapshot"
		refresh_snapshot
		;;
	*)
		echo "Usage: $0 [status|version|sync]" >&2
		exit 1
		;;
esac

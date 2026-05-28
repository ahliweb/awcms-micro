import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2] ?? "status";
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const changesetDir = path.join(rootDir, ".awcms-changesets");
const versionPath = path.join(rootDir, "VERSION");
const changelogPath = path.join(rootDir, "CHANGELOG.md");

const changesetFrontmatterRe = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
const changesetLineRe = /^bump:\s*(patch|minor|major)$/;
const semverRe = /^(\d+)\.(\d+)\.(\d+)$/;
const newlineRe = /\r?\n/;
const bumpOrder = { patch: 0, minor: 1, major: 2 };

function readVersion() {
	if (!existsSync(versionPath)) return "0.1.0";
	const value = readFileSync(versionPath, "utf8").trim();
	return value || "0.1.0";
}

function writeVersion(version) {
	writeFileSync(versionPath, `${version}\n`, "utf8");
}

function bumpVersion(version, bump) {
	const match = version.match(semverRe);
	if (!match) throw new Error(`Unsupported semver version: ${version}`);
	const [, major, minor, patch] = match;
	let nextMajor = Number(major);
	let nextMinor = Number(minor);
	let nextPatch = Number(patch);
	if (bump === "major") {
		nextMajor += 1;
		nextMinor = 0;
		nextPatch = 0;
	} else if (bump === "minor") {
		nextMinor += 1;
		nextPatch = 0;
	} else {
		nextPatch += 1;
	}
	return `${nextMajor}.${nextMinor}.${nextPatch}`;
}

function normalizeBody(body) {
	return body
		.split(newlineRe)
		.map((line) => line.trim())
		.filter(Boolean)
		.join(" ");
}

function parseChangesetFile(filePath) {
	const raw = readFileSync(filePath, "utf8");
	const match = raw.match(changesetFrontmatterRe);
	if (!match) throw new Error(`Invalid root changeset frontmatter in ${path.basename(filePath)}`);
	const [, header, bodyRaw] = match;
	const body = bodyRaw.trim();
	if (!body) throw new Error(`Missing root changeset body in ${path.basename(filePath)}`);
	const bumpLine = header.split(newlineRe).map((line) => line.trim()).filter(Boolean)[0];
	if (!bumpLine) throw new Error(`Missing bump line in ${path.basename(filePath)}`);
	const bumpMatch = bumpLine.match(changesetLineRe);
	if (!bumpMatch) throw new Error(`Invalid bump line ${JSON.stringify(bumpLine)} in ${path.basename(filePath)}`);
	return { filePath, body, bump: bumpMatch[1] };
}

function readPendingChangesets() {
	if (!existsSync(changesetDir)) return [];
	return readdirSync(changesetDir)
		.filter((file) => file.endsWith(".md") && file !== "README.md")
		.toSorted()
		.map((file) => parseChangesetFile(path.join(changesetDir, file)));
}

function summarizePending(changesets) {
	if (changesets.length === 0) {
		console.log("No pending root AWCMS changesets.");
		return;
	}
	console.log(`Pending root AWCMS changesets: ${changesets.length}`);
	for (const changeset of changesets) {
		console.log(`- ${path.basename(changeset.filePath)} (${changeset.bump})`);
	}
}

function updateChangelog(version, changesets) {
	const date = new Date().toISOString().slice(0, 10);
	const section = [
		`## ${version} - ${date}`,
		"",
		...changesets.map((entry) => `- ${normalizeBody(entry.body)}`),
		"",
	].join("\n");

	if (!existsSync(changelogPath)) {
		writeFileSync(changelogPath, `# AWCMS-Micro Changelog\n\n${section}`, "utf8");
		return;
	}

	const current = readFileSync(changelogPath, "utf8");
	if (current.startsWith("# AWCMS-Micro Changelog\n\n")) {
		writeFileSync(changelogPath, `# AWCMS-Micro Changelog\n\n${section}${current.slice("# AWCMS-Micro Changelog\n\n".length)}`, "utf8");
		return;
	}

	writeFileSync(changelogPath, `${section}${current}`, "utf8");
}

function applyVersioning(changesets) {
	if (changesets.length === 0) {
		console.log("No pending root AWCMS changesets. Nothing to version.");
		return;
	}

	let nextBump = "patch";
	for (const changeset of changesets) {
		if (bumpOrder[changeset.bump] > bumpOrder[nextBump]) nextBump = changeset.bump;
	}

	const currentVersion = readVersion();
	const nextVersion = bumpVersion(currentVersion, nextBump);
	writeVersion(nextVersion);
	updateChangelog(nextVersion, changesets);

	for (const changeset of changesets) {
		rmSync(changeset.filePath);
	}

	console.log(`Root AWCMS version updated: ${currentVersion} -> ${nextVersion} (${nextBump})`);
}

const changesets = readPendingChangesets();

if (mode === "status") {
	summarizePending(changesets);
} else if (mode === "version") {
	applyVersioning(changesets);
} else {
	throw new Error(`Unknown root AWCMS release mode: ${JSON.stringify(mode)} (expected "status" or "version")`);
}

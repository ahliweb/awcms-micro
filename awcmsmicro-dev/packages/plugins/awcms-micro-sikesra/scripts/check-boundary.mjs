import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const workspaceDir = resolve(pluginDir, "../../..");
const rootDir = resolve(workspaceDir, "..");
const forbiddenDirs = [
	resolve(rootDir, "emdash-latest/packages/core"),
	resolve(rootDir, "emdash-latest/packages/admin"),
];
const ignoredDirs = new Set(["node_modules", "dist", ".git", ".astro", ".wrangler", ".vite"]);
const searchableExtensions = new Set([
	".astro",
	".cjs",
	".css",
	".js",
	".json",
	".jsonc",
	".jsx",
	".md",
	".mjs",
	".sql",
	".ts",
	".tsx",
]);
const SIKESRA_REFERENCE_PATTERN = /sikesra/i;

function extensionOf(file) {
	const dot = file.lastIndexOf(".");
	return dot === -1 ? "" : file.slice(dot);
}

function walk(dir, matches) {
	if (!existsSync(dir)) return;
	for (const entry of readdirSync(dir)) {
		if (ignoredDirs.has(entry)) continue;
		const path = join(dir, entry);
		const stat = statSync(path);
		if (stat.isDirectory()) {
			walk(path, matches);
			continue;
		}
		if (!stat.isFile() || !searchableExtensions.has(extensionOf(entry))) continue;
		const content = readFileSync(path, "utf8");
		if (SIKESRA_REFERENCE_PATTERN.test(entry) || SIKESRA_REFERENCE_PATTERN.test(content)) {
			matches.push(relative(rootDir, path));
		}
	}
}

const matches = [];
for (const dir of forbiddenDirs) walk(dir, matches);

if (matches.length > 0) {
	console.error("SIKESRA boundary violation: upstream EmDash core/admin files reference SIKESRA.");
	for (const match of matches) console.error(`- ${match}`);
	process.exit(1);
}

console.log("SIKESRA boundary check passed: no upstream EmDash core/admin references found.");

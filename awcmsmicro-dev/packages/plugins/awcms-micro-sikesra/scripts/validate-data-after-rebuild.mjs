import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const commands = [
	["node", ["scripts/check-data-boundary.mjs"]],
	["node", ["scripts/check-destructive-migrations.mjs"]],
	["node", ["scripts/check-user-references.mjs"]],
	["node", ["scripts/check-file-links.mjs"]],
	["node", ["scripts/backup-inventory.mjs"]],
];

for (const [command, args] of commands) {
	const result = spawnSync(command, args, { cwd: pluginDir, stdio: "inherit" });
	if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("SIKESRA after-rebuild data validation passed.");

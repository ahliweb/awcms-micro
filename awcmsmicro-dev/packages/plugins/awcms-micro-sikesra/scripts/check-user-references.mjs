import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const migrationsDir = resolve(pluginDir, "migrations");
const srcDir = resolve(pluginDir, "src");
const ignoredDirs = new Set(["dist", "node_modules", ".git", ".astro", ".vite", ".wrangler"]);

const requiredReferenceTables = [
	"sikesra_user_role_assignments",
	"sikesra_user_scope_assignments",
	"sikesra_abac_subject_assignments",
];
const forbiddenUserOwnershipPattern = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(?:sikesra_users|users|_emdash_users)[`"]?/i;
const emdashUserMutationPattern = /\b(?:insertInto|updateTable|deleteFrom)\(\s*["'](?:_emdash_users|users)["']/;
const clientUserHeaderPattern = /X-Sikesra-User-/i;

function readSql() {
	if (!existsSync(migrationsDir)) return "";
	return readdirSync(migrationsDir)
		.filter((entry) => entry.endsWith(".sql"))
		.map((file) => readFileSync(join(migrationsDir, file), "utf8"))
		.join("\n");
}

function walkFiles(dir, files = []) {
	if (!existsSync(dir)) return files;
	for (const entry of readdirSync(dir)) {
		if (ignoredDirs.has(entry)) continue;
		const path = join(dir, entry);
		const stat = statSync(path);
		if (stat.isDirectory()) walkFiles(path, files);
		else if (stat.isFile() && /\.(ts|tsx|js|mjs)$/.test(entry)) files.push(path);
	}
	return files;
}

const sql = readSql();
const violations = [];

for (const table of requiredReferenceTables) {
	const tableBlock = new RegExp(`CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${table}[\\s\\S]*?;`, "i").exec(sql)?.[0] ?? "";
	if (!tableBlock) violations.push(`missing EmDash user reference table: ${table}`);
	else if (!/emdash_user_id\s+TEXT\s+NOT\s+NULL/i.test(tableBlock)) {
		violations.push(`${table} must reference emdash_user_id as a required value`);
	}
}

if (forbiddenUserOwnershipPattern.test(sql)) {
	violations.push("migrations must not create SIKESRA-owned duplicate user tables");
}

for (const file of walkFiles(srcDir)) {
	const source = readFileSync(file, "utf8");
	if (emdashUserMutationPattern.test(source)) {
		violations.push(`source mutates EmDash users: ${file.replace(`${pluginDir}/`, "")}`);
	}
	if (
		clientUserHeaderPattern.test(source) &&
		!file.endsWith("src/admin/api/client.ts") &&
		!/allowClientUserHeadersInDev/.test(source)
	) {
		violations.push(`source references untrusted client SIKESRA user headers: ${file.replace(`${pluginDir}/`, "")}`);
	}
}

if (violations.length > 0) {
	console.error("SIKESRA user-reference guard failed.");
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log("SIKESRA user-reference guard passed.");

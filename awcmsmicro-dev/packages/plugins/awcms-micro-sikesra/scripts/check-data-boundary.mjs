import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const schemaPath = resolve(pluginDir, "src/db/schema.ts");
const migrationsDir = resolve(pluginDir, "migrations");
const srcDir = resolve(pluginDir, "src");

const createTablePattern = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const schemaTablePattern = /:\s*"(sikesra_[a-z0-9_]+)"/g;
const coreTableWritePattern =
	/\b(?:insertInto|updateTable|deleteFrom)\(\s*["'](?:_emdash_users|users|_emdash_sessions|_emdash_accounts)["']/;
const rawCoreTableSqlPattern =
	/\b(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+[`"]?(?:_emdash_users|users|_emdash_sessions|_emdash_accounts)\b/i;
const rawUnprefixedSikesraTablePattern =
	/\b(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE)\s+[`"]?(?!sikesra_|sqlite_|_)([a-z][a-z0-9_]*sikesra[a-z0-9_]*)\b/i;
const sourceFilePattern = /\.(ts|tsx|js|mjs)$/;
const ignoredDirs = new Set(["dist", "node_modules", ".git", ".astro", ".vite", ".wrangler"]);

function readSchemaTables() {
	const source = readFileSync(schemaPath, "utf8");
	return new Set(Array.from(source.matchAll(schemaTablePattern), (match) => match[1]));
}

function readMigrationTables() {
	const tables = new Map();
	if (!existsSync(migrationsDir)) return tables;
	for (const file of readdirSync(migrationsDir).filter((entry) => entry.endsWith(".sql"))) {
		const sql = readFileSync(join(migrationsDir, file), "utf8");
		for (const match of sql.matchAll(createTablePattern)) tables.set(match[1], file);
	}
	return tables;
}

function walkFiles(dir, files = []) {
	if (!existsSync(dir)) return files;
	for (const entry of readdirSync(dir)) {
		if (ignoredDirs.has(entry)) continue;
		const path = join(dir, entry);
		const stat = statSync(path);
		if (stat.isDirectory()) walkFiles(path, files);
		else if (stat.isFile() && sourceFilePattern.test(entry)) files.push(path);
	}
	return files;
}

const schemaTables = readSchemaTables();
const migrationTables = readMigrationTables();
const violations = [];

for (const table of schemaTables) {
	if (!table.startsWith("sikesra_")) violations.push(`schema table is not prefixed: ${table}`);
}

for (const [table, file] of migrationTables) {
	if (!table.startsWith("sikesra_")) violations.push(`${file} creates non-SIKESRA table: ${table}`);
	if (!schemaTables.has(table))
		violations.push(`${file} creates table missing from schema catalog: ${table}`);
}

for (const table of schemaTables) {
	if (!migrationTables.has(table))
		violations.push(`schema table missing from migrations: ${table}`);
}

for (const file of walkFiles(srcDir)) {
	const source = readFileSync(file, "utf8");
	if (coreTableWritePattern.test(source)) {
		violations.push(
			`source writes to EmDash/core user table: ${file.replace(`${pluginDir}/`, "")}`,
		);
	}
	if (rawCoreTableSqlPattern.test(source)) {
		violations.push(
			`source contains raw SQL write to EmDash/core user table: ${file.replace(`${pluginDir}/`, "")}`,
		);
	}
	const rawUnprefixedSikesraTable = source.match(rawUnprefixedSikesraTablePattern)?.[1];
	if (rawUnprefixedSikesraTable) {
		violations.push(
			`source contains raw SQL write to unprefixed SIKESRA-like table '${rawUnprefixedSikesraTable}': ${file.replace(`${pluginDir}/`, "")}`,
		);
	}
}

if (violations.length > 0) {
	console.error("SIKESRA data-boundary guard failed.");
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log("SIKESRA data-boundary guard passed.");

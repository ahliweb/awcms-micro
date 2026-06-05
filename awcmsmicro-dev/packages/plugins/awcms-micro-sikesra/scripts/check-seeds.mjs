import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const migrationsDir = resolve(pluginDir, "migrations");
const seedsDir = resolve(pluginDir, "seeds");

const createTablePattern = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const insertTablePattern = /INSERT\s+OR\s+IGNORE\s+INTO\s+[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const destructiveSeedPattern = /\b(?:DROP|DELETE|UPDATE|ALTER|TRUNCATE)\b/i;
const tenantPlaceholder = "__TENANT_ID__";
const sitePlaceholder = "__SITE_ID__";

function readSqlFiles(dir) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((file) => file.endsWith(".sql"))
		.map((file) => ({ file, sql: readFileSync(join(dir, file), "utf8") }));
}

const migrationTables = new Set();
for (const { sql } of readSqlFiles(migrationsDir)) {
	for (const match of sql.matchAll(createTablePattern)) migrationTables.add(match[1]);
}

const violations = [];
for (const { file, sql } of readSqlFiles(seedsDir)) {
	if (!/^[\x00-\x7F]*$/.test(sql)) violations.push(`${file} contains non-ASCII content`);
	if (destructiveSeedPattern.test(sql)) violations.push(`${file} contains destructive SQL`);
	if (!sql.includes(tenantPlaceholder)) violations.push(`${file} missing ${tenantPlaceholder}`);
	if (!sql.includes(sitePlaceholder)) violations.push(`${file} missing ${sitePlaceholder}`);

	let insertCount = 0;
	for (const match of sql.matchAll(insertTablePattern)) {
		insertCount += 1;
		const table = match[1] ?? "";
		if (!table.startsWith("sikesra_")) violations.push(`${file} inserts into non-SIKESRA table: ${table}`);
		if (!migrationTables.has(table)) violations.push(`${file} inserts into missing table: ${table}`);
	}
	if (insertCount === 0) violations.push(`${file} does not insert any seed rows`);
}

if (violations.length > 0) {
	console.error("SIKESRA seed guard failed.");
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log("SIKESRA seed guard passed.");

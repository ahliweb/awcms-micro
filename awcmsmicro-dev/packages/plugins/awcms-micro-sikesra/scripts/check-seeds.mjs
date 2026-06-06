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
const storageKeyPattern = /tenants\/__TENANT_ID__\/sites\/__SITE_ID__\/modules\/sikesra\/(?:internal|restricted|highly_restricted|public_safe)\/\d{4}\/\d{2}\/[a-z0-9._-]+/;
const requiredModules = [
	"rumah_ibadah",
	"lembaga_keagamaan",
	"pendidikan_keagamaan",
	"lks",
	"guru_agama",
	"anak_yatim",
	"disabilitas",
	"lansia_terlantar",
];

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
function isAsciiSafe(value) {
	for (let index = 0; index < value.length; index += 1) {
		if (value.charCodeAt(index) > 0x7f) return false;
	}
	return true;
}

for (const { file, sql } of readSqlFiles(seedsDir)) {
	if (!isAsciiSafe(sql)) violations.push(`${file} contains non-ASCII content`);
	if (destructiveSeedPattern.test(sql)) violations.push(`${file} contains destructive SQL`);
	if (!sql.includes(tenantPlaceholder)) violations.push(`${file} missing ${tenantPlaceholder}`);
	if (!sql.includes(sitePlaceholder)) violations.push(`${file} missing ${sitePlaceholder}`);
	for (const storageKeyMatch of sql.matchAll(/'([^']*modules\/sikesra[^']*)'/g)) {
		if (!storageKeyPattern.test(storageKeyMatch[1] ?? "")) {
			violations.push(`${file} has invalid SIKESRA storage key: ${storageKeyMatch[1]}`);
		}
	}
	const seededRegions = new Set(
		[...sql.matchAll(/'(__TENANT_ID__)',\s*'(__SITE_ID__)',\s*'([0-9]{2,10})',/g)].map(
			(match) => match[3],
		),
	);
	for (const regionMatch of sql.matchAll(/'region_scope(?:_code)?'?,?\s*'([0-9]{2,10})'|'region_scope_code'[^\n]*'([0-9]{2,10})'/g)) {
		const regionCode = regionMatch[1] ?? regionMatch[2];
		if (regionCode && !seededRegions.has(regionCode)) {
			violations.push(`${file} references unseeded region scope: ${regionCode}`);
		}
	}
	for (const module of requiredModules) {
		if (!new RegExp(`'${module}'`).test(sql)) violations.push(`${file} missing module seed: ${module}`);
		if (!sql.includes(`sikesra_${module}_details`)) {
			violations.push(`${file} missing module detail seed table: sikesra_${module}_details`);
		}
	}

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

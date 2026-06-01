import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, "..");
const migrationsDir = resolve(pluginDir, "migrations");

function readSql() {
	if (!existsSync(migrationsDir)) return "";
	return readdirSync(migrationsDir)
		.filter((entry) => entry.endsWith(".sql"))
		.map((file) => readFileSync(join(migrationsDir, file), "utf8"))
		.join("\n");
}

function tableBlock(sql, table) {
	return new RegExp(`CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${table}[\\s\\S]*?;`, "i").exec(sql)?.[0] ?? "";
}

const sql = readSql();
const fileObjects = tableBlock(sql, "sikesra_file_objects");
const documents = tableBlock(sql, "sikesra_supporting_documents");
const violations = [];

if (!fileObjects) violations.push("missing sikesra_file_objects table");
if (!documents) violations.push("missing sikesra_supporting_documents table");

for (const column of ["storage_key", "checksum_sha256", "classification", "validation_status"]) {
	if (fileObjects && !new RegExp(`\\b${column}\\b`, "i").test(fileObjects)) {
		violations.push(`sikesra_file_objects missing ${column}`);
	}
}

for (const column of ["registry_entity_id", "file_object_id", "classification", "validation_status"]) {
	if (documents && !new RegExp(`\\b${column}\\b`, "i").test(documents)) {
		violations.push(`sikesra_supporting_documents missing ${column}`);
	}
}

if (!/idx_sikesra_supporting_documents_file/i.test(sql)) {
	violations.push("missing supporting-documents file_object_id index");
}
if (!/idx_sikesra_file_objects_checksum/i.test(sql)) {
	violations.push("missing file-object checksum index");
}

if (violations.length > 0) {
	console.error("SIKESRA file-link guard failed.");
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log("SIKESRA file-link guard passed.");

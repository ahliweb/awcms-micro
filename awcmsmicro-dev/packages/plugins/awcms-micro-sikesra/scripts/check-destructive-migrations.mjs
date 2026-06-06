import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(scriptDir, "../migrations");
const ALLOW_MARKER = "awcms-sikesra-allow-destructive-migration";
const ADD_COLUMN_GUARD_MARKER = "awcms-sikesra-idempotent-add-column";
const REQUIRED_DESTRUCTIVE_MARKERS = ["backup-note:", "rollback-note:", "approval:"];
const destructivePatterns = [
	{ label: "DROP TABLE", pattern: /\bDROP\s+TABLE\b/i },
	{ label: "DROP COLUMN", pattern: /\bDROP\s+COLUMN\b/i },
	{ label: "DELETE FROM sikesra_", pattern: /\bDELETE\s+FROM\s+[`"]?sikesra_/i },
	{ label: "TRUNCATE", pattern: /\bTRUNCATE\b/i },
	{ label: "CREATE OR REPLACE TABLE", pattern: /\bCREATE\s+OR\s+REPLACE\s+TABLE\b/i },
];

const violations = [];

if (existsSync(migrationsDir)) {
	for (const file of readdirSync(migrationsDir).filter((entry) => entry.endsWith(".sql"))) {
		const sql = readFileSync(join(migrationsDir, file), "utf8");
		if (sql.includes(ALLOW_MARKER)) {
			for (const marker of REQUIRED_DESTRUCTIVE_MARKERS) {
				if (!sql.includes(marker)) violations.push(`${file}: ${ALLOW_MARKER} missing ${marker}`);
			}
			continue;
		}
		if (/\bALTER\s+TABLE\b[\s\S]*?\bADD\s+COLUMN\b/i.test(sql) && !sql.includes(ADD_COLUMN_GUARD_MARKER)) {
			violations.push(`${file}: ALTER TABLE ADD COLUMN missing ${ADD_COLUMN_GUARD_MARKER}`);
		}
		for (const { label, pattern } of destructivePatterns) {
			if (pattern.test(sql)) violations.push(`${file}: ${label}`);
		}
	}
}

if (violations.length > 0) {
	console.error("SIKESRA destructive migration guard failed.");
	console.error(`Add ${ALLOW_MARKER} only after backup, rollback, and approval notes exist.`);
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log("SIKESRA destructive migration guard passed.");

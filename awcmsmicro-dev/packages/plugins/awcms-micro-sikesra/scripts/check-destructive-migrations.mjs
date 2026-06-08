import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(scriptDir, "../migrations");
const ALLOW_MARKER = "awcms-sikesra-allow-destructive-migration";
const ADD_COLUMN_GUARD_MARKER = "awcms-sikesra-idempotent-add-column";
const REQUIRED_DESTRUCTIVE_MARKERS = ["backup-note:", "rollback-note:", "approval:"];
const addColumnPattern = /\bALTER\s+TABLE\s+[`"]?([a-zA-Z0-9_]+)[`"]?\s+ADD\s+COLUMN\s+[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const destructivePatterns = [
	{ label: "DROP TABLE", pattern: /\bDROP\s+TABLE\b/i },
	{ label: "DROP INDEX", pattern: /\bDROP\s+INDEX\b/i },
	{ label: "DROP TRIGGER", pattern: /\bDROP\s+TRIGGER\b/i },
	{ label: "DROP COLUMN", pattern: /\bDROP\s+COLUMN\b/i },
	{ label: "ALTER TABLE RENAME", pattern: /\bALTER\s+TABLE\s+[`"]?sikesra_[a-zA-Z0-9_]*[`"]?\s+RENAME\b/i },
	{ label: "RENAME COLUMN", pattern: /\bRENAME\s+COLUMN\b/i },
	{ label: "CREATE TABLE AS", pattern: /\bCREATE\s+TABLE\s+[`"]?sikesra_[a-zA-Z0-9_]*[`"]?\s+AS\b/i },
	{ label: "UPDATE sikesra_", pattern: /\bUPDATE\s+[`"]?sikesra_/i },
	{ label: "REPLACE INTO", pattern: /\bREPLACE\s+INTO\s+[`"]?sikesra_/i },
	{ label: "INSERT OR REPLACE", pattern: /\bINSERT\s+OR\s+REPLACE\s+INTO\s+[`"]?sikesra_/i },
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
		const addColumnStatements = Array.from(sql.matchAll(addColumnPattern), (match) => ({
			table: match[1] ?? "",
			column: match[2] ?? "",
		}));
		if (addColumnStatements.length > 0) {
			const markerLines = sql
				.split("\n")
				.filter((line) => line.includes(ADD_COLUMN_GUARD_MARKER));
			if (markerLines.length === 0) {
				violations.push(`${file}: ALTER TABLE ADD COLUMN missing ${ADD_COLUMN_GUARD_MARKER}`);
			}
			for (const { table, column } of addColumnStatements) {
				const matchingMarker = markerLines.find(
					(line) =>
						line.includes(`table=${table}`) &&
						line.includes(`PRAGMA table_info(${table})`) &&
						new RegExp(`\\bcolumns=[^\\n]*\\b${column}\\b`).test(line),
				);
				if (!matchingMarker) {
					violations.push(
						`${file}: ADD COLUMN ${table}.${column} missing structured ${ADD_COLUMN_GUARD_MARKER} marker`,
					);
				}
			}
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

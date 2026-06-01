import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { AWCMS_SIKESRA_D1_TABLE_NAMES } from "../src/runtime.js";

const MIGRATIONS_DIR = resolve(import.meta.dirname, "../migrations");
const CREATE_TABLE_PATTERN = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const CREATE_INDEX_PATTERN = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const CREATE_TRIGGER_PATTERN = /CREATE\s+TRIGGER\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;

function readMigrationSqlFiles() {
	if (!existsSync(MIGRATIONS_DIR)) return [];
	return readdirSync(MIGRATIONS_DIR)
		.filter((file) => file.endsWith(".sql"))
		.map((file) => ({ file, sql: readFileSync(join(MIGRATIONS_DIR, file), "utf8") }));
}

describe("SIKESRA D1 migration prefix policy", () => {
	it("declares only sikesra_ target D1 tables", () => {
		expect(AWCMS_SIKESRA_D1_TABLE_NAMES.length).toBeGreaterThan(0);
		expect(AWCMS_SIKESRA_D1_TABLE_NAMES.every((table) => table.startsWith("sikesra_"))).toBe(
			true,
		);
	});

	it("uses only prefixed table, index, and trigger names in SQL migrations", () => {
		for (const { file, sql } of readMigrationSqlFiles()) {
			for (const match of sql.matchAll(CREATE_TABLE_PATTERN)) {
				expect(match[1], `${file} creates non-SIKESRA table`).toMatch(/^sikesra_/);
			}
			for (const match of sql.matchAll(CREATE_INDEX_PATTERN)) {
				expect(match[1], `${file} creates non-SIKESRA index`).toMatch(/^idx_sikesra_/);
			}
			for (const match of sql.matchAll(CREATE_TRIGGER_PATTERN)) {
				expect(match[1], `${file} creates non-SIKESRA trigger`).toMatch(/^trg_sikesra_/);
			}
		}
	});
});

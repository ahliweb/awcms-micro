import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { SIKESRA_D1_TABLES, SIKESRA_MIGRATION_FILES } from "../src/db/index.js";
import { AWCMS_SIKESRA_D1_TABLE_NAMES } from "../src/runtime.js";

const MIGRATIONS_DIR = resolve(import.meta.dirname, "../migrations");
const CREATE_TABLE_PATTERN =
	/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const CREATE_INDEX_PATTERN =
	/CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;
const CREATE_TRIGGER_PATTERN =
	/CREATE\s+TRIGGER\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?/gi;

const REQUIRED_REGISTRY_TABLES = [
	"sikesra_registry_entities",
	"sikesra_person_profiles",
	"sikesra_entity_people",
	"sikesra_rumah_ibadah_details",
	"sikesra_lembaga_keagamaan_details",
	"sikesra_pendidikan_keagamaan_details",
	"sikesra_lks_details",
	"sikesra_guru_agama_details",
	"sikesra_anak_yatim_details",
	"sikesra_disabilitas_details",
	"sikesra_lansia_terlantar_details",
] as const;

const REQUIRED_BUSINESS_COLUMNS = [
	"tenant_id",
	"site_id",
	"created_at",
	"updated_at",
	"deleted_at",
	"created_by",
	"updated_by",
] as const;

const REQUIRED_REGISTRY_INDEXES = [
	"idx_sikesra_entities_tenant_site",
	"idx_sikesra_entities_type_status",
	"idx_sikesra_entities_region",
	"idx_sikesra_entities_code",
] as const;

const REQUIRED_AUDIT_COLUMNS = [
	"id",
	"tenant_id",
	"site_id",
	"timestamp",
	"kind",
	"scope",
	"actor_user_id",
	"actor_name",
	"summary",
	"metadata_json",
	"request_id",
	"ip_hash",
	"user_agent_hash",
	"created_at",
] as const;

function readMigrationSqlFiles() {
	if (!existsSync(MIGRATIONS_DIR)) return [];
	return readdirSync(MIGRATIONS_DIR)
		.filter((file) => file.endsWith(".sql"))
		.map((file) => ({ file, sql: readFileSync(join(MIGRATIONS_DIR, file), "utf8") }));
}

function readAllMigrationSql() {
	return readMigrationSqlFiles()
		.map(({ sql }) => sql)
		.join("\n");
}

function getTableDefinition(sql: string, table: string) {
	const match = new RegExp(
		`CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${table}\\s*\\(([\\s\\S]*?)\\n\\);`,
		"i",
	).exec(sql);
	return match?.[1] ?? "";
}

describe("SIKESRA D1 migration prefix policy", () => {
	it("declares only sikesra_ target D1 tables", () => {
		expect(AWCMS_SIKESRA_D1_TABLE_NAMES.length).toBeGreaterThan(0);
		expect(AWCMS_SIKESRA_D1_TABLE_NAMES.every((table) => table.startsWith("sikesra_"))).toBe(true);
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

	it("keeps every SQL migration file in the static migration registry", () => {
		const sqlFiles = readMigrationSqlFiles().map(({ file }) => file);

		expect([...SIKESRA_MIGRATION_FILES]).toEqual(sqlFiles.toSorted());
	});

	it("keeps created migration tables in the repository and runtime table catalogs", () => {
		const repositoryTables = new Set<string>(Object.values(SIKESRA_D1_TABLES));
		const runtimeTables = new Set<string>(AWCMS_SIKESRA_D1_TABLE_NAMES);

		for (const { file, sql } of readMigrationSqlFiles()) {
			for (const match of sql.matchAll(CREATE_TABLE_PATTERN)) {
				const table = match[1] ?? "";
				expect(
					repositoryTables.has(table),
					`${file} creates table missing from repository catalog`,
				).toBe(true);
				expect(runtimeTables.has(table), `${file} creates table missing from runtime catalog`).toBe(
					true,
				);
			}
		}
	});

	it("includes the field standard registry table in D1 catalogs", () => {
		expect(Object.values(SIKESRA_D1_TABLES)).toContain("sikesra_field_standards");
		expect(AWCMS_SIKESRA_D1_TABLE_NAMES).toContain("sikesra_field_standards");
	});

	it("defines required registry and module detail tables for all SIKESRA modules", () => {
		const sql = readAllMigrationSql();
		const repositoryTables = new Set<string>(Object.values(SIKESRA_D1_TABLES));
		const runtimeTables = new Set<string>(AWCMS_SIKESRA_D1_TABLE_NAMES);

		for (const table of REQUIRED_REGISTRY_TABLES) {
			expect(repositoryTables.has(table), `${table} missing from repository catalog`).toBe(true);
			expect(runtimeTables.has(table), `${table} missing from runtime catalog`).toBe(true);
			const definition = getTableDefinition(sql, table);
			expect(definition, `${table} migration definition missing`).not.toBe("");
			for (const column of REQUIRED_BUSINESS_COLUMNS) {
				expect(definition, `${table} missing ${column}`).toContain(column);
			}
		}
	});

	it("declares issue #125 registry query indexes", () => {
		const sql = readAllMigrationSql();
		for (const index of REQUIRED_REGISTRY_INDEXES) {
			expect(sql, `${index} missing`).toMatch(
				new RegExp(`CREATE\\s+INDEX\\s+IF\\s+NOT\\s+EXISTS\\s+${index}\\b`, "i"),
			);
		}
	});

	it("defines canonical audit event columns required by issue #133", () => {
		const definition = getTableDefinition(readAllMigrationSql(), "sikesra_audit_events");
		expect(definition).not.toBe("");
		for (const column of REQUIRED_AUDIT_COLUMNS) {
			expect(definition, `sikesra_audit_events missing ${column}`).toContain(column);
		}
	});
});

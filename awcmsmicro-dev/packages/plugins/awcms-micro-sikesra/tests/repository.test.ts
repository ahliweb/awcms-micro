import { describe, expect, it } from "vitest";

import type { SikesraD1Database } from "../src/db/index.js";
import {
	assertSikesraTableName,
	createSikesraRepositories,
	createRegistryRepository,
	SIKESRA_D1_TABLES,
} from "../src/db/index.js";

function createRecordingDb(rows: unknown[] = []) {
	const calls: Array<{ query: string; bindings: unknown[] }> = [];
	const db: SikesraD1Database = {
		prepare<T = unknown>(query: string) {
			const call = { query, bindings: [] as unknown[] };
			calls.push(call);
			return {
				bind(...values: unknown[]) {
					call.bindings = values;
					return this;
				},
				async all() {
					return { results: rows as T[] };
				},
				async first() {
					return (rows[0] as T | undefined) ?? null;
				},
			};
		},
	};

	return { calls, db };
}

describe("SIKESRA D1 repositories", () => {
	it("guards normal reads by tenant, site, and soft delete", async () => {
		const { calls, db } = createRecordingDb([{ id: "registry-1" }]);
		const repository = createRegistryRepository(db, { tenantId: "tenant-1", siteId: "site-1" });

		await repository.listActive();

		expect(calls[0]?.query).toContain("FROM sikesra_registry_entities");
		expect(calls[0]?.query).toContain("tenant_id = ?");
		expect(calls[0]?.query).toContain("site_id = ?");
		expect(calls[0]?.query).toContain("deleted_at IS NULL");
		expect(calls[0]?.bindings).toEqual(["tenant-1", "site-1"]);
	});

	it("guards ID lookups by tenant, site, ID, and soft delete", async () => {
		const { calls, db } = createRecordingDb([{ id: "registry-1" }]);
		const repository = createRegistryRepository(db, { tenantId: "tenant-1", siteId: "site-1" });

		await repository.getActiveById("registry-1");

		expect(calls[0]?.query).toContain("FROM sikesra_registry_entities");
		expect(calls[0]?.query).toContain("id = ?");
		expect(calls[0]?.query).toContain("deleted_at IS NULL");
		expect(calls[0]?.bindings).toEqual(["tenant-1", "site-1", "registry-1"]);
	});

	it("rejects non-SIKESRA table names", () => {
		expect(() => assertSikesraTableName("users")).toThrow(/sikesra_/);
		expect(() => assertSikesraTableName(SIKESRA_D1_TABLES.auditEvents)).not.toThrow();
	});

	it("creates domain repositories that only target SIKESRA tables", () => {
		const { db } = createRecordingDb();
		const repositories = createSikesraRepositories(db, { tenantId: "tenant-1", siteId: "site-1" });

		expect(Object.keys(repositories)).toEqual([
			"settings",
			"regions",
			"registry",
			"verification",
			"documents",
			"imports",
			"access",
			"abac",
			"audit",
		]);
		expect(
			Object.values(repositories).every((repository) => repository.table.startsWith("sikesra_")),
		).toBe(true);
	});

	it("reads and writes settings through the dedicated SIKESRA D1 settings table", async () => {
		const { calls, db } = createRecordingDb([{ key: "publicStatusLabel", value_json: '"Online"' }]);
		const repository = createSikesraRepositories(db, {
			tenantId: "tenant-1",
			siteId: "site-1",
		}).settings;

		await expect(repository.getJsonByKey<string>("publicStatusLabel")).resolves.toBe("Online");
		await repository.upsertJson("publicStatusLabel", "Ready");

		expect(calls[0]?.query).toContain("FROM sikesra_settings");
		expect(calls[0]?.query).toContain("key = ?");
		expect(calls[0]?.bindings).toEqual(["tenant-1", "site-1", "publicStatusLabel"]);
		expect(calls[1]?.query).toContain("INSERT INTO sikesra_settings");
		expect(calls[1]?.query).toContain("ON CONFLICT(tenant_id, site_id, key)");
		expect(calls[1]?.query).toContain("WHERE sikesra_settings.deleted_at IS NULL");
		expect(calls[1]?.query).not.toContain("deleted_at = NULL");
		expect(calls[1]?.bindings.slice(0, 4)).toEqual([
			"tenant-1",
			"site-1",
			"publicStatusLabel",
			'"Ready"',
		]);
	});
});

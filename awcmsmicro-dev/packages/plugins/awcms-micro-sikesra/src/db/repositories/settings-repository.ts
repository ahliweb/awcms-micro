import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraSettingsRow extends SikesraScopedRow {
	key: string;
	value_json: string;
}

async function executeMutation(statement: {
	run?: () => Promise<unknown>;
	all: () => Promise<unknown>;
}) {
	if (statement.run) return statement.run();
	return statement.all();
}

export function createSettingsRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	const scoped = createScopedRepository<SikesraSettingsRow>(db, scope, SIKESRA_D1_TABLES.settings);

	return {
		...scoped,
		async getJsonByKey<T>(key: string): Promise<T | null> {
			const row = await db
				.prepare<SikesraSettingsRow>(
					`SELECT * FROM ${SIKESRA_D1_TABLES.settings} WHERE tenant_id = ? AND site_id = ? AND key = ? AND deleted_at IS NULL`,
				)
				.bind(scope.tenantId, scope.siteId, key)
				.first();

			if (!row) return null;
			return JSON.parse(row.value_json) as T;
		},
		async upsertJson(key: string, value: unknown): Promise<void> {
			const now = new Date().toISOString();
			const statement = db
				.prepare(
					`INSERT INTO ${SIKESRA_D1_TABLES.settings} (tenant_id, site_id, key, value_json, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, NULL) ON CONFLICT(tenant_id, site_id, key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at, deleted_at = NULL`,
				)
				.bind(scope.tenantId, scope.siteId, key, JSON.stringify(value), now, now);

			await executeMutation(statement);
		},
	};
}

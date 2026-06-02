import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { assertSikesraTableName, type SikesraD1TableName } from "../schema.js";

export interface SikesraScopedRow {
	tenant_id: string;
	site_id: string;
	deleted_at?: string | null;
}

export interface SikesraScopedRepository<T extends SikesraScopedRow> {
	readonly table: SikesraD1TableName;
	listActive(): Promise<T[]>;
	getActiveById(id: string): Promise<T | null>;
}

export function createScopedRepository<T extends SikesraScopedRow>(
	db: SikesraD1Database,
	scope: SikesraRepositoryScope,
	table: SikesraD1TableName,
): SikesraScopedRepository<T> {
	assertSikesraTableName(table);

	return {
		table,
		async listActive() {
			const statement = db
				.prepare<T>(
					`SELECT * FROM ${table} WHERE tenant_id = ? AND site_id = ? AND deleted_at IS NULL`,
				)
				.bind(scope.tenantId, scope.siteId);
			const result = await statement.all();
			return result.results ?? [];
		},
		async getActiveById(id: string) {
			return db
				.prepare<T>(
					`SELECT * FROM ${table} WHERE tenant_id = ? AND site_id = ? AND id = ? AND deleted_at IS NULL`,
				)
				.bind(scope.tenantId, scope.siteId, id)
				.first();
		},
	};
}

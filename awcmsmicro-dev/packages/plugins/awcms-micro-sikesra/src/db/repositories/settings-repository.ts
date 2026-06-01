import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraSettingsRow extends SikesraScopedRow {
	key: string;
	value_json: string;
}

export function createSettingsRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraSettingsRow>(db, scope, SIKESRA_D1_TABLES.settings);
}

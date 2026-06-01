import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraImportBatchRow extends SikesraScopedRow {
	id: string;
	entity_type: string;
	status: string;
}

export function createImportRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraImportBatchRow>(db, scope, SIKESRA_D1_TABLES.importBatches);
}

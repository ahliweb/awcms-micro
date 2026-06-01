import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraDocumentRow extends SikesraScopedRow {
	id: string;
	registry_entity_id: string;
	document_type: string;
}

export function createDocumentsRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraDocumentRow>(db, scope, SIKESRA_D1_TABLES.documents);
}

import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraVerificationEventRow extends SikesraScopedRow {
	id: string;
	registry_entity_id: string;
	decision: string;
}

export function createVerificationRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraVerificationEventRow>(
		db,
		scope,
		SIKESRA_D1_TABLES.verificationEvents,
	);
}

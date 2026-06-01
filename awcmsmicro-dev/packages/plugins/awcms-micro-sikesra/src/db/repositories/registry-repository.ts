import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraRegistryEntityRow extends SikesraScopedRow {
	id: string;
	code: string;
	label?: string;
	entity_type: string;
	verification_stage: string;
	sensitivity?: string;
	public_summary?: string;
}

export function createRegistryRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraRegistryEntityRow>(db, scope, SIKESRA_D1_TABLES.registryEntities);
}

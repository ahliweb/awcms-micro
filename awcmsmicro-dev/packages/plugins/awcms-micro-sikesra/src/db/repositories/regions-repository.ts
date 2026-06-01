import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraRegionRow extends SikesraScopedRow {
	code: string;
	level: string;
	name: string;
}

export function createRegionsRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraRegionRow>(db, scope, SIKESRA_D1_TABLES.regions);
}

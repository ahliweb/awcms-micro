import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraAuditEventRow extends SikesraScopedRow {
	id: string;
	kind: string;
	scope: string;
	summary: string;
}

export function createAuditRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraAuditEventRow>(db, scope, SIKESRA_D1_TABLES.auditEvents);
}

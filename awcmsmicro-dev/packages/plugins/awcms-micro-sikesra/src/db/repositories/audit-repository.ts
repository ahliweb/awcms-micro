import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraAuditEventRow extends SikesraScopedRow {
	id: string;
	timestamp: string;
	kind: string;
	scope: string;
	actor_user_id: string | null;
	actor_name: string | null;
	summary: string;
	metadata_json: string;
	request_id: string | null;
	ip_hash: string | null;
	user_agent_hash: string | null;
}

export function createAuditRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraAuditEventRow>(db, scope, SIKESRA_D1_TABLES.auditEvents);
}

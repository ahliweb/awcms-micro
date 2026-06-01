import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraUserRoleAssignmentRow extends SikesraScopedRow {
	id: string;
	emdash_user_id: string;
	sikesra_role_slug: string;
}

export function createAccessRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraUserRoleAssignmentRow>(db, scope, SIKESRA_D1_TABLES.userRoles);
}

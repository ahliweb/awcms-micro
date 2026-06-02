import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { SIKESRA_D1_TABLES } from "../schema.js";
import { createScopedRepository, type SikesraScopedRow } from "./scoped-repository.js";

export interface SikesraAbacPolicyRuleRow extends SikesraScopedRow {
	id: string;
	effect: string;
	actions_json: string;
}

export function createAbacRepository(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return createScopedRepository<SikesraAbacPolicyRuleRow>(
		db,
		scope,
		SIKESRA_D1_TABLES.abacPolicies,
	);
}

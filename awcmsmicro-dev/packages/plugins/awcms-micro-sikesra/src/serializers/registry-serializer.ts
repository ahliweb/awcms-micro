import type { SikesraRegistryListItemDto } from "../contracts/index.js";
import type { SikesraRegistryEntityRow } from "../db/repositories/registry-repository.js";

export function serializeRegistryListItem(
	row: SikesraRegistryEntityRow,
): SikesraRegistryListItemDto {
	return {
		id: row.id,
		code: row.code,
		label: "label" in row && typeof row.label === "string" ? row.label : row.code,
		entityType: row.entity_type,
		verificationStage: row.verification_stage,
		sensitivity:
			"sensitivity" in row && typeof row.sensitivity === "string"
				? (row.sensitivity as SikesraRegistryListItemDto["sensitivity"])
				: "restricted",
		publicSummary:
			"public_summary" in row && typeof row.public_summary === "string"
				? row.public_summary
				: undefined,
	};
}

import type { SikesraPublicAggregateDto } from "../contracts/index.js";

export function serializePublicAggregate(
	input: SikesraPublicAggregateDto,
): SikesraPublicAggregateDto {
	return {
		statusLabel: input.statusLabel,
		updatedAt: input.updatedAt,
		categories: input.categories.map((category) => ({
			key: category.key,
			label: category.label,
			count: category.suppressed ? null : category.count,
			suppressed: category.suppressed,
			suppressionReason: category.suppressionReason,
		})),
	};
}

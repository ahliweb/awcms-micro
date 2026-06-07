import type { SikesraPublicAggregateDto } from "../contracts/index.js";

export function serializePublicAggregate(
	input: SikesraPublicAggregateDto,
): SikesraPublicAggregateDto {
	return {
		caveat: input.caveat,
		categories: input.categories.map((category) => ({
			code: category.code,
			label: category.label,
			total: category.suppressed ? 0 : category.total,
			verified: category.suppressed ? 0 : category.verified,
			suppressed: category.suppressed,
			suppressionReason: category.suppressionReason,
		})),
	};
}

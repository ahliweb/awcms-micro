import { sikesraOk, type SikesraApiSuccess, type SikesraPublicAggregateDto } from "../contracts/index.js";
import { serializePublicAggregate } from "../serializers/index.js";

export interface SikesraPublicAggregateService {
	serializeAggregate(input: SikesraPublicAggregateDto): SikesraApiSuccess<SikesraPublicAggregateDto>;
}

export function createPublicAggregateService(): SikesraPublicAggregateService {
	return {
		serializeAggregate(input) {
			return sikesraOk(serializePublicAggregate(input));
		},
	};
}

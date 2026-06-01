import type { SikesraCustomAttributeValueRequest } from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraCustomAttributeService {
	saveValue(input: SikesraCustomAttributeValueRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createCustomAttributeService(): SikesraCustomAttributeService {
	return {
		async saveValue() {
			return serviceNotImplemented("Custom attribute value");
		},
	};
}

import type { SikesraVerificationDecisionRequest } from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraVerificationService {
	advance(input: SikesraVerificationDecisionRequest): Promise<SikesraServiceResult<unknown>>;
	reject(input: SikesraVerificationDecisionRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createVerificationService(): SikesraVerificationService {
	return {
		async advance() {
			return serviceNotImplemented("Verification advance");
		},
		async reject() {
			return serviceNotImplemented("Verification reject");
		},
	};
}

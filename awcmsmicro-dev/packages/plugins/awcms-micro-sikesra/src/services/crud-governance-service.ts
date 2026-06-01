import type { SikesraRestoreRequest, SikesraSoftDeleteRequest } from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraCrudGovernanceService {
	softDelete(input: SikesraSoftDeleteRequest): Promise<SikesraServiceResult<unknown>>;
	restore(input: SikesraRestoreRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createCrudGovernanceService(): SikesraCrudGovernanceService {
	return {
		async softDelete() {
			return serviceNotImplemented("Soft delete governance");
		},
		async restore() {
			return serviceNotImplemented("Restore governance");
		},
	};
}

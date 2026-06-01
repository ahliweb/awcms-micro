import type { SikesraImportPromotionRequest } from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraImportService {
	promote(input: SikesraImportPromotionRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createImportService(): SikesraImportService {
	return {
		async promote() {
			return serviceNotImplemented("Import promotion");
		},
	};
}

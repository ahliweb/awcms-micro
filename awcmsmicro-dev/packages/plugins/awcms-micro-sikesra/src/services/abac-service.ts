import type { SikesraAbacPreviewRequest } from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraAbacService {
	preview(input: SikesraAbacPreviewRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createAbacService(): SikesraAbacService {
	return {
		async preview() {
			return serviceNotImplemented("ABAC preview");
		},
	};
}

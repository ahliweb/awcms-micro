import type { SikesraExportCreateRequest } from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraExportService {
	create(input: SikesraExportCreateRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createExportService(): SikesraExportService {
	return {
		async create() {
			return serviceNotImplemented("Export job");
		},
	};
}

import type { SikesraDocumentMetadataRequest } from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraDocumentService {
	saveMetadata(input: SikesraDocumentMetadataRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createDocumentService(): SikesraDocumentService {
	return {
		async saveMetadata() {
			return serviceNotImplemented("Document metadata");
		},
	};
}

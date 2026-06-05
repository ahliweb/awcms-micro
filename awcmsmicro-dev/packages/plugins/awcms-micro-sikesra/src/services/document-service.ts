import type { SikesraDocumentDto, SikesraDocumentMetadataRequest } from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

const ALLOWED_DOCUMENT_CLASSIFICATIONS = new Set(["public_safe", "internal", "restricted"]);

export interface SikesraDocumentService {
	saveMetadata(input: SikesraDocumentMetadataRequest): Promise<SikesraServiceResult<SikesraDocumentDto>>;
}

function createDocumentId(input: SikesraDocumentMetadataRequest) {
	const titleKey = input.title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	return `${input.registryEntityId.trim()}:document:${titleKey || "metadata"}`;
}

function validateDocumentMetadata(input: SikesraDocumentMetadataRequest) {
	const fieldErrors: Record<string, string[]> = {};
	if (!input.registryEntityId.trim()) fieldErrors.registryEntityId = ["Registry entity ID is required."];
	if (!input.title.trim()) fieldErrors.title = ["Document title is required."];
	if (!input.documentType.trim()) fieldErrors.documentType = ["Document type is required."];
	if (!ALLOWED_DOCUMENT_CLASSIFICATIONS.has(input.classification)) {
		fieldErrors.classification = ["Classification must be public_safe, internal, or restricted."];
	}
	if (input.fileSizeBytes !== undefined && input.fileSizeBytes < 0) {
		fieldErrors.fileSizeBytes = ["File size must not be negative."];
	}
	return fieldErrors;
}

export function createDocumentService(): SikesraDocumentService {
	return {
		async saveMetadata(input) {
			const fieldErrors = validateDocumentMetadata(input);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Document metadata failed validation.",
					fieldErrors,
				});
			}
			return serviceOk({
				id: createDocumentId(input),
				registryEntityId: input.registryEntityId.trim(),
				title: input.title.trim(),
				documentType: input.documentType.trim(),
				classification: input.classification,
				validationStatus: "pending",
				fileObjectId: input.fileObjectId?.trim() || undefined,
				contentType: input.contentType?.trim() || undefined,
				fileSizeBytes: input.fileSizeBytes,
				checksumSha256: input.checksumSha256?.trim() || undefined,
			});
		},
	};
}

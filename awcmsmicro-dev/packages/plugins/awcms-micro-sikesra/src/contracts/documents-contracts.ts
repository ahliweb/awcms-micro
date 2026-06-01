import type { SikesraPaginationRequest } from "./pagination.js";

export interface SikesraDocumentsListRequest extends SikesraPaginationRequest {
	registryEntityId?: string;
	classification?: string;
	validationStatus?: string;
}

export interface SikesraDocumentMetadataRequest {
	registryEntityId: string;
	title: string;
	documentType: string;
	classification: string;
	fileObjectId?: string;
	contentType?: string;
	fileSizeBytes?: number;
	checksumSha256?: string;
	originalFilename?: string;
	safeFilename?: string;
}

export interface SikesraDocumentAccessRequest {
	id: string;
}

export interface SikesraDocumentDto {
	id: string;
	registryEntityId: string;
	title: string;
	documentType: string;
	classification: string;
	validationStatus: string;
	fileObjectId?: string;
	contentType?: string;
	fileSizeBytes?: number;
	checksumSha256?: string;
}

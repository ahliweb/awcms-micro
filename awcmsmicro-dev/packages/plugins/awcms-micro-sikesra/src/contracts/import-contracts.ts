import type { SikesraPaginationRequest } from "./pagination.js";

export interface SikesraImportBatchListRequest extends SikesraPaginationRequest {
	status?: string;
	entityType?: string;
}

export interface SikesraImportPromotionRequest {
	batchId?: string;
	rowIds?: string[];
	rows?: unknown[];
}

export interface SikesraImportCreateRequest {
	batchId?: string;
	entityType?: string;
	subtypeCode?: string;
	mappingTemplateId?: string;
	mappingTemplateName?: string;
	fileFormat?: string;
	sourceFilename?: string;
	fileObjectId?: string;
	mapping?: Record<string, string>;
	rows: unknown[];
}

export interface SikesraImportBatchDto {
	id: string;
	entityType: string;
	status: string;
	totalRows: number;
	validRows: number;
	invalidRows: number;
}

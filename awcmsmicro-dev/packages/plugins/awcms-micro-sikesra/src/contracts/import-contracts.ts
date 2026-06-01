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

export interface SikesraImportBatchDto {
	id: string;
	entityType: string;
	status: string;
	totalRows: number;
	validRows: number;
	invalidRows: number;
}

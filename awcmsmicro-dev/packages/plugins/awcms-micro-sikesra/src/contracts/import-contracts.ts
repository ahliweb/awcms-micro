import type { SikesraPaginationRequest } from "./pagination.js";

export interface SikesraImportBatchListRequest extends SikesraPaginationRequest {
	status?: string;
	entityType?: string;
}

export interface SikesraImportStagingListRequest extends SikesraPaginationRequest {
	batchId: string;
	validationStatus?: "valid" | "invalid";
	promotionStatus?: "not_promoted" | "promoted";
	duplicateStatus?: "unchecked" | "duplicate_risk" | "cleared";
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

export interface SikesraImportBatchListItemDto extends SikesraImportBatchDto {
	mappingTemplateId?: string;
	subtypeCode?: string;
	duplicateRiskRows: number;
	promotedRows: number;
	sourceFilename?: string;
	createdAt: string;
	updatedAt: string;
}

export interface SikesraImportStagingRowSummaryDto {
	id: string;
	batchId: string;
	rowNumber: number;
	entityType: string;
	subtypeCode?: string;
	validationStatus: "valid" | "invalid";
	validationErrors: string[];
	duplicateStatus: "unchecked" | "duplicate_risk" | "cleared";
	promotionStatus: "not_promoted" | "promoted";
	promotedRegistryEntityId?: string;
	code?: string;
	label?: string;
	mappedFieldCount: number;
}

import type { SikesraPaginationRequest } from "./pagination.js";

export interface SikesraExportJobListRequest extends SikesraPaginationRequest {
	status?: string;
	sensitivityLevel?: string;
	actorUserId?: string;
}

export interface SikesraExportCreateRequest {
	id?: string;
	exportType: string;
	entityType?: string;
	requestedFields: string[];
	filters?: Record<string, unknown>;
	sensitivityLevel: string;
	reason?: string;
}

export interface SikesraExportJobDto {
	id: string;
	exportType: string;
	status: string;
	sensitivityLevel: string;
	requestedFields?: string[];
	resultSummary?: Record<string, unknown>;
	requestedAt: string;
	completedAt?: string;
}

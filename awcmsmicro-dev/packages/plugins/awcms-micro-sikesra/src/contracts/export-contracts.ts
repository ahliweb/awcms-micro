import type { SikesraPaginationRequest } from "./pagination.js";

export interface SikesraExportJobListRequest extends SikesraPaginationRequest {
	status?: string;
	sensitivityLevel?: string;
	actorUserId?: string;
}

export interface SikesraExportCreateRequest {
	exportType: string;
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
	requestedAt: string;
	completedAt?: string;
}

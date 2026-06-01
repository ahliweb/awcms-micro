import type { SikesraPaginationRequest } from "./pagination.js";

export interface SikesraVerificationListRequest extends SikesraPaginationRequest {
	level?: string;
	stage?: string;
	regionCode?: string;
}

export interface SikesraVerificationDecisionRequest {
	registryEntityId: string;
	verifierLevel: string;
	notes?: string;
	reason?: string;
}

export interface SikesraVerificationEventDto {
	id: string;
	registryEntityId: string;
	fromStage?: string;
	toStage: string;
	decision: string;
	createdAt: string;
}

import type { SikesraPaginationRequest } from "./pagination.js";

export interface SikesraAuditListRequest extends SikesraPaginationRequest {
	kind?: string;
	scope?: string;
	actorUserId?: string;
}

export interface SikesraAuditEventDto {
	id: string;
	timestamp: string;
	kind: string;
	scope: string;
	actorUserId?: string;
	summary: string;
	metadata: Record<string, unknown>;
	redactionPolicy: string;
}

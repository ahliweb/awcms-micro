import type { SikesraPaginationRequest } from "./pagination.js";

export type SikesraDataClass = "non_personal" | "personal" | "sensitive_personal" | "restricted";

export interface SikesraRegistryListRequest extends SikesraPaginationRequest {
	entityType?: string;
	verificationStage?: string;
	regionCode?: string;
}

export interface SikesraRegistryListItemDto {
	id: string;
	code: string;
	label: string;
	entityType: string;
	verificationStage: string;
	sensitivity: SikesraDataClass | "public_safe";
	regionLabel?: string;
	publicSummary?: string;
}

export interface SikesraRegistryCreateRequest {
	entityType: string;
	label: string;
	subtypeCode?: string;
	regionCode?: string;
	fields: Record<string, unknown>;
}

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

export interface SikesraRegistryAddressGroupDto {
	provinceCode?: string;
	regencyCode?: string;
	districtCode?: string;
	villageCode?: string;
	detail?: string;
	rt?: string;
	rw?: string;
	postalCode?: string;
}

export interface SikesraRegistryDomicileAddressGroupDto extends SikesraRegistryAddressGroupDto {
	sameAsKtp?: boolean;
}

export interface SikesraRegistryCreateRequest {
	entityType: string;
	label: string;
	subtypeCode?: string;
	regionCode?: string;
	ktpAddress?: SikesraRegistryAddressGroupDto;
	domicileAddress?: SikesraRegistryDomicileAddressGroupDto;
	fields: Record<string, unknown>;
}

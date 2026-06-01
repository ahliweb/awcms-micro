import type { SikesraFieldDataClass } from "./field-standard-contracts.js";

export interface SikesraCustomAttributeDefinitionDto {
	id: string;
	key: string;
	label: string;
	scope: string;
	dataClass: SikesraFieldDataClass;
	dataType: string;
	maskByDefault: boolean;
}

export interface SikesraCustomAttributeValueRequest {
	definitionId: string;
	ownerType: string;
	ownerId: string;
	value: unknown;
}

import type { SikesraFieldDataClass } from "./field-standard-contracts.js";

export interface SikesraCustomAttributeDefinitionDto {
	id: string;
	key: string;
	label: string;
	scope: string;
	scopeValue?: string;
	entityType?: string;
	subtypeCode?: string;
	targetRegistryEntityId?: string;
	targetSikesraId20?: string;
	dataClass: SikesraFieldDataClass;
	dataType: string;
	publicSafe?: boolean;
	maskByDefault: boolean;
}

export interface SikesraCustomAttributeDefinitionRequest extends Partial<SikesraCustomAttributeDefinitionDto> {
	attributeKey?: string;
	description?: string;
	required?: boolean;
	defaultValue?: unknown;
	enumValues?: unknown[];
	validationRules?: Record<string, unknown>;
	isActive?: boolean;
	isSystem?: boolean;
	isSearchable?: boolean;
	isFilterable?: boolean;
	isImportable?: boolean;
	isExportable?: boolean;
}

export interface SikesraCustomAttributeValueRequest {
	definitionId: string;
	ownerType: string;
	ownerId: string;
	registryEntityId?: string;
	sikesraId20?: string;
	value: unknown;
}

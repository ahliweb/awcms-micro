import type {
	SikesraCustomAttributeOwnerType,
	SikesraCustomAttributeValueRequest,
} from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

const ALLOWED_OWNER_TYPES = new Set<SikesraCustomAttributeOwnerType>([
	"registry",
	"registry_entity",
	"sikesra_id",
	"entity_type",
	"subtype",
]);
const OWNER_TYPE_ERROR_MESSAGE =
	"Owner type must be registry, registry_entity, sikesra_id, entity_type, or subtype.";

export interface SikesraCustomAttributeValueDto {
	id: string;
	definitionId: string;
	ownerType: string;
	ownerId: string;
	registryEntityId?: string;
	sikesraId20?: string;
	value: unknown;
	status: "pending_persistence";
}

export interface SikesraCustomAttributeService {
	saveValue(
		input: SikesraCustomAttributeValueRequest,
	): Promise<SikesraServiceResult<SikesraCustomAttributeValueDto>>;
}

function createCustomAttributeValueId(input: SikesraCustomAttributeValueRequest) {
	return `${input.definitionId.trim()}:${input.ownerType.trim()}:${input.ownerId.trim()}`;
}

function validateCustomAttributeValue(input: SikesraCustomAttributeValueRequest) {
	const fieldErrors: Record<string, string[]> = {};
	if (!input.definitionId.trim()) fieldErrors.definitionId = ["Definition ID is required."];
	if (!ALLOWED_OWNER_TYPES.has(input.ownerType.trim() as SikesraCustomAttributeOwnerType)) {
		fieldErrors.ownerType = [OWNER_TYPE_ERROR_MESSAGE];
	}
	if (!input.ownerId.trim()) fieldErrors.ownerId = ["Owner ID is required."];
	if (input.value === undefined) fieldErrors.value = ["Custom attribute value is required."];
	return fieldErrors;
}

export function createCustomAttributeService(): SikesraCustomAttributeService {
	return {
		async saveValue(input) {
			const fieldErrors = validateCustomAttributeValue(input);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Custom attribute value failed validation.",
					fieldErrors,
				});
			}
			return serviceOk({
				id: createCustomAttributeValueId(input),
				definitionId: input.definitionId.trim(),
				ownerType: input.ownerType.trim(),
				ownerId: input.ownerId.trim(),
				registryEntityId: input.registryEntityId?.trim() || undefined,
				sikesraId20: input.sikesraId20?.trim() || undefined,
				value: input.value,
				status: "pending_persistence",
			});
		},
	};
}

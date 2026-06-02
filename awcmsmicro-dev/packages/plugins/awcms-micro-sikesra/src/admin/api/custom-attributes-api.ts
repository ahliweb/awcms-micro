import type {
	SikesraCustomAttributeDefinitionRequest,
	SikesraCustomAttributeValueRequest,
} from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

export type SikesraCustomAttributesApiContract = SikesraCustomAttributeValueRequest;

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function listCustomAttributeDefinitions<TResponse>(
	options: RequestOptions<Record<string, never>>,
) {
	return postSikesraPlugin<TResponse, Record<string, never>>({
		...options,
		path: "custom-attributes/definitions/list",
		payload: {},
	});
}

export function saveCustomAttributeDefinition<TResponse>(
	payload: SikesraCustomAttributeDefinitionRequest,
	options: RequestOptions<SikesraCustomAttributeDefinitionRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraCustomAttributeDefinitionRequest>({
		...options,
		path: "custom-attributes/definitions/save",
		payload,
	});
}

export function listCustomAttributeValues<TResponse>(
	options: RequestOptions<Record<string, never>>,
) {
	return postSikesraPlugin<TResponse, Record<string, never>>({
		...options,
		path: "custom-attributes/values/list",
		payload: {},
	});
}

export function saveCustomAttributeValue<TResponse>(
	payload: SikesraCustomAttributeValueRequest,
	options: RequestOptions<SikesraCustomAttributeValueRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraCustomAttributeValueRequest>({
		...options,
		path: "custom-attributes/values/save",
		payload,
	});
}

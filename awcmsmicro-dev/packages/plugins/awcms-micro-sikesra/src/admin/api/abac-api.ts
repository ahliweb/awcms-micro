import type { SikesraAbacPreviewRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

type EmptyPayload = Record<string, never>;
type AbacCatalogPayload = Record<string, unknown>;

export function listAbacAttributes<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "abac/attributes/list",
		payload: {},
	});
}

export function saveAbacAttribute<TResponse>(
	payload: AbacCatalogPayload,
	options: RequestOptions<AbacCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AbacCatalogPayload>({
		...options,
		path: "abac/attributes/save",
		payload,
	});
}

export function listAbacSubjects<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "abac/subjects/list",
		payload: {},
	});
}

export function saveAbacSubject<TResponse>(
	payload: AbacCatalogPayload,
	options: RequestOptions<AbacCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AbacCatalogPayload>({
		...options,
		path: "abac/subjects/save",
		payload,
	});
}

export function listAbacResources<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "abac/resources/list",
		payload: {},
	});
}

export function saveAbacResource<TResponse>(
	payload: AbacCatalogPayload,
	options: RequestOptions<AbacCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AbacCatalogPayload>({
		...options,
		path: "abac/resources/save",
		payload,
	});
}

export function listAbacPolicies<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "abac/policies/list",
		payload: {},
	});
}

export function saveAbacPolicy<TResponse>(
	payload: AbacCatalogPayload,
	options: RequestOptions<AbacCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AbacCatalogPayload>({
		...options,
		path: "abac/policies/save",
		payload,
	});
}

export function previewAbac<TResponse>(
	payload: SikesraAbacPreviewRequest,
	options: RequestOptions<SikesraAbacPreviewRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraAbacPreviewRequest>({
		...options,
		path: "abac/preview",
		payload,
	});
}

export function runAbacEnforceDemo<TResponse>(
	payload: AbacCatalogPayload,
	options: RequestOptions<AbacCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AbacCatalogPayload>({
		...options,
		path: "abac/enforce-demo",
		payload,
	});
}

export function getAbacHealth<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "abac/health",
		payload: {},
	});
}

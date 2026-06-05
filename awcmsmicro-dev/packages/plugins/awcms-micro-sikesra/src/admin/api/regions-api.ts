import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type EmptyPayload = Record<string, never>;
type RegionPayload = unknown[] | Record<string, unknown>;
type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function getRegions<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "regions/get",
		payload: {},
	});
}

export function saveRegions<TResponse>(
	payload: RegionPayload,
	options: RequestOptions<RegionPayload>,
) {
	return postSikesraPlugin<TResponse, RegionPayload>({
		...options,
		path: "regions/save",
		payload,
	});
}

export function getLocalRegions<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "local-regions/get",
		payload: {},
	});
}

export function saveLocalRegions<TResponse>(
	payload: RegionPayload,
	options: RequestOptions<RegionPayload>,
) {
	return postSikesraPlugin<TResponse, RegionPayload>({
		...options,
		path: "local-regions/save",
		payload,
	});
}

import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type EmptyPayload = Record<string, never>;
type DataTypesPayload = unknown[] | Record<string, unknown>;
type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function getDataTypes<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "data-types/get",
		payload: {},
	});
}

export function saveDataTypes<TResponse>(
	payload: DataTypesPayload,
	options: RequestOptions<DataTypesPayload>,
) {
	return postSikesraPlugin<TResponse, DataTypesPayload>({
		...options,
		path: "data-types/save",
		payload,
	});
}

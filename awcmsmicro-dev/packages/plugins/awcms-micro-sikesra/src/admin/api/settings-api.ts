import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function getSettings<TResponse>(payload: Record<string, unknown>, options: RequestOptions<Record<string, unknown>>) {
	return postSikesraPlugin<TResponse, Record<string, unknown>>({ ...options, path: "settings/get", payload });
}

export function saveSettings<TResponse>(payload: Record<string, unknown>, options: RequestOptions<Record<string, unknown>>) {
	return postSikesraPlugin<TResponse, Record<string, unknown>>({ ...options, path: "settings/save", payload });
}

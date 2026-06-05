import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type EmptyPayload = Record<string, never>;
type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function getOverviewSummary<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "overview/summary",
		payload: {},
	});
}

export function getDashboardSummary<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "dashboard/summary",
		payload: {},
	});
}

export function getPublicStatus<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "public/status",
		payload: {},
	});
}

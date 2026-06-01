import { apiFetch, getErrorMessage, parseApiResponse } from "emdash/plugin-utils";

export const SIKESRA_PLUGIN_API_BASE = "/_emdash/api/plugins/awcms-micro-sikesra";

export type SikesraAdminApiPath =
	| "overview/summary"
	| "public/status"
	| "registry/list"
	| "registry/save"
	| "documents/list"
	| "documents/save"
	| "import/promote"
	| "verification/list"
	| "verification/advance"
	| "verification/reject"
	| "settings/get"
	| "settings/save"
	| "regions/get"
	| "regions/save"
	| "data-types/get"
	| "data-types/save"
	| "audit/list"
	| "access/permissions/list"
	| "access/permissions/save"
	| "access/roles/list"
	| "access/roles/save"
	| "access/users/save"
	| "access/matrix/get"
	| "access/matrix/save"
	| "access/preview"
	| "access/health"
	| "abac/attributes/list"
	| "abac/attributes/save"
	| "abac/subjects/list"
	| "abac/subjects/save"
	| "abac/resources/list"
	| "abac/resources/save"
	| "abac/policies/list"
	| "abac/policies/save"
	| "abac/preview"
	| "abac/enforce-demo"
	| "abac/health"
	| "dashboard/summary";

export interface SikesraAdminUserHeaderSource {
	id: string;
	name?: string;
}

export interface SikesraAdminApiRequest<TPayload = unknown> {
	path: SikesraAdminApiPath;
	payload?: TPayload;
	user?: SikesraAdminUserHeaderSource | null;
	requestFailedMessage: string;
}

export function createSikesraAdminApiHeaders(user?: SikesraAdminUserHeaderSource | null) {
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	if (user) {
		headers["X-Sikesra-User-Id"] = user.id;
		if (user.name) headers["X-Sikesra-User-Name"] = user.name;
	}
	return headers;
}

export async function postSikesraPlugin<TResponse, TPayload = unknown>({
	path,
	payload,
	user,
	requestFailedMessage,
}: SikesraAdminApiRequest<TPayload>): Promise<TResponse> {
	const response = await apiFetch(`${SIKESRA_PLUGIN_API_BASE}/${path}`, {
		method: "POST",
		headers: createSikesraAdminApiHeaders(user),
		body: JSON.stringify(payload ?? {}),
	});

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, requestFailedMessage));
	}

	return parseApiResponse<TResponse>(response);
}

import { apiFetch, getErrorMessage, parseApiResponse } from "emdash/plugin-utils";

export const SIKESRA_PLUGIN_API_BASE = "/_emdash/api/plugins/awcms-micro-sikesra";

export const SIKESRA_ADMIN_API_PATHS = [
	"overview/summary",
	"public/status",
	"registry/list",
	"registry/save",
	"registry/sikesra-id/correct",
	"registry/archive/list",
	"registry/soft-delete",
	"registry/restore",
	"documents/list",
	"documents/save",
	"documents/access",
	"import/create",
	"import/promote",
	"import/list",
	"import/staging/list",
	"duplicates/decide",
	"exports/create",
	"exports/list",
	"custom-attributes/definitions/list",
	"custom-attributes/definitions/save",
	"custom-attributes/values/list",
	"custom-attributes/values/save",
	"crud/permanent-delete/request",
	"crud/permanent-delete/requests/list",
	"crud/permanent-delete/approve",
	"crud/permanent-delete/execute",
	"verification/list",
	"verification/advance",
	"verification/reject",
	"settings/get",
	"settings/save",
	"regions/get",
	"regions/save",
	"local-regions/get",
	"local-regions/save",
	"data-types/get",
	"data-types/save",
	"audit/list",
	"access/permissions/list",
	"access/permissions/save",
	"access/roles/list",
	"access/roles/save",
	"access/users/list",
	"access/users/save",
	"access/scopes/list",
	"access/scopes/save",
	"access/matrix/get",
	"access/matrix/save",
	"access/preview",
	"access/health",
	"abac/attributes/list",
	"abac/attributes/save",
	"abac/subjects/list",
	"abac/subjects/save",
	"abac/resources/list",
	"abac/resources/save",
	"abac/policies/list",
	"abac/policies/save",
	"abac/preview",
	"abac/enforce-demo",
	"abac/health",
	"dashboard/summary",
] as const;

export type SikesraAdminApiPath = (typeof SIKESRA_ADMIN_API_PATHS)[number];

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
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-EmDash-Request": "1",
	};
	if (user) {
		headers["X-Sikesra-User-Id"] = user.id;
		if (user.name) headers["X-Sikesra-User-Name"] = user.name;
	}
	return headers;
}

export const SIKESRA_READ_ONLY_ADMIN_API_PATHS = [
	"overview/summary",
	"public/status",
	"registry/list",
	"registry/archive/list",
	"documents/list",
	"exports/list",
	"import/list",
	"import/staging/list",
	"custom-attributes/definitions/list",
	"custom-attributes/values/list",
	"crud/permanent-delete/requests/list",
	"verification/list",
	"settings/get",
	"regions/get",
	"local-regions/get",
	"data-types/get",
	"audit/list",
	"access/permissions/list",
	"access/roles/list",
	"access/users/list",
	"access/scopes/list",
	"access/matrix/get",
	"access/health",
	"abac/attributes/list",
	"abac/subjects/list",
	"abac/resources/list",
	"abac/policies/list",
	"abac/health",
	"dashboard/summary",
] as const satisfies readonly SikesraAdminApiPath[];

const SIKESRA_READ_ONLY_API_PATHS = new Set<SikesraAdminApiPath>(
	SIKESRA_READ_ONLY_ADMIN_API_PATHS,
);

export function getSikesraAdminApiMethod(path: SikesraAdminApiPath) {
	return SIKESRA_READ_ONLY_API_PATHS.has(path) ? "GET" : "POST";
}

function appendPayloadSearchParams(url: URL, payload: unknown) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return;
	for (const [key, value] of Object.entries(payload)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				if (item === undefined || item === null) continue;
				url.searchParams.append(key, String(item));
			}
			continue;
		}
		url.searchParams.set(
			key,
			typeof value === "object" ? JSON.stringify(value) : String(value),
		);
	}
}

export function createSikesraAdminApiUrl<TPayload = unknown>(
	path: SikesraAdminApiPath,
	method: "GET" | "POST",
	payload?: TPayload,
) {
	const url = new URL(`${SIKESRA_PLUGIN_API_BASE}/${path}`, "https://awcms-micro.local");
	if (method === "GET") appendPayloadSearchParams(url, payload);
	return `${url.pathname}${url.search}`;
}

export async function postSikesraPlugin<TResponse, TPayload = unknown>({
	path,
	payload,
	user,
	requestFailedMessage,
}: SikesraAdminApiRequest<TPayload>): Promise<TResponse> {
	const method = getSikesraAdminApiMethod(path);
	const response = await apiFetch(createSikesraAdminApiUrl(path, method, payload), {
		method,
		headers: createSikesraAdminApiHeaders(user),
		...(method === "POST" ? { body: JSON.stringify(payload ?? {}) } : {}),
	});

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, requestFailedMessage));
	}

	return parseApiResponse<TResponse>(response);
}

import type {
	SikesraAccessPreviewRequest,
	SikesraRoleAssignmentRequest,
	SikesraUserProfileRequest,
} from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

type EmptyPayload = Record<string, never>;
type AccessCatalogPayload = Record<string, unknown>;
type AccessUsersListPayload = Record<string, unknown>;

export function listPermissions<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "access/permissions/list",
		payload: {},
	});
}

export function savePermission<TResponse>(
	payload: AccessCatalogPayload,
	options: RequestOptions<AccessCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AccessCatalogPayload>({
		...options,
		path: "access/permissions/save",
		payload,
	});
}

export function listRoles<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "access/roles/list",
		payload: {},
	});
}

export function saveRole<TResponse>(
	payload: AccessCatalogPayload,
	options: RequestOptions<AccessCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AccessCatalogPayload>({
		...options,
		path: "access/roles/save",
		payload,
	});
}

export function listUsers<TResponse>(
	payload: AccessUsersListPayload,
	options: RequestOptions<AccessUsersListPayload>,
) {
	return postSikesraPlugin<TResponse, AccessUsersListPayload>({
		...options,
		path: "access/users/list",
		payload,
	});
}

export function saveUserRoles<TResponse>(
	payload: SikesraRoleAssignmentRequest,
	options: RequestOptions<SikesraRoleAssignmentRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraRoleAssignmentRequest>({
		...options,
		path: "access/users/save",
		payload,
	});
}

export function getUserProfile<TResponse>(
	payload: SikesraUserProfileRequest,
	options: RequestOptions<SikesraUserProfileRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraUserProfileRequest>({
		...options,
		path: "access/users/profile",
		payload,
	});
}

export function listScopes<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "access/scopes/list",
		payload: {},
	});
}

export function saveScope<TResponse>(
	payload: AccessCatalogPayload,
	options: RequestOptions<AccessCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AccessCatalogPayload>({
		...options,
		path: "access/scopes/save",
		payload,
	});
}

export function getAccessMatrix<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "access/matrix/get",
		payload: {},
	});
}

export function saveAccessMatrix<TResponse>(
	payload: AccessCatalogPayload,
	options: RequestOptions<AccessCatalogPayload>,
) {
	return postSikesraPlugin<TResponse, AccessCatalogPayload>({
		...options,
		path: "access/matrix/save",
		payload,
	});
}

export function previewAccess<TResponse>(
	payload: SikesraAccessPreviewRequest,
	options: RequestOptions<SikesraAccessPreviewRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraAccessPreviewRequest>({
		...options,
		path: "access/preview",
		payload,
	});
}

export function getAccessHealth<TResponse>(options: RequestOptions<EmptyPayload>) {
	return postSikesraPlugin<TResponse, EmptyPayload>({
		...options,
		path: "access/health",
		payload: {},
	});
}

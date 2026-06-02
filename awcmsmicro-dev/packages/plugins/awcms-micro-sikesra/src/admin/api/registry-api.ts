import type {
	SikesraRegistryCreateRequest,
	SikesraRegistryListRequest,
	SikesraRestoreRequest,
	SikesraSoftDeleteRequest,
} from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function listRegistry<TResponse>(
	payload: SikesraRegistryListRequest,
	options: RequestOptions<SikesraRegistryListRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraRegistryListRequest>({
		...options,
		path: "registry/list",
		payload,
	});
}

export function saveRegistry<TResponse>(
	payload: SikesraRegistryCreateRequest,
	options: RequestOptions<SikesraRegistryCreateRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraRegistryCreateRequest>({
		...options,
		path: "registry/save",
		payload,
	});
}

export function listRegistryArchive<TResponse>(
	payload: SikesraRegistryListRequest,
	options: RequestOptions<SikesraRegistryListRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraRegistryListRequest>({
		...options,
		path: "registry/archive/list",
		payload,
	});
}

export function softDeleteRegistry<TResponse>(
	payload: SikesraSoftDeleteRequest,
	options: RequestOptions<SikesraSoftDeleteRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraSoftDeleteRequest>({
		...options,
		path: "registry/soft-delete",
		payload,
	});
}

export function restoreRegistry<TResponse>(
	payload: SikesraRestoreRequest,
	options: RequestOptions<SikesraRestoreRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraRestoreRequest>({
		...options,
		path: "registry/restore",
		payload,
	});
}

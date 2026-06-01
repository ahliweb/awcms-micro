import type { SikesraRegistryCreateRequest, SikesraRegistryListRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function listRegistry<TResponse>(payload: SikesraRegistryListRequest, options: RequestOptions<SikesraRegistryListRequest>) {
	return postSikesraPlugin<TResponse, SikesraRegistryListRequest>({ ...options, path: "registry/list", payload });
}

export function saveRegistry<TResponse>(payload: SikesraRegistryCreateRequest, options: RequestOptions<SikesraRegistryCreateRequest>) {
	return postSikesraPlugin<TResponse, SikesraRegistryCreateRequest>({ ...options, path: "registry/save", payload });
}

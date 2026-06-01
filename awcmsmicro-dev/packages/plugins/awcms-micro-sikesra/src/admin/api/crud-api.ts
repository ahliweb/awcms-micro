import type { SikesraPermanentDeleteRequest, SikesraRestoreRequest, SikesraSoftDeleteRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

export type SikesraCrudApiContract = SikesraRestoreRequest | SikesraSoftDeleteRequest | SikesraPermanentDeleteRequest;

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function requestPermanentDelete<TResponse>(payload: SikesraPermanentDeleteRequest, options: RequestOptions<SikesraPermanentDeleteRequest>) {
	return postSikesraPlugin<TResponse, SikesraPermanentDeleteRequest>({ ...options, path: "crud/permanent-delete/request", payload });
}

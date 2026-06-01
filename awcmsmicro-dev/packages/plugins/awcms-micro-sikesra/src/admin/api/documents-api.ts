import type { SikesraDocumentMetadataRequest, SikesraDocumentsListRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function listDocuments<TResponse>(payload: SikesraDocumentsListRequest, options: RequestOptions<SikesraDocumentsListRequest>) {
	return postSikesraPlugin<TResponse, SikesraDocumentsListRequest>({ ...options, path: "documents/list", payload });
}

export function saveDocument<TResponse>(payload: SikesraDocumentMetadataRequest, options: RequestOptions<SikesraDocumentMetadataRequest>) {
	return postSikesraPlugin<TResponse, SikesraDocumentMetadataRequest>({ ...options, path: "documents/save", payload });
}

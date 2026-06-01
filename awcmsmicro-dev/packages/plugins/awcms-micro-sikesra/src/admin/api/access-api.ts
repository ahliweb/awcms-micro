import type { SikesraAccessPreviewRequest, SikesraRoleAssignmentRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function saveUserRoles<TResponse>(payload: SikesraRoleAssignmentRequest, options: RequestOptions<SikesraRoleAssignmentRequest>) {
	return postSikesraPlugin<TResponse, SikesraRoleAssignmentRequest>({ ...options, path: "access/users/save", payload });
}

export function previewAccess<TResponse>(payload: SikesraAccessPreviewRequest, options: RequestOptions<SikesraAccessPreviewRequest>) {
	return postSikesraPlugin<TResponse, SikesraAccessPreviewRequest>({ ...options, path: "access/preview", payload });
}

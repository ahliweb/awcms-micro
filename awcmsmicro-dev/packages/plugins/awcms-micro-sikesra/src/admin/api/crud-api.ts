import type {
	SikesraPermanentDeleteApprovalRequest,
	SikesraPermanentDeleteExecutionRequest,
	SikesraPermanentDeleteListRequest,
	SikesraPermanentDeleteRequest,
	SikesraRestoreRequest,
	SikesraSoftDeleteRequest,
} from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

export type SikesraCrudApiContract =
	| SikesraRestoreRequest
	| SikesraSoftDeleteRequest
	| SikesraPermanentDeleteRequest
	| SikesraPermanentDeleteListRequest
	| SikesraPermanentDeleteApprovalRequest
	| SikesraPermanentDeleteExecutionRequest;

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function requestPermanentDelete<TResponse>(payload: SikesraPermanentDeleteRequest, options: RequestOptions<SikesraPermanentDeleteRequest>) {
	return postSikesraPlugin<TResponse, SikesraPermanentDeleteRequest>({ ...options, path: "crud/permanent-delete/request", payload });
}

export function listPermanentDeleteRequests<TResponse>(payload: SikesraPermanentDeleteListRequest, options: RequestOptions<SikesraPermanentDeleteListRequest>) {
	return postSikesraPlugin<TResponse, SikesraPermanentDeleteListRequest>({ ...options, path: "crud/permanent-delete/requests/list", payload });
}

export function approvePermanentDelete<TResponse>(payload: SikesraPermanentDeleteApprovalRequest, options: RequestOptions<SikesraPermanentDeleteApprovalRequest>) {
	return postSikesraPlugin<TResponse, SikesraPermanentDeleteApprovalRequest>({ ...options, path: "crud/permanent-delete/approve", payload });
}

export function executePermanentDelete<TResponse>(payload: SikesraPermanentDeleteExecutionRequest, options: RequestOptions<SikesraPermanentDeleteExecutionRequest>) {
	return postSikesraPlugin<TResponse, SikesraPermanentDeleteExecutionRequest>({ ...options, path: "crud/permanent-delete/execute", payload });
}

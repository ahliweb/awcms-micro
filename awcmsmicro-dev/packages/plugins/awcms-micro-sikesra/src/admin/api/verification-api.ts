import type { SikesraVerificationDecisionRequest, SikesraVerificationListRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function listVerification<TResponse>(payload: SikesraVerificationListRequest, options: RequestOptions<SikesraVerificationListRequest>) {
	return postSikesraPlugin<TResponse, SikesraVerificationListRequest>({ ...options, path: "verification/list", payload });
}

export function advanceVerification<TResponse>(payload: SikesraVerificationDecisionRequest, options: RequestOptions<SikesraVerificationDecisionRequest>) {
	return postSikesraPlugin<TResponse, SikesraVerificationDecisionRequest>({ ...options, path: "verification/advance", payload });
}

export function rejectVerification<TResponse>(payload: SikesraVerificationDecisionRequest, options: RequestOptions<SikesraVerificationDecisionRequest>) {
	return postSikesraPlugin<TResponse, SikesraVerificationDecisionRequest>({ ...options, path: "verification/reject", payload });
}

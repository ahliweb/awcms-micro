import type { SikesraAuditListRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function listAuditEvents<TResponse>(
	payload: SikesraAuditListRequest,
	options: RequestOptions<SikesraAuditListRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraAuditListRequest>({
		...options,
		path: "audit/list",
		payload,
	});
}

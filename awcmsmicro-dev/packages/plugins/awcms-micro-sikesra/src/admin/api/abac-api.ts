import type { SikesraAbacPreviewRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function previewAbac<TResponse>(
	payload: SikesraAbacPreviewRequest,
	options: RequestOptions<SikesraAbacPreviewRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraAbacPreviewRequest>({
		...options,
		path: "abac/preview",
		payload,
	});
}

import type { SikesraImportPromotionRequest } from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function promoteImportRows<TResponse>(payload: SikesraImportPromotionRequest, options: RequestOptions<SikesraImportPromotionRequest>) {
	return postSikesraPlugin<TResponse, SikesraImportPromotionRequest>({ ...options, path: "import/promote", payload });
}

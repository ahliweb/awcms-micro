import type {
	SikesraImportBatchListRequest,
	SikesraImportCreateRequest,
	SikesraImportPromotionRequest,
	SikesraImportStagingListRequest,
} from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function createImportBatch<TResponse>(
	payload: SikesraImportCreateRequest,
	options: RequestOptions<SikesraImportCreateRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraImportCreateRequest>({
		...options,
		path: "import/create",
		payload,
	});
}

export function promoteImportRows<TResponse>(
	payload: SikesraImportPromotionRequest,
	options: RequestOptions<SikesraImportPromotionRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraImportPromotionRequest>({
		...options,
		path: "import/promote",
		payload,
	});
}

export function listImportBatches<TResponse>(
	payload: SikesraImportBatchListRequest,
	options: RequestOptions<SikesraImportBatchListRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraImportBatchListRequest>({
		...options,
		path: "import/list",
		payload,
	});
}

export function listImportStagingRows<TResponse>(
	payload: SikesraImportStagingListRequest,
	options: RequestOptions<SikesraImportStagingListRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraImportStagingListRequest>({
		...options,
		path: "import/staging/list",
		payload,
	});
}

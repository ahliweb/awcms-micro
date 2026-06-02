import type {
	SikesraExportCreateRequest,
	SikesraExportJobListRequest,
} from "../../contracts/index.js";
import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

export type SikesraExportApiContract = SikesraExportCreateRequest;

type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function createExportJob<TResponse>(
	payload: SikesraExportCreateRequest,
	options: RequestOptions<SikesraExportCreateRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraExportCreateRequest>({
		...options,
		path: "exports/create",
		payload,
	});
}

export function listExportJobs<TResponse>(
	payload: SikesraExportJobListRequest,
	options: RequestOptions<SikesraExportJobListRequest>,
) {
	return postSikesraPlugin<TResponse, SikesraExportJobListRequest>({
		...options,
		path: "exports/list",
		payload,
	});
}

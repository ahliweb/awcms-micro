import { postSikesraPlugin, type SikesraAdminApiRequest } from "./client.js";

type DuplicateDecisionPayload = Record<string, unknown>;
type RequestOptions<TPayload> = Omit<SikesraAdminApiRequest<TPayload>, "path" | "payload">;

export function decideDuplicate<TResponse>(
	payload: DuplicateDecisionPayload,
	options: RequestOptions<DuplicateDecisionPayload>,
) {
	return postSikesraPlugin<TResponse, DuplicateDecisionPayload>({
		...options,
		path: "duplicates/decide",
		payload,
	});
}

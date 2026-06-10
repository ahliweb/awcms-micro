import { apiFetch, parseApiResponse } from "emdash/plugin-utils";

export const MAILKETING_PLUGIN_ROUTE_BASE = "/api/plugins/awcms-email-mailketing";

export async function postMailketingPlugin<TResponse, TPayload = Record<string, unknown>>(opts: {
	path: string;
	payload: TPayload;
	signal?: AbortSignal;
}): Promise<TResponse> {
	const res = await apiFetch(`${MAILKETING_PLUGIN_ROUTE_BASE}/${opts.path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(opts.payload),
		signal: opts.signal,
	});
	return parseApiResponse<TResponse>(res, `Mailketing ${opts.path} failed`);
}

export async function getMailketingPlugin<TResponse>(opts: {
	path: string;
	signal?: AbortSignal;
}): Promise<TResponse> {
	const res = await apiFetch(`${MAILKETING_PLUGIN_ROUTE_BASE}/${opts.path}`, {
		method: "GET",
		signal: opts.signal,
	});
	return parseApiResponse<TResponse>(res, `Mailketing ${opts.path} failed`);
}

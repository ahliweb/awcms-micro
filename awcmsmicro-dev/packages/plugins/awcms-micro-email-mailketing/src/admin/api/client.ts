export const MAILKETING_PLUGIN_ROUTE_BASE = "/api/plugins/awcms-email-mailketing";

export async function postMailketingPlugin<TResponse, TPayload = Record<string, unknown>>(opts: {
	path: string;
	payload: TPayload;
	signal?: AbortSignal;
}): Promise<TResponse> {
	const res = await fetch(`${MAILKETING_PLUGIN_ROUTE_BASE}/${opts.path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(opts.payload),
		signal: opts.signal,
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Mailketing API error ${res.status}: ${text}`);
	}
	const json = (await res.json()) as { success: boolean; data?: TResponse; error?: string };
	if (!json.success) throw new Error(json.error ?? "Unknown error");
	return json.data as TResponse;
}

export async function getMailketingPlugin<TResponse>(opts: {
	path: string;
	signal?: AbortSignal;
}): Promise<TResponse> {
	const res = await fetch(`${MAILKETING_PLUGIN_ROUTE_BASE}/${opts.path}`, {
		method: "GET",
		signal: opts.signal,
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Mailketing API error ${res.status}: ${text}`);
	}
	const json = (await res.json()) as { success: boolean; data?: TResponse; error?: string };
	if (!json.success) throw new Error(json.error ?? "Unknown error");
	return json.data as TResponse;
}

import type {
	MailketingApiSendRequest,
	MailketingApiSendResponse,
} from "../contracts/index.js";

export interface MailketingClientConfig {
	apiToken: string;
	baseUrl?: string;
}

export class MailketingApiError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
		public readonly responseBody?: string,
	) {
		super(message);
		this.name = "MailketingApiError";
	}
}

export class MailketingClient {
	private readonly apiToken: string;
	private readonly baseUrl: string;
	private readonly fetchFn: typeof fetch;

	constructor(config: MailketingClientConfig, fetchFn?: typeof fetch) {
		this.apiToken = config.apiToken;
		this.baseUrl = config.baseUrl ?? "https://mailketing.co.id";
		this.fetchFn = fetchFn ?? globalThis.fetch;
	}

	async sendEmail(payload: MailketingApiSendRequest): Promise<MailketingApiSendResponse> {
		const url = `${this.baseUrl}/api/v1/send`;

		let response: Response;
		try {
			response = await this.fetchFn(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.apiToken}`,
					"Accept": "application/json",
				},
				body: JSON.stringify(payload),
			});
		} catch (err) {
			throw new MailketingApiError(
				`Network error calling Mailketing API: ${err instanceof Error ? err.message : String(err)}`,
			);
		}

		const rawBody = await response.text().catch(() => "");

		if (!response.ok) {
			const bodyHint = rawBody ? `: ${rawBody.slice(0, 300)}` : "";
			throw new MailketingApiError(
				`Mailketing API returned HTTP ${response.status}${bodyHint}`,
				response.status,
				rawBody,
			);
		}

		let parsed: MailketingApiSendResponse;
		try {
			parsed = JSON.parse(rawBody) as MailketingApiSendResponse;
		} catch {
			// API returned 2xx but non-JSON body — treat as success with no message_id
			return { success: true };
		}

		return parsed;
	}

	async testConnection(): Promise<{ ok: boolean; error?: string }> {
		// Probe the API by sending a minimal request and checking auth.
		// HTTP 401 = invalid token. Any other response (including 4xx validation errors)
		// means the token was accepted and the API is reachable.
		const url = `${this.baseUrl}/api/v1/send`;
		let response: Response;
		try {
			response = await this.fetchFn(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.apiToken}`,
					"Accept": "application/json",
				},
				body: JSON.stringify({ to: "", from: "", from_name: "", subject: "", text: "" }),
			});
		} catch (err) {
			return { ok: false, error: `Network error: ${err instanceof Error ? err.message : String(err)}` };
		}

		if (response.status === 401) {
			return { ok: false, error: "Invalid API token (HTTP 401)" };
		}
		if (response.status >= 500) {
			const body = await response.text().catch(() => "");
			const hint = body ? `: ${body.slice(0, 200)}` : "";
			return { ok: false, error: `Mailketing API server error (HTTP ${response.status})${hint}` };
		}
		// Any non-401, non-5xx response (e.g. 422 validation errors) means the token is accepted
		return { ok: true };
	}
}

export function createMailketingClient(
	apiToken: string,
	fetchFn?: typeof fetch,
): MailketingClient {
	if (!apiToken || typeof apiToken !== "string" || apiToken.trim().length === 0) {
		throw new Error("Mailketing API token must be a non-empty string");
	}
	return new MailketingClient({ apiToken: apiToken.trim() }, fetchFn);
}

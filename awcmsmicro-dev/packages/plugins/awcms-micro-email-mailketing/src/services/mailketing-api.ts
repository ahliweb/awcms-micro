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
			throw new MailketingApiError(
				`Mailketing API returned HTTP ${response.status}`,
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
		try {
			const result = await this.sendEmail({
				to: "test@mailketing-probe.invalid",
				from: "probe@mailketing-probe.invalid",
				from_name: "AWCMS-Micro Probe",
				subject: "Connection test",
				text: "This is a connection test from AWCMS-Micro Email Mailketing plugin.",
			});
			return { ok: result.success };
		} catch (err) {
			const msg = err instanceof MailketingApiError ? err.message : String(err);
			return { ok: false, error: msg };
		}
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

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
		this.baseUrl = config.baseUrl ?? "https://api.mailketing.co.id";
		this.fetchFn = fetchFn ?? globalThis.fetch;
	}

	async sendEmail(payload: MailketingApiSendRequest): Promise<MailketingApiSendResponse> {
		const url = `${this.baseUrl}/api/v1/send`;

		const formData = new URLSearchParams({
			api_token: this.apiToken,
			recipient: payload.recipient,
			from_email: payload.from_email,
			from_name: payload.from_name,
			subject: payload.subject,
			content: payload.content,
		});
		if (payload.attach1) formData.set("attach1", payload.attach1);
		if (payload.attach2) formData.set("attach2", payload.attach2);
		if (payload.attach3) formData.set("attach3", payload.attach3);

		let response: Response;
		try {
			response = await this.fetchFn(url, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: formData.toString(),
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

		// API returns: {"status":"success","response":"Mail Sent"} or {"status":"failed","response":"<reason>"}
		let apiResp: { status?: string; response?: string; message_id?: string };
		try {
			apiResp = JSON.parse(rawBody) as typeof apiResp;
		} catch {
			return { success: true };
		}

		const ok = apiResp.status === "success";
		return {
			success: ok,
			message: ok ? (apiResp.response ?? "Mail Sent") : undefined,
			error: ok ? undefined : (apiResp.response ?? "Unknown error from Mailketing"),
			message_id: apiResp.message_id,
		};
	}

	async testConnection(): Promise<{ ok: boolean; error?: string }> {
		// Probe with empty fields: a valid token gets a field-validation error (e.g. "Empty Recipient"),
		// an invalid token gets "User Not Found or Wrong API Token", and a down server returns 5xx.
		const url = `${this.baseUrl}/api/v1/send`;
		const formData = new URLSearchParams({
			api_token: this.apiToken,
			recipient: "",
			from_email: "",
			from_name: "",
			subject: "",
			content: "",
		});

		let response: Response;
		try {
			response = await this.fetchFn(url, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: formData.toString(),
			});
		} catch (err) {
			return { ok: false, error: `Network error: ${err instanceof Error ? err.message : String(err)}` };
		}

		const rawBody = await response.text().catch(() => "");

		if (response.status >= 500) {
			const hint = rawBody ? `: ${rawBody.slice(0, 200)}` : "";
			return { ok: false, error: `Mailketing API server error (HTTP ${response.status})${hint}` };
		}

		let parsed: { status?: string; response?: string } = {};
		try { parsed = JSON.parse(rawBody) as typeof parsed; } catch { /**/ }

		// Invalid token signals
		if (
			parsed.status === "failed" &&
			parsed.response &&
			(parsed.response.includes("Wrong API Token") || parsed.response.includes("Invalid Token"))
		) {
			return { ok: false, error: `Invalid API token: ${parsed.response}` };
		}

		// Any other response (field validation errors like "Empty Recipient") = token accepted = ok
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

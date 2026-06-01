import type { SikesraAuditEventDto } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

export interface SikesraAuditService {
	redact(event: SikesraAuditEventDto): SikesraServiceResult<SikesraAuditEventDto>;
}

export function createAuditService(): SikesraAuditService {
	return {
		redact(event) {
			return serviceOk({ ...event, redactionPolicy: event.redactionPolicy || "sikesra_default_redacted" });
		},
	};
}

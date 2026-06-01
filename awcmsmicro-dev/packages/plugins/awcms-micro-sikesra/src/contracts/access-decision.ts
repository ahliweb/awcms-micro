import { sikesraError, type SikesraApiError } from "./api.js";
import { SIKESRA_ERROR_CODES } from "./errors.js";

export interface SikesraTrustedIdentity {
	emdashUserId: string;
	displayName?: string;
}

export type SikesraAccessDecision =
	| { allowed: true; identity: SikesraTrustedIdentity; matchedRoles?: string[]; matchedPolicies?: string[] }
	| {
			allowed: false;
			reason: "permission_denied" | "abac_denied";
			message: string;
			requestId?: string;
		};

export function sikesraPermissionDenied(
	message = "SIKESRA permission denied.",
	requestId?: string,
): Exclude<SikesraAccessDecision, { allowed: true }> {
	return { allowed: false, reason: "permission_denied", message, requestId };
}

export function sikesraAbacDenied(
	message = "SIKESRA ABAC policy denied this request.",
	requestId?: string,
): Exclude<SikesraAccessDecision, { allowed: true }> {
	return { allowed: false, reason: "abac_denied", message, requestId };
}

export function sikesraAccessDecisionToError(decision: Exclude<SikesraAccessDecision, { allowed: true }>): SikesraApiError {
	return sikesraError({
		code:
			decision.reason === "permission_denied"
				? SIKESRA_ERROR_CODES.permissionDenied
				: SIKESRA_ERROR_CODES.abacDenied,
		message: decision.message,
		requestId: decision.requestId,
	});
}

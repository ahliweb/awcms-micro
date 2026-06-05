import type { SikesraRestoreRequest, SikesraSoftDeleteRequest } from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

export interface SikesraCrudGovernanceDecisionDto {
	id: string;
	operation: "soft_delete" | "restore";
	status: "pending_persistence";
	reason: string;
	requestId?: string;
	auditEventKind: "crud.soft_delete" | "crud.restore";
	requiresAudit: true;
}

export interface SikesraCrudGovernanceService {
	softDelete(
		input: SikesraSoftDeleteRequest,
	): Promise<SikesraServiceResult<SikesraCrudGovernanceDecisionDto>>;
	restore(input: SikesraRestoreRequest): Promise<SikesraServiceResult<SikesraCrudGovernanceDecisionDto>>;
}

function validateLifecycleMutation(input: SikesraSoftDeleteRequest | SikesraRestoreRequest) {
	const fieldErrors: Record<string, string[]> = {};
	if (!input.id.trim()) fieldErrors.id = ["Record ID is required."];
	if (!input.reason?.trim()) fieldErrors.reason = ["Reason is required for lifecycle changes."];
	return fieldErrors;
}

function createDecision(
	input: SikesraSoftDeleteRequest | SikesraRestoreRequest,
	operation: SikesraCrudGovernanceDecisionDto["operation"],
): SikesraCrudGovernanceDecisionDto {
	return {
		id: input.id.trim(),
		operation,
		status: "pending_persistence",
		reason: input.reason!.trim(),
		requestId: input.requestId?.trim() || undefined,
		auditEventKind: operation === "soft_delete" ? "crud.soft_delete" : "crud.restore",
		requiresAudit: true,
	};
}

export function createCrudGovernanceService(): SikesraCrudGovernanceService {
	return {
		async softDelete(input) {
			const fieldErrors = validateLifecycleMutation(input);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Soft delete governance failed validation.",
					fieldErrors,
				});
			}
			return serviceOk(createDecision(input, "soft_delete"));
		},
		async restore(input) {
			const fieldErrors = validateLifecycleMutation(input);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Restore governance failed validation.",
					fieldErrors,
				});
			}
			return serviceOk(createDecision(input, "restore"));
		},
	};
}

import type {
	SikesraVerificationDecisionRequest,
	SikesraVerificationEventDto,
} from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

const VERIFICATION_STAGE_FLOW = [
	"draft",
	"submitted_village",
	"verified_village",
	"submitted_district",
	"verified_district",
	"submitted_sopd",
	"verified_sopd",
	"submitted_regency",
	"active_verified",
] as const;

type VerificationStage = (typeof VERIFICATION_STAGE_FLOW)[number];
type VerificationUserLevel = "desa_kelurahan" | "kecamatan" | "sopd" | "kabupaten" | "admin_sikesra";

export interface SikesraVerificationService {
	advance(
		input: SikesraVerificationDecisionRequest,
	): Promise<SikesraServiceResult<SikesraVerificationEventDto>>;
	reject(
		input: SikesraVerificationDecisionRequest,
	): Promise<SikesraServiceResult<SikesraVerificationEventDto>>;
}

export interface SikesraVerificationServiceOptions {
	stageState?: Record<string, VerificationStage>;
}

function validateVerificationDecision(input: SikesraVerificationDecisionRequest, requireReason: boolean) {
	const fieldErrors: Record<string, string[]> = {};
	if (!input.registryEntityId.trim()) {
		fieldErrors.registryEntityId = ["Registry entity ID is required."];
	}
	if (!isVerifierLevel(input.verifierLevel.trim())) {
		fieldErrors.verifierLevel = [
			"Verifier level must be desa_kelurahan, kecamatan, sopd, kabupaten, or admin_sikesra.",
		];
	}
	if (requireReason && !(input.reason?.trim() || input.notes?.trim())) {
		fieldErrors.reason = ["Reason is required when returning verification for revision."];
	}
	return fieldErrors;
}

function isVerifierLevel(value: string): value is VerificationUserLevel {
	return ["desa_kelurahan", "kecamatan", "sopd", "kabupaten", "admin_sikesra"].includes(value);
}

function getNextVerificationStage(stage: VerificationStage): VerificationStage | null {
	const index = VERIFICATION_STAGE_FLOW.indexOf(stage);
	return index >= 0 && index < VERIFICATION_STAGE_FLOW.length - 1
		? (VERIFICATION_STAGE_FLOW[index + 1] ?? null)
		: null;
}

function getVerificationLevel(stage: VerificationStage) {
	if (stage === "draft" || stage === "submitted_village") return "desa_kelurahan";
	if (stage === "verified_village" || stage === "submitted_district") return "kecamatan";
	if (stage === "verified_district" || stage === "submitted_sopd") return "sopd";
	if (stage === "verified_sopd" || stage === "submitted_regency") return "kabupaten_admin";
	return "tampil";
}

function getAllowedVerifierLevels(stage: VerificationStage): VerificationUserLevel[] {
	const level = getVerificationLevel(stage);
	if (level === "desa_kelurahan") return ["desa_kelurahan"];
	if (level === "kecamatan") return ["kecamatan"];
	if (level === "sopd") return ["sopd"];
	if (level === "kabupaten_admin") return ["kabupaten", "admin_sikesra"];
	return [];
}

function getRevisionTargetStage(stage: VerificationStage): VerificationStage {
	if (stage === "draft" || stage === "submitted_village" || stage === "verified_village") {
		return "submitted_village";
	}
	if (stage === "submitted_district" || stage === "verified_district") return "submitted_village";
	if (stage === "submitted_sopd" || stage === "verified_sopd") return "submitted_district";
	if (stage === "submitted_regency" || stage === "active_verified") return "submitted_sopd";
	return "submitted_village";
}

function getCurrentStage(options: SikesraVerificationServiceOptions, registryEntityId: string) {
	return options.stageState?.[registryEntityId] ?? "draft";
}

function createVerificationEvent(
	input: SikesraVerificationDecisionRequest,
	fromStage: VerificationStage,
	toStage: VerificationStage,
	decision: "approved" | "needs_review",
): SikesraVerificationEventDto {
	return {
		id: `${input.registryEntityId.trim()}:verification:${decision}:${toStage}`,
		registryEntityId: input.registryEntityId.trim(),
		fromStage,
		toStage,
		decision,
		createdAt: "pending-persistence",
	};
}

function validateVerifierForStage(registryEntityId: string, stage: VerificationStage, verifierLevel: string) {
	const allowedVerifierLevels = getAllowedVerifierLevels(stage);
	if (allowedVerifierLevels.includes(verifierLevel as VerificationUserLevel)) return null;
	return sikesraError({
		code: SIKESRA_ERROR_CODES.permissionDenied,
		message: `Verification for ${registryEntityId} must be handled by ${allowedVerifierLevels.join(", ")}.`,
	});
}

export function createVerificationService(
	options: SikesraVerificationServiceOptions = {},
): SikesraVerificationService {
	return {
		async advance(input) {
			const fieldErrors = validateVerificationDecision(input, false);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Verification advance failed validation.",
					fieldErrors,
				});
			}

			const registryEntityId = input.registryEntityId.trim();
			const currentStage = getCurrentStage(options, registryEntityId);
			const nextStage = getNextVerificationStage(currentStage);
			if (!nextStage) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: `Registry entity ${registryEntityId} is already at the final verification stage.`,
				});
			}

			const verifierError = validateVerifierForStage(
				registryEntityId,
				currentStage,
				input.verifierLevel.trim(),
			);
			if (verifierError) return verifierError;

			return serviceOk(createVerificationEvent(input, currentStage, nextStage, "approved"));
		},
		async reject(input) {
			const fieldErrors = validateVerificationDecision(input, true);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Verification rejection failed validation.",
					fieldErrors,
				});
			}

			const registryEntityId = input.registryEntityId.trim();
			const currentStage = getCurrentStage(options, registryEntityId);
			const verifierError = validateVerifierForStage(
				registryEntityId,
				currentStage,
				input.verifierLevel.trim(),
			);
			if (verifierError) return verifierError;

			return serviceOk(
				createVerificationEvent(input, currentStage, getRevisionTargetStage(currentStage), "needs_review"),
			);
		},
	};
}

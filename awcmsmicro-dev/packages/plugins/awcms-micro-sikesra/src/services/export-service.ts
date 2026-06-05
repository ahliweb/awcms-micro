import type { SikesraExportCreateRequest, SikesraExportJobDto } from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

const EXPORT_SENSITIVE_FIELD_PATTERN =
	/(nik|kia|nomor_kk|no_kk|phone|telepon|email|alamat|ktp|domisili|latitude|longitude|coordinate|storage|checksum|document|file)/i;

export interface SikesraExportService {
	create(input: SikesraExportCreateRequest): Promise<SikesraServiceResult<SikesraExportJobDto>>;
}

function createExportJobId(input: SikesraExportCreateRequest) {
	return input.id?.trim() || `export:${input.exportType}:${input.sensitivityLevel}`;
}

function sanitizeRequestedFields(fields: string[], sensitivityLevel: string) {
	const uniqueFields = [...new Set(fields.map((field) => field.trim()).filter(Boolean))];
	if (sensitivityLevel !== "public_safe") return { allowedFields: uniqueFields, excludedFields: [] };
	return {
		allowedFields: uniqueFields.filter((field) => !EXPORT_SENSITIVE_FIELD_PATTERN.test(field)),
		excludedFields: uniqueFields.filter((field) => EXPORT_SENSITIVE_FIELD_PATTERN.test(field)),
	};
}

export function createExportService(): SikesraExportService {
	return {
		async create(input) {
			if (!input.exportType.trim()) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Export type is required.",
					fieldErrors: { exportType: ["Export type is required."] },
				});
			}
			if (input.sensitivityLevel !== "public_safe" && !input.reason?.trim()) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "A reason is required for restricted export requests.",
					fieldErrors: { reason: ["A reason is required for restricted export requests."] },
				});
			}
			const sanitized = sanitizeRequestedFields(input.requestedFields, input.sensitivityLevel);
			return serviceOk({
				id: createExportJobId(input),
				exportType: input.exportType,
				status: sanitized.excludedFields.length > 0 ? "needs_review" : "queued",
				sensitivityLevel: input.sensitivityLevel,
				requestedFields: sanitized.allowedFields,
				resultSummary: {
					entityType: input.entityType,
					filters: input.filters ?? {},
					excludedFields: sanitized.excludedFields,
				},
				requestedAt: "pending-persistence",
			});
		},
	};
}

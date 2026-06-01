import { describe, expect, it } from "vitest";

import {
	normalizeSikesraPagination,
	handleSikesraContractRoute,
	requireStringField,
	sikesraAbacDenied,
	sikesraAccessDecisionToError,
	sikesraError,
	sikesraOk,
	sikesraPermissionDenied,
	SIKESRA_ERROR_CODES,
} from "../src/contracts/index.js";
import type {
	SikesraAbacPreviewRequest,
	SikesraAuditListRequest,
	SikesraDocumentMetadataRequest,
	SikesraExportCreateRequest,
	SikesraFieldStandardDto,
	SikesraImportPromotionRequest,
	SikesraRoleAssignmentRequest,
	SikesraVerificationDecisionRequest,
} from "../src/contracts/index.js";
import { serializePublicAggregate, serializeRegistryListItem } from "../src/serializers/index.js";

describe("SIKESRA integration contracts", () => {
	it("creates consistent API success and error envelopes", () => {
		expect(sikesraOk({ id: "registry-1" })).toEqual({ ok: true, data: { id: "registry-1" } });
		expect(
			sikesraError({
				code: SIKESRA_ERROR_CODES.validation,
				message: "Validation failed",
				fieldErrors: { label: ["Required"] },
			}),
		).toEqual({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				message: "Validation failed",
				fieldErrors: { label: ["Required"] },
			},
		});
	});

	it("normalizes pagination to safe bounds", () => {
		expect(normalizeSikesraPagination({ page: -2, pageSize: 500, sortDirection: "asc" })).toEqual({
			page: 1,
			pageSize: 100,
			sortDirection: "asc",
		});
	});

	it("serializes registry rows without returning raw D1 snake_case fields", () => {
		const dto = serializeRegistryListItem({
			tenant_id: "tenant-1",
			site_id: "site-1",
			id: "registry-1",
			code: "RI-001",
			entity_type: "rumah_ibadah",
			verification_stage: "active_verified",
			label: "Masjid Contoh",
			sensitivity: "public_safe",
			public_summary: "Verified aggregate-safe record",
		});

		expect(dto).toEqual({
			id: "registry-1",
			code: "RI-001",
			label: "Masjid Contoh",
			entityType: "rumah_ibadah",
			verificationStage: "active_verified",
			sensitivity: "public_safe",
			publicSummary: "Verified aggregate-safe record",
		});
		expect(dto).not.toHaveProperty("tenant_id");
		expect(dto).not.toHaveProperty("site_id");
	});

	it("suppresses public aggregate counts when requested", () => {
		expect(
			serializePublicAggregate({
				statusLabel: "Public",
				categories: [
					{ key: "anak_yatim", label: "Anak Yatim", count: 2, suppressed: true, suppressionReason: "small_cell" },
				],
			}),
		).toEqual({
			statusLabel: "Public",
			updatedAt: undefined,
			categories: [
				{ key: "anak_yatim", label: "Anak Yatim", count: null, suppressed: true, suppressionReason: "small_cell" },
			],
		});
	});

	it("exposes typed domain request contracts for major workflows", () => {
		const verification: SikesraVerificationDecisionRequest = {
			registryEntityId: "registry-1",
			verifierLevel: "desa_kelurahan",
			reason: "Complete evidence",
		};
		const document: SikesraDocumentMetadataRequest = {
			registryEntityId: "registry-1",
			title: "Surat Keterangan",
			documentType: "surat_keterangan",
			classification: "restricted",
		};
		const importRequest: SikesraImportPromotionRequest = { batchId: "batch-1", rowIds: ["row-1"] };
		const exportRequest: SikesraExportCreateRequest = {
			exportType: "report",
			requestedFields: ["entity_type"],
			sensitivityLevel: "public_safe",
		};
		const roleAssignment: SikesraRoleAssignmentRequest = {
			emdashUserId: "user-1",
			roles: ["sikesra_admin"],
		};
		const abacPreview: SikesraAbacPreviewRequest = {
			subjectId: "user-1",
			resourceId: "registry-1",
			action: "registry.read",
		};
		const auditList: SikesraAuditListRequest = { kind: "registry.update" };
		const field: SikesraFieldStandardDto = {
			key: "label",
			label: "Label",
			module: "rumah_ibadah",
			fieldGroup: "core",
			dataClass: "non_personal",
			required: true,
			dataType: "string",
			storageTable: "sikesra_registry_entities",
			importable: true,
			exportable: true,
			publicSafe: true,
			maskByDefault: false,
			validationRules: ["required"],
		};

		expect({ verification, document, importRequest, exportRequest, roleAssignment, abacPreview, auditList, field }).toMatchObject({
			verification: { registryEntityId: "registry-1" },
			document: { classification: "restricted" },
			importRequest: { batchId: "batch-1" },
			exportRequest: { requestedFields: ["entity_type"] },
			roleAssignment: { emdashUserId: "user-1" },
			abacPreview: { action: "registry.read" },
			auditList: { kind: "registry.update" },
			field: { storageTable: "sikesra_registry_entities" },
		});
	});

	it("maps route validation failures into safe API errors", async () => {
		await expect(
			handleSikesraContractRoute(
				{ input: { label: "" }, requestId: "req-1" },
				(input) => requireStringField(input, "label"),
				async (label) => ({ label }),
			),
		).resolves.toEqual({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				message: "Invalid SIKESRA request payload.",
				fieldErrors: { label: ["Required"] },
				requestId: "req-1",
			},
		});
	});

	it("wraps route handler output in a request-scoped success envelope", async () => {
		await expect(
			handleSikesraContractRoute(
				{ input: { label: " Masjid " }, requestId: "req-2" },
				(input) => requireStringField(input, "label"),
				async (label) => ({ label }),
			),
		).resolves.toEqual({
			ok: true,
			data: { label: "Masjid" },
			meta: { requestId: "req-2" },
		});
	});

	it("maps permission and ABAC denials into distinct safe error envelopes", () => {
		expect(sikesraAccessDecisionToError(sikesraPermissionDenied("Missing role", "req-p"))).toEqual({
			ok: false,
			error: {
				code: "SIKESRA_PERMISSION_DENIED",
				message: "Missing role",
				requestId: "req-p",
			},
		});
		expect(sikesraAccessDecisionToError(sikesraAbacDenied("Outside region scope", "req-a"))).toEqual({
			ok: false,
			error: {
				code: "SIKESRA_ABAC_DENIED",
				message: "Outside region scope",
				requestId: "req-a",
			},
		});
	});
});

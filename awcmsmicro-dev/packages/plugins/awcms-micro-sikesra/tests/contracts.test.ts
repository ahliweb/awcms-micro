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
import {
	getSikesraFieldValidationSchema,
	SIKESRA_DATA_MODULES,
	SIKESRA_DOMICILE_ADDRESS_FIELD_KEYS,
	SIKESRA_FIELD_STANDARDS,
	SIKESRA_KTP_ADDRESS_FIELD_KEYS,
	SIKESRA_MODULE_FIELD_VALIDATION_SCHEMAS,
	SIKESRA_SENSITIVE_BENEFICIARY_MODULES,
} from "../src/field-standards.js";
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
				caveat: "Public aggregate only exposes coarse counts.",
				categories: [
					{
						code: "anak_yatim",
						label: "Anak Yatim",
						total: 2,
						verified: 1,
						suppressed: true,
						suppressionReason: "small_cell",
					},
				],
			}),
		).toEqual({
			caveat: "Public aggregate only exposes coarse counts.",
			categories: [
				{
					code: "anak_yatim",
					label: "Anak Yatim",
					total: 0,
					verified: 0,
					suppressed: true,
					suppressionReason: "small_cell",
				},
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

		expect({
			verification,
			document,
			importRequest,
			exportRequest,
			roleAssignment,
			abacPreview,
			auditList,
			field,
		}).toMatchObject({
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
		expect(
			sikesraAccessDecisionToError(sikesraAbacDenied("Outside region scope", "req-a")),
		).toEqual({
			ok: false,
			error: {
				code: "SIKESRA_ABAC_DENIED",
				message: "Outside region scope",
				requestId: "req-a",
			},
		});
	});
});

describe("SIKESRA field standard catalog", () => {
	it("defines standards for all eight modules with complete metadata", () => {
		expect(SIKESRA_MODULE_FIELD_VALIDATION_SCHEMAS.map((schema) => schema.module)).toEqual([
			...SIKESRA_DATA_MODULES,
		]);
		for (const module of SIKESRA_DATA_MODULES) {
			const standards = SIKESRA_FIELD_STANDARDS.filter((standard) => standard.module === module);
			expect(standards.length, `${module} has field standards`).toBeGreaterThan(20);
			for (const standard of standards) {
				expect(standard.key).toBeTruthy();
				expect(standard.label).toBeTruthy();
				expect(standard.storageTable).toMatch(/^sikesra_/);
				expect(standard.validationRules).toBeInstanceOf(Array);
			}
		}
	});

	it("keeps public-safe fields non-personal and unmasked", () => {
		const publicSafeFields = SIKESRA_FIELD_STANDARDS.filter((standard) => standard.publicSafe);
		expect(publicSafeFields.length).toBeGreaterThan(0);
		expect(publicSafeFields.every((standard) => standard.dataClass === "non_personal")).toBe(true);
		expect(publicSafeFields.every((standard) => !standard.maskByDefault)).toBe(true);
	});

	it("distinguishes KTP and domicile address validation for personal modules", () => {
		expect(SIKESRA_DOMICILE_ADDRESS_FIELD_KEYS).toEqual([
			"alamat_domisili_sama_dengan_ktp",
			"alamat_domisili_province_code",
			"alamat_domisili_regency_code",
			"alamat_domisili_district_code",
			"alamat_domisili_village_code",
			"alamat_domisili_detail",
			"alamat_domisili_rt",
			"alamat_domisili_rw",
			"alamat_domisili_postal_code",
		]);

		for (const module of ["guru_agama", "anak_yatim", "disabilitas", "lansia_terlantar"] as const) {
			const schema = getSikesraFieldValidationSchema(module);
			expect(schema.ktpAddressFields).toEqual([...SIKESRA_KTP_ADDRESS_FIELD_KEYS]);
			expect(schema.domicileAddressFields).toEqual([...SIKESRA_DOMICILE_ADDRESS_FIELD_KEYS]);
			for (const key of [
				...SIKESRA_KTP_ADDRESS_FIELD_KEYS,
				...SIKESRA_DOMICILE_ADDRESS_FIELD_KEYS,
			]) {
				const standard = SIKESRA_FIELD_STANDARDS.find(
					(field) => field.module === module && field.key === key,
				);
				expect(standard?.publicSafe, `${module}.${key} is not public-safe`).toBe(false);
				expect(standard?.maskByDefault, `${module}.${key} masks by default`).toBe(true);
				if (key !== "alamat_domisili_sama_dengan_ktp") {
					expect(standard?.dataClass, `${module}.${key} is sensitive`).toBe("sensitive_personal");
				}
			}
		}
	});

	it("covers one non-personal module, one personal module, and sensitive beneficiary modules", () => {
		expect(getSikesraFieldValidationSchema("rumah_ibadah").publicSafeFields).toEqual(
			expect.arrayContaining(["entity_type", "label", "verification_stage"]),
		);
		expect(getSikesraFieldValidationSchema("guru_agama").restrictedExportFields).toEqual(
			expect.arrayContaining(["nik", "alamat_ktp_detail", "alamat_domisili_detail", "nomor_hp"]),
		);
		for (const module of SIKESRA_SENSITIVE_BENEFICIARY_MODULES) {
			const schema = getSikesraFieldValidationSchema(module);
			expect(schema.restrictedExportFields).toEqual(
				expect.arrayContaining(["nomor_kk", "alamat_ktp_detail"]),
			);
			expect(schema.publicSafeFields).not.toContain("nama_lengkap");
		}
	});

	it("uses field standards for import and export policy decisions", () => {
		const schema = getSikesraFieldValidationSchema("anak_yatim");
		expect(schema.importableFields).toContain("alamat_ktp_detail");
		expect(schema.exportableFields).toContain("alamat_domisili_detail");
		expect(schema.restrictedExportFields).toEqual(
			expect.arrayContaining(["nik_kia", "nomor_kk", "nama_wali"]),
		);
		expect(schema.publicSafeFields).not.toContain("alamat_ktp_detail");
	});
});

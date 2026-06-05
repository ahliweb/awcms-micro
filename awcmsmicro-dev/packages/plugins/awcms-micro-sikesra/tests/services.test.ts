import { describe, expect, it } from "vitest";

import { createSikesraUiState } from "../src/contracts/index.js";
import type { SikesraScopedRepository } from "../src/db/index.js";
import type { SikesraRegistryEntityRow } from "../src/db/repositories/registry-repository.js";
import {
	createAbacService,
	createAccessService,
	createAuditService,
	createCrudGovernanceService,
	createCustomAttributeService,
	createDocumentService,
	createExportService,
	createImportService,
	createPublicAggregateService,
	createRegistryService,
	createVerificationService,
} from "../src/services/index.js";

describe("SIKESRA services", () => {
	it("lists registry rows through repository and serializer contracts", async () => {
		const repository: SikesraScopedRepository<SikesraRegistryEntityRow> = {
			table: "sikesra_registry_entities",
			async listActive() {
				return [
					{
						tenant_id: "tenant-1",
						site_id: "site-1",
						id: "registry-1",
						code: "RI-001",
						label: "Masjid Contoh",
						entity_type: "rumah_ibadah",
						verification_stage: "active_verified",
						sensitivity: "public_safe",
					},
				];
			},
			async getActiveById() {
				return null;
			},
		};

		await expect(createRegistryService(repository).listRegistry()).resolves.toEqual({
			ok: true,
			data: {
				items: [
					{
						id: "registry-1",
						code: "RI-001",
						label: "Masjid Contoh",
						entityType: "rumah_ibadah",
						verificationStage: "active_verified",
						sensitivity: "public_safe",
						publicSummary: undefined,
					},
				],
			},
		});
	});

	it("keeps public aggregate suppression inside the service boundary", () => {
		expect(
			createPublicAggregateService().serializeAggregate({
				statusLabel: "Public",
				categories: [{ key: "lks", label: "LKS", count: 1, suppressed: true }],
			}),
		).toEqual({
			ok: true,
			data: {
				statusLabel: "Public",
				updatedAt: undefined,
				categories: [
					{ key: "lks", label: "LKS", count: null, suppressed: true, suppressionReason: undefined },
				],
			},
		});
	});

	it("creates governed lifecycle DTOs for soft delete and restore", async () => {
		await expect(
			createCrudGovernanceService().softDelete({
				id: " registry-1 ",
				reason: " Duplicate record ",
				requestId: " request-1 ",
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "registry-1",
				operation: "soft_delete",
				status: "pending_persistence",
				reason: "Duplicate record",
				requestId: "request-1",
				auditEventKind: "crud.soft_delete",
				requiresAudit: true,
			},
		});

		await expect(
			createCrudGovernanceService().restore({ id: "registry-1", reason: "Correction approved" }),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "registry-1",
				operation: "restore",
				status: "pending_persistence",
				reason: "Correction approved",
				requestId: undefined,
				auditEventKind: "crud.restore",
				requiresAudit: true,
			},
		});
	});

	it("validates governed lifecycle mutation inputs", async () => {
		await expect(createCrudGovernanceService().softDelete({ id: "", reason: "" })).resolves
			.toMatchObject({
				ok: false,
				error: {
					code: "SIKESRA_VALIDATION_ERROR",
					fieldErrors: {
						id: ["Record ID is required."],
						reason: ["Reason is required for lifecycle changes."],
					},
				},
			});

		await expect(createCrudGovernanceService().restore({ id: "registry-1" })).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: { reason: ["Reason is required for lifecycle changes."] },
			},
		});
	});

	it("advances and rejects verification stages through typed service DTOs", async () => {
		const service = createVerificationService({
			stageState: {
				"registry-1": "submitted_sopd",
				"registry-2": "verified_sopd",
			},
		});

		await expect(
			service.advance({
				registryEntityId: " registry-1 ",
				verifierLevel: "sopd",
				notes: "Approved by SOPD",
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "registry-1:verification:approved:verified_sopd",
				registryEntityId: "registry-1",
				fromStage: "submitted_sopd",
				toStage: "verified_sopd",
				decision: "approved",
				createdAt: "pending-persistence",
			},
		});

		await expect(
			service.reject({
				registryEntityId: "registry-2",
				verifierLevel: "kabupaten",
				reason: "Need supporting evidence",
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "registry-2:verification:needs_review:submitted_district",
				registryEntityId: "registry-2",
				fromStage: "verified_sopd",
				toStage: "submitted_district",
				decision: "needs_review",
				createdAt: "pending-persistence",
			},
		});
	});

	it("validates verification level, final stage, and rejection reason", async () => {
		await expect(
			createVerificationService().advance({ registryEntityId: "", verifierLevel: "desa" }),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: {
					registryEntityId: ["Registry entity ID is required."],
					verifierLevel: [
						"Verifier level must be desa_kelurahan, kecamatan, sopd, kabupaten, or admin_sikesra.",
					],
				},
			},
		});

		await expect(
			createVerificationService({ stageState: { "registry-1": "active_verified" } }).advance({
				registryEntityId: "registry-1",
				verifierLevel: "admin_sikesra",
			}),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				message: "Registry entity registry-1 is already at the final verification stage.",
			},
		});

		await expect(
			createVerificationService({ stageState: { "registry-1": "submitted_sopd" } }).reject({
				registryEntityId: "registry-1",
				verifierLevel: "sopd",
			}),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: { reason: ["Reason is required when returning verification for revision."] },
			},
		});

		await expect(
			createVerificationService({ stageState: { "registry-1": "submitted_sopd" } }).advance({
				registryEntityId: "registry-1",
				verifierLevel: "kecamatan",
			}),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_PERMISSION_DENIED",
				message: "Verification for registry-1 must be handled by sopd.",
			},
		});
	});

	it("creates normalized EmDash-linked role assignment DTOs", async () => {
		await expect(
			createAccessService().assignRoles({
				emdashUserId: " user-1 ",
				roles: ["sikesra_admin", "sikesra_viewer_laporan", "sikesra_admin", ""],
				regionScopeType: " regency ",
				regionScopeCode: " 6201 ",
				organizationScopeType: " site ",
				organizationScopeCode: " site-main ",
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "role-assignment:user-1",
				emdashUserId: "user-1",
				roles: ["sikesra_admin", "sikesra_viewer_laporan"],
				regionScopeType: "regency",
				regionScopeCode: "6201",
				organizationScopeType: "site",
				organizationScopeCode: "site-main",
				status: "pending_persistence",
			},
		});
	});

	it("validates EmDash-linked role assignment inputs", async () => {
		await expect(createAccessService().assignRoles({ emdashUserId: "", roles: [""] })).resolves
			.toMatchObject({
				ok: false,
				error: {
					code: "SIKESRA_VALIDATION_ERROR",
					fieldErrors: {
						emdashUserId: ["EmDash user ID is required."],
						roles: ["At least one SIKESRA role is required."],
					},
				},
			});
	});

	it("previews access decisions through active role assignments", async () => {
		const service = createAccessService({
			userRoleAssignments: [
				{ userId: " user-1 ", roles: ["sikesra_admin", "sikesra_admin", ""], isActive: true },
			],
			rolePermissionAssignments: [
				{ roleSlug: "sikesra_admin", permissions: ["sikesra.registry.read", "sikesra.audit.read"] },
				{ roleSlug: "sikesra_viewer", permissions: ["sikesra.report.read"] },
			],
		});

		await expect(
			service.preview({ userId: " user-1 ", permissionSlug: " sikesra.registry.read " }),
		).resolves.toEqual({
			ok: true,
			data: {
				userId: "user-1",
				permissionSlug: "sikesra.registry.read",
				allowed: true,
				matchedRoles: ["sikesra_admin"],
				deniedReasons: [],
			},
		});

		await expect(
			service.preview({ userId: "user-1", permissionSlug: "sikesra.permanent_delete.execute" }),
		).resolves.toEqual({
			ok: true,
			data: {
				userId: "user-1",
				permissionSlug: "sikesra.permanent_delete.execute",
				allowed: false,
				matchedRoles: [],
				deniedReasons: [
					"Permission sikesra.permanent_delete.execute is not granted by the active role assignments.",
				],
			},
		});
	});

	it("validates access preview inputs and denies users without active assignments", async () => {
		await expect(
			createAccessService().preview({ userId: "", permissionSlug: "" }),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: {
					userId: ["User ID is required."],
					permissionSlug: ["Permission slug is required."],
				},
			},
		});

		await expect(
			createAccessService({
				userRoleAssignments: [{ userId: "user-1", roles: ["sikesra_admin"], isActive: false }],
			}).preview({ userId: "user-1", permissionSlug: "sikesra.registry.read" }),
		).resolves.toEqual({
			ok: true,
			data: {
				userId: "user-1",
				permissionSlug: "sikesra.registry.read",
				allowed: false,
				matchedRoles: [],
				deniedReasons: ["No active role assignment found for user-1."],
			},
		});
	});

	it("previews ABAC allow and explicit deny decisions", async () => {
		const service = createAbacService({
			subjects: [{ id: " user-1 ", attributes: { role: "operator", region_scope: "620101" } }],
			resources: [{ id: " registry-1 ", attributes: { module_id: "rumah_ibadah", region_code: "620101" } }],
			policies: [
				{
					id: "allow-registry-read",
					actions: ["read"],
					effect: "allow",
					requiredSubject: { role: "operator" },
					requiredResource: { module_id: "rumah_ibadah" },
					requiredContext: { purpose: "verification" },
				},
				{
					id: "deny-closed-record",
					actions: ["read"],
					effect: "deny",
					requiredResource: { module_id: "rumah_ibadah" },
					requiredContext: { record_status: "closed" },
				},
			],
		});

		await expect(
			service.preview({
				subjectId: " user-1 ",
				resourceId: " registry-1 ",
				action: " read ",
				context: { purpose: " verification " },
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				allowed: true,
				effect: "allow",
				matchedPolicies: ["allow-registry-read"],
				reasons: ["Allowed by policy allow-registry-read."],
			},
		});

		await expect(
			service.preview({
				subjectId: "user-1",
				resourceId: "registry-1",
				action: "read",
				context: { purpose: "verification", record_status: "closed" },
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				allowed: false,
				effect: "deny",
				matchedPolicies: ["deny-closed-record"],
				reasons: ["Explicit deny from policy deny-closed-record."],
			},
		});
	});

	it("previews ABAC missing context and validation failures", async () => {
		const service = createAbacService({
			subjects: [{ id: "user-1", attributes: { role: "operator" } }],
			resources: [{ id: "registry-1", attributes: { module_id: "rumah_ibadah" } }],
			policies: [
				{
					id: "allow-with-purpose",
					actions: ["read"],
					effect: "allow",
					requiredSubject: { role: "operator" },
					requiredContext: { purpose: "verification" },
				},
			],
		});

		await expect(
			service.preview({ subjectId: "user-1", resourceId: "registry-1", action: "read" }),
		).resolves.toEqual({
			ok: true,
			data: {
				allowed: false,
				effect: "deny",
				matchedPolicies: [],
				reasons: ["Missing required attributes: purpose."],
			},
		});

		await expect(createAbacService().preview({ subjectId: "", resourceId: "", action: "" })).resolves
			.toMatchObject({
				ok: false,
				error: {
					code: "SIKESRA_VALIDATION_ERROR",
					fieldErrors: {
						subjectId: ["Subject ID is required."],
						resourceId: ["Resource ID is required."],
						action: ["Action is required."],
					},
				},
			});
	});

	it("saves custom attribute values through a typed service contract", async () => {
		await expect(
			createCustomAttributeService().saveValue({
				definitionId: " custom-def-1 ",
				ownerType: " registry ",
				ownerId: " registry-entity-1 ",
				registryEntityId: " registry-entity-1 ",
				sikesraId20: " 62010100010101000001 ",
				value: { label: "Custom value" },
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "custom-def-1:registry:registry-entity-1",
				definitionId: "custom-def-1",
				ownerType: "registry",
				ownerId: "registry-entity-1",
				registryEntityId: "registry-entity-1",
				sikesraId20: "62010100010101000001",
				value: { label: "Custom value" },
				status: "pending_persistence",
			},
		});

		await expect(
			createCustomAttributeService().saveValue({
				definitionId: "",
				ownerType: "core_table",
				ownerId: "",
				value: undefined,
			}),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: {
					definitionId: ["Definition ID is required."],
					ownerType: ["Owner type must be registry, sikesra_id, entity_type, or subtype."],
					ownerId: ["Owner ID is required."],
					value: ["Custom attribute value is required."],
				},
			},
		});
	});

	it("validates staged import promotion service payloads", async () => {
		await expect(
			createImportService().promote({
				batchId: " batch-1 ",
				rowIds: [" row-1 ", "row-2", "row-1", ""],
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				batchId: "batch-1",
				status: "ready_for_promotion",
				rowIds: ["row-1", "row-2"],
				rowCount: 2,
				mode: "selected_rows",
			},
		});

		await expect(createImportService().promote({ batchId: "batch-1" })).resolves.toEqual({
			ok: true,
			data: {
				batchId: "batch-1",
				status: "ready_for_promotion",
				rowIds: [],
				rowCount: 0,
				mode: "all_valid_rows",
			},
		});

		await expect(createImportService().promote({ rows: [{ code: "RI-001" }] })).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: { batchId: ["Import promotion requires a staged batch ID."] },
			},
		});

		await expect(
			createImportService().promote({ batchId: "batch-1", rows: [{ code: "RI-001" }] }),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: { rows: ["Inline rows are not accepted during promotion."] },
			},
		});
	});

	it("saves document metadata through an admin-safe DTO contract", async () => {
		await expect(
			createDocumentService().saveMetadata({
				registryEntityId: " registry-entity-1 ",
				title: " Surat Keterangan Domisili ",
				documentType: " surat_keterangan ",
				classification: "restricted",
				fileObjectId: " file-1 ",
				contentType: " application/pdf ",
				fileSizeBytes: 2048,
				checksumSha256: " abc123 ",
				originalFilename: "private-original-name.pdf",
				safeFilename: "safe-name.pdf",
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "registry-entity-1:document:surat-keterangan-domisili",
				registryEntityId: "registry-entity-1",
				title: "Surat Keterangan Domisili",
				documentType: "surat_keterangan",
				classification: "restricted",
				validationStatus: "pending",
				fileObjectId: "file-1",
				contentType: "application/pdf",
				fileSizeBytes: 2048,
				checksumSha256: "abc123",
			},
		});

		await expect(
			createDocumentService().saveMetadata({
				registryEntityId: "",
				title: "",
				documentType: "pdf",
				classification: "secret",
				fileSizeBytes: -1,
			}),
		).resolves.toMatchObject({
			ok: false,
			error: {
				code: "SIKESRA_VALIDATION_ERROR",
				fieldErrors: {
					registryEntityId: ["Registry entity ID is required."],
					title: ["Document title is required."],
					classification: ["Classification must be public_safe, internal, or restricted."],
					fileSizeBytes: ["File size must not be negative."],
				},
			},
		});
	});

	it("creates controlled export service jobs with public-safe field filtering", async () => {
		await expect(
			createExportService().create({
				id: "export-1",
				exportType: "report",
				entityType: "rumah_ibadah",
				requestedFields: ["label", "alamat_ktp_detail", "label", "document_key"],
				sensitivityLevel: "public_safe",
			}),
		).resolves.toEqual({
			ok: true,
			data: {
				id: "export-1",
				exportType: "report",
				status: "needs_review",
				sensitivityLevel: "public_safe",
				requestedFields: ["label"],
				resultSummary: {
					entityType: "rumah_ibadah",
					filters: {},
					excludedFields: ["alamat_ktp_detail", "document_key"],
				},
				requestedAt: "pending-persistence",
			},
		});

		await expect(
			createExportService().create({
				exportType: "report",
				requestedFields: ["label", "email"],
				sensitivityLevel: "restricted",
			}),
		).resolves.toMatchObject({
			ok: false,
			error: { code: "SIKESRA_VALIDATION_ERROR" },
		});
	});

	it("redacts audit events through the audit service boundary", () => {
		expect(
			createAuditService().redact({
				id: "audit-1",
				timestamp: "2026-01-01T00:00:00Z",
				kind: "registry.update",
				scope: "registry",
				summary: "Updated registry",
				metadata: {},
				redactionPolicy: "",
			}),
		).toMatchObject({ ok: true, data: { redactionPolicy: "sikesra_default_redacted" } });
	});

	it("defines the shared admin UI state statuses", () => {
		expect(createSikesraUiState("permission_denied", { reason: "missing role" })).toEqual({
			status: "permission_denied",
			data: { reason: "missing role" },
		});
	});
});

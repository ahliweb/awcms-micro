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

	it("defines service boundaries for remaining workflow domains", async () => {
		await expect(
			createVerificationService().advance({ registryEntityId: "r1", verifierLevel: "desa" }),
		).resolves.toMatchObject({ ok: false });
		await expect(
			createAccessService().preview({ userId: "u1", permissionSlug: "sikesra.registry.read" }),
		).resolves.toMatchObject({ ok: false });
		await expect(
			createAbacService().preview({ subjectId: "u1", resourceId: "r1", action: "read" }),
		).resolves.toMatchObject({ ok: false });
		await expect(
			createCrudGovernanceService().softDelete({ id: "r1", reason: "duplicate" }),
		).resolves.toMatchObject({ ok: false });
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

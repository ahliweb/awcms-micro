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
			createDocumentService().saveMetadata({
				registryEntityId: "r1",
				title: "Doc",
				documentType: "pdf",
				classification: "restricted",
			}),
		).resolves.toMatchObject({ ok: false });
		await expect(createImportService().promote({ batchId: "b1" })).resolves.toMatchObject({
			ok: false,
		});
		await expect(
			createExportService().create({
				exportType: "report",
				requestedFields: [],
				sensitivityLevel: "public_safe",
			}),
		).resolves.toMatchObject({ ok: false });
		await expect(
			createAccessService().preview({ userId: "u1", permissionSlug: "sikesra.registry.read" }),
		).resolves.toMatchObject({ ok: false });
		await expect(
			createAbacService().preview({ subjectId: "u1", resourceId: "r1", action: "read" }),
		).resolves.toMatchObject({ ok: false });
		await expect(
			createCustomAttributeService().saveValue({
				definitionId: "d1",
				ownerType: "registry",
				ownerId: "r1",
				value: "x",
			}),
		).resolves.toMatchObject({ ok: false });
		await expect(
			createCrudGovernanceService().softDelete({ id: "r1", reason: "duplicate" }),
		).resolves.toMatchObject({ ok: false });
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

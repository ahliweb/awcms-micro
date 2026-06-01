import { describe, expect, it } from "vitest";

import type { SikesraScopedRepository } from "../src/db/index.js";
import type { SikesraRegistryEntityRow } from "../src/db/repositories/registry-repository.js";
import { createPublicAggregateService, createRegistryService } from "../src/services/index.js";

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
				categories: [{ key: "lks", label: "LKS", count: null, suppressed: true, suppressionReason: undefined }],
			},
		});
	});
});

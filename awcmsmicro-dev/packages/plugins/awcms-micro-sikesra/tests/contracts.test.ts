import { describe, expect, it } from "vitest";

import {
	normalizeSikesraPagination,
	sikesraError,
	sikesraOk,
	SIKESRA_ERROR_CODES,
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
});

import { it, expect, describe, beforeEach, afterEach } from "vitest";

import { handleMediaList } from "../../../src/api/handlers/media.js";
import { MediaRepository } from "../../../src/database/repositories/media.js";
import {
	setupForDialect,
	teardownForDialect,
	type DialectTestContext,
} from "../../utils/test-db.js";

describe("handleMediaList multi-MIME", () => {
	let ctx: DialectTestContext;

	beforeEach(async () => {
		ctx = await setupForDialect("sqlite");
		const repo = new MediaRepository(ctx.db);
		await repo.create({ filename: "a.png", mimeType: "image/png", storageKey: "a.png" });
		await repo.create({ filename: "b.pdf", mimeType: "application/pdf", storageKey: "b.pdf" });
		await repo.create({ filename: "c.zip", mimeType: "application/zip", storageKey: "c.zip" });
	});

	afterEach(async () => {
		await teardownForDialect(ctx);
	});

	it("accepts an array of MIME entries", async () => {
		const result = await handleMediaList(ctx.db, {
			mimeType: ["image/", "application/pdf"],
		});
		if (!result.success) throw new Error("expected success");
		expect(result.data.items.map((i) => i.mimeType).toSorted()).toEqual([
			"application/pdf",
			"image/png",
		]);
	});

	it("forwards the media search query", async () => {
		const repo = new MediaRepository(ctx.db);
		await repo.create({
			filename: "winter-hike.jpg",
			mimeType: "image/jpeg",
			storageKey: "winter-hike.jpg",
			alt: "Winter hike in the mountains",
		});
		await repo.create({
			filename: "spring-fair.jpg",
			mimeType: "image/jpeg",
			storageKey: "spring-fair.jpg",
			caption: "Spring fair opening parade",
		});

		const result = await handleMediaList(ctx.db, {
			query: "parade",
		});
		if (!result.success) throw new Error("expected success");
		expect(result.data.items).toHaveLength(1);
		expect(result.data.items[0]?.filename).toBe("spring-fair.jpg");
	});
});

import { describe, expect, it } from "vitest";

import { buildContentPickerSelection } from "../../src/components/ContentPickerModal";

describe("ContentPickerModal", () => {

	it("builds content picker selection with parentId", () => {
		expect(
			buildContentPickerSelection(
				{ collection: "posts", id: "post-1", title: "Blog" },
				"parent1",
			),
		).toEqual({
			collection: "posts",
			id: "post-1",
			title: "Blog",
			parentId: "parent1",
		});
		expect(
			buildContentPickerSelection(
				{ collection: "posts", id: "post-2", title: "Docs" },
				"",
			),
		).toEqual({
			collection: "posts",
			id: "post-2",
			title: "Docs",
		});
	});
});

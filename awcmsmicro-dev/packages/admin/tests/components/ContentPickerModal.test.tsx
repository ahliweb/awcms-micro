import { describe, expect, it } from "vitest";

import {
	buildContentPickerParentLabel,
	buildContentPickerSelection,
} from "../../src/components/ContentPickerModal";

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

	it("builds the selected parent label", () => {
		expect(
			buildContentPickerParentLabel({ parent1: "Home", parent2: "About" }, "parent1", "Top level"),
		).toBe("Home");
		expect(buildContentPickerParentLabel(undefined, "", "Top level")).toBe("Top level");
		expect(buildContentPickerParentLabel({ parent1: "Home" }, "missing", "Top level")).toBe(
			"Top level",
		);
	});
});

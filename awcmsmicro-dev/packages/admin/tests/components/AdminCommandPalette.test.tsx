import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { render } from "../utils/render.tsx";

let capturedItems: unknown[] = [];

vi.mock("@cloudflare/kumo", () => ({
	CommandPalette: {
		Root: ({ items }: { items: unknown[]; children?: React.ReactNode }) => {
			capturedItems = items;
			return null;
		},
		Input: () => null,
		List: () => null,
		Loading: () => null,
		Results: () => null,
		Group: () => null,
		GroupLabel: () => null,
		Items: () => null,
		ResultItem: () => null,
		Empty: () => null,
		Footer: () => null,
	},
}));

vi.mock("@tanstack/react-query", () => ({
	useQuery: () => ({ data: undefined, isFetching: false }),
}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
}));

vi.mock("react-hotkeys-hook", () => ({
	useHotkeys: () => undefined,
}));

vi.mock("../../src/lib/api/current-user", () => ({
	useCurrentUser: () => ({ data: { role: 50 } }),
}));

vi.mock("../../src/lib/api/client", () => ({
	apiFetch: vi.fn(),
}));

const { AdminCommandPalette } = await import("../../src/components/AdminCommandPalette");

const manifest = {
	collections: { posts: { label: "Posts" } },
	plugins: {
		"plugin-alpha": {
			enabled: true,
			adminPages: [{ path: "/overview", label: "Overview" }],
		},
	},
};

describe("AdminCommandPalette", () => {
	beforeEach(() => {
		capturedItems = [];
	});

	it("lists plugin pages before collections and core admin links", async () => {
		await render(<AdminCommandPalette manifest={manifest as never} />);

		const navigationGroup = capturedItems[0] as { items: Array<{ id: string }> };
		expect(navigationGroup.items.map((item) => item.id)).toEqual([
			"dashboard",
			"plugin-plugin-alpha-/overview",
			"collection-posts",
			"media",
			"menus",
			"widgets",
			"sections",
			"content-types",
			"categories",
			"tags",
			"users",
			"plugins",
			"import",
			"settings",
			"security",
		]);
	});
});

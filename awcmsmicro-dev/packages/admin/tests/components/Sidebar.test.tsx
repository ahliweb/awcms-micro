import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { render } from "../utils/render.tsx";

vi.mock("@cloudflare/kumo", () => {
	const Block = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
		<div {...props}>{children}</div>
	);
	const SidebarRoot = Object.assign(Block, {
		Provider: Block,
		Header: Block,
		Content: Block,
		Footer: Block,
		Group: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
		GroupLabel: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
		GroupContent: Block,
		Menu: Block,
		MenuItem: Block,
		MenuBadge: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
		Separator: () => <hr />,
	});

	return {
		Sidebar: SidebarRoot,
		Tooltip: ({ children }: React.PropsWithChildren) => <>{children}</>,
		useSidebar: () => ({ state: "expanded" }),
	};
});

vi.mock("@tanstack/react-router", async () => {
	const actual =
		await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
	return {
		...actual,
		Link: ({ children, to, ...props }: React.PropsWithChildren<{ to?: string }>) => (
			<a href={typeof to === "string" ? to : "#"} {...props}>
				{children}
			</a>
		),
		useLocation: () => ({ pathname: "/" }),
	};
});

vi.mock("@tanstack/react-query", () => ({
	useQuery: () => ({ data: { pending: 3 } }),
}));

vi.mock("../../src/lib/api/current-user", () => ({
	useCurrentUser: () => ({ data: { role: 50 } }),
}));

vi.mock("../../src/lib/plugin-context", () => ({
	usePluginAdmins: () => ({
		"plugin-alpha": { pages: { "/overview": () => null } },
		"plugin-beta": { pages: { "/settings": () => null } },
	}),
}));

const { SidebarNav } = await import("../../src/components/Sidebar");

const manifest = {
	collections: { posts: { label: "Posts" } },
	plugins: {
		"plugin-alpha": {
			name: "Alpha",
			enabled: true,
			adminPages: [{ path: "/overview", label: "Overview", icon: "chart" }],
		},
		"plugin-beta": {
			name: "Beta",
			enabled: true,
			adminPages: [{ path: "/settings", label: "Settings", icon: "globe" }],
		},
	},
	taxonomies: [{ name: "cats", label: "Categories" }],
	version: "1.0.0",
	hash: "abc",
	authMode: "passkey",
	admin: { siteName: "Site" },
};

describe("SidebarNav", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders plugin groups before core admin groups", async () => {
		await render(<SidebarNav manifest={manifest} />);

		const groupLabels = Array.from(document.querySelectorAll("h2"), (el) => el.textContent ?? "");
		expect(groupLabels).toEqual(["Alpha", "Beta", "Content", "Manage", "Admin"]);
		expect(document.querySelectorAll("h2 svg")).toHaveLength(2);
		expect(document.querySelector('a[href="/plugins/plugin-alpha/overview"] svg')).not.toBeNull();
		expect(document.querySelector('a[href="/plugins/plugin-beta/settings"] svg')).not.toBeNull();
	});
});

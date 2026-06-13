import * as React from "react";
import { vi, describe, expect, it, beforeEach } from "vitest";

import { render } from "../utils/render.tsx";
import { TestWrapper } from "../utils/test-helpers.tsx";

vi.mock("@cloudflare/kumo", () => {
	const Sidebar = Object.assign(
		({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
			<aside {...props}>{children}</aside>
		),
		{
			Provider: ({ children }: React.PropsWithChildren) => <>{children}</>,
			Header: ({ children }: React.PropsWithChildren) => (
				<header data-sidebar="header">{children}</header>
			),
			Content: ({ children }: React.PropsWithChildren) => (
				<div data-sidebar="content">{children}</div>
			),
			Footer: ({ children }: React.PropsWithChildren) => (
				<footer data-sidebar="footer">{children}</footer>
			),
			Group: ({ children }: React.PropsWithChildren) => (
				<section data-sidebar="group">{children}</section>
			),
			Menu: ({ children }: React.PropsWithChildren) => <nav data-sidebar="menu">{children}</nav>,
			MenuItem: ({ children }: React.PropsWithChildren) => (
				<div data-sidebar="menu-item">{children}</div>
			),
			MenuBadge: ({ children }: React.PropsWithChildren) => (
				<span data-sidebar="menu-badge">{children}</span>
			),
			Separator: () => <div data-sidebar="separator" />,
			GroupLabel: ({ children }: React.PropsWithChildren) => (
				<div data-sidebar="group-label">{children}</div>
			),
			GroupContent: ({ children }: React.PropsWithChildren) => (
				<div data-sidebar="group-content">{children}</div>
			),
		},
	);

	return {
		Sidebar,
		Tooltip: ({ children }: React.PropsWithChildren) => <>{children}</>,
		useSidebar: () => ({ state: "expanded" }),
	};
});

vi.mock("@tanstack/react-router", async () => {
	const actual =
		await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
	return {
		...actual,
		Link: ({ children, to, ...props }: any) => (
			<a href={to} {...props}>
				{children}
			</a>
		),
		useLocation: () => ({ pathname: "/" }),
	};
});

vi.mock("../../src/lib/api/current-user", () => ({
	useCurrentUser: () => ({ data: { role: 50 } }),
}));

vi.mock("../../src/lib/api/comments", () => ({
	fetchCommentCounts: () => Promise.resolve({ pending: 0 }),
}));

let mockedPluginAdmins: Record<string, { pages?: Record<string, unknown> }> = {};

beforeEach(() => {
	mockedPluginAdmins = {};
});

vi.mock("../../src/lib/plugin-context", () => ({
	usePluginAdmins: () => mockedPluginAdmins,
}));

const {
	BYLINE_SCHEMA_NAV_ITEM,
	buildSidebarPluginGroups,
	filterNavItemsByRole,
	formatSidebarFooterLabels,
	humanizePluginLabel,
	resolveSidebarIcon,
	SidebarNav,
} = await import("../../src/components/Sidebar");

describe("SidebarNav helpers", () => {
	it("keeps the byline schema admin route role-gated", () => {
		expect(BYLINE_SCHEMA_NAV_ITEM).toEqual({ to: "/byline-schema", minRole: 50 });
		expect(filterNavItemsByRole([BYLINE_SCHEMA_NAV_ITEM], 40)).toEqual([]);
		expect(filterNavItemsByRole([BYLINE_SCHEMA_NAV_ITEM], 50)).toEqual([BYLINE_SCHEMA_NAV_ITEM]);
	});

	it("humanizes plugin labels and resolves icons", () => {
		expect(humanizePluginLabel("awcms-micro-sikesra")).toBe("Awcms Micro Sikesra");
		expect(humanizePluginLabel("awcms-micro-sikesra", "Registry")).toBe("Registry");
		expect(resolveSidebarIcon("book")).toBeDefined();
		expect(resolveSidebarIcon("shield")).toBeDefined();
		expect(resolveSidebarIcon("code")).toBeDefined();
		expect(resolveSidebarIcon("unknown-icon")).toBeDefined();
	});

	it("renders AWCMS root and EmDash versions as separate footer lines", () => {
		expect(
			formatSidebarFooterLabels(
				{
					collections: {},
					plugins: {},
					taxonomies: [],
					version: "0.16.1",
					commit: "upstream",
					admin: { siteName: "Custom Admin" },
				},
				{ version: "0.1.3", commit: "b3a3113", emdashCommit: "47c445b" },
			),
		).toEqual({
			awcms: "AWCMS v0.1.3 (b3a3113)",
			emdash: "EmDash v0.16.1 (47c445b)",
		});
	});

	it("sorts plugin groups alphabetically and keeps page icons contextual", () => {
		const groups = buildSidebarPluginGroups(
			{
				collections: {},
				plugins: {
					"zeta-plugin": {
						name: "Zeta Plugin",
						enabled: true,
						adminMode: "blocks",
						adminPages: [{ path: "/settings", label: "Settings", icon: "gear" }],
					},
					"alpha-plugin": {
						name: "Alpha Plugin",
						enabled: true,
						adminMode: "blocks",
						adminPages: [{ path: "/overview", label: "Overview", icon: "chart" }],
					},
				},
				taxonomies: [],
			},
			{},
		);

		expect(groups.map((group) => group.label)).toEqual(["Alpha Plugin", "Zeta Plugin"]);
		expect(groups[0]?.items[0]?.label).toBe("Overview");
		expect(groups[1]?.items[0]?.label).toBe("Settings");
		expect(groups[0]?.items[0]?.icon).toBe(resolveSidebarIcon("chart"));
		expect(groups[1]?.items[0]?.icon).toBe(resolveSidebarIcon("gear"));
	});

	it("includes docs plugin pages in sidebar groups", () => {
		const groups = buildSidebarPluginGroups(
			{
				collections: {},
				plugins: {
					"awcms-micro-docs": {
						enabled: true,
						adminMode: "react",
						adminPages: [{ path: "/", label: "Docs", icon: "book" }],
					},
				},
				taxonomies: [],
			},
			{
				"awcms-micro-docs": { pages: { "/": {} } },
			},
		);

		expect(groups).toHaveLength(1);
		expect(groups[0]?.label).toBe("Docs");
		expect(groups[0]?.items[0]?.label).toBe("Docs");
		expect(groups[0]?.items[0]?.icon).toBe(resolveSidebarIcon("book"));
	});

	it("respects explicit group order over alphabetical", () => {
		const groups = buildSidebarPluginGroups(
			{
				collections: {},
				plugins: {
					"awcms-micro-docs": {
						enabled: true,
						adminMode: "react",
						adminPages: [{ path: "/", label: "Docs", icon: "book" }],
					},
					"awcms-micro-sikesra": {
						name: "AWCMS-Micro SIKESRA Plugin",
						enabled: true,
						adminMode: "react",
						adminPages: [{ path: "/", label: "SIKESRA", icon: "shield" }],
					},
				},
				taxonomies: [],
			},
			{
				"awcms-micro-docs": { pages: { "/": {} } },
				"awcms-micro-sikesra": { pages: { "/": {} } },
			},
			["awcms-micro-sikesra", "awcms-micro-docs"],
		);

		// SIKESRA (S) must precede Docs (D) even though "D" < "S" alphabetically
		expect(groups.map((g) => g.id)).toEqual([
			"plugin-awcms-micro-sikesra",
			"plugin-awcms-micro-docs",
		]);
	});

	it("appends unlisted plugins alphabetically after listed ones", () => {
		const groups = buildSidebarPluginGroups(
			{
				collections: {},
				plugins: {
					"awcms-micro-sikesra": {
						enabled: true,
						adminMode: "blocks",
						adminPages: [{ path: "/", label: "SIKESRA" }],
					},
					"unknown-plugin-b": {
						enabled: true,
						adminMode: "blocks",
						adminPages: [{ path: "/", label: "Beta Tool" }],
					},
					"unknown-plugin-a": {
						enabled: true,
						adminMode: "blocks",
						adminPages: [{ path: "/", label: "Alpha Tool" }],
					},
				},
				taxonomies: [],
			},
			{},
			["awcms-micro-sikesra"],
		);

		expect(groups.map((g) => g.id)).toEqual([
			"plugin-awcms-micro-sikesra", // listed → position 0
			"plugin-unknown-plugin-a", // unlisted, alphabetical: "Alpha Tool" < "Beta Tool"
			"plugin-unknown-plugin-b",
		]);
	});

	it("renders a single separator after dashboard", async () => {
		mockedPluginAdmins = {
			"awcms-micro-docs": { pages: { "/": () => null } },
		};
		const screen = await render(
			<TestWrapper>
				<SidebarNav
					manifest={{
						collections: { pages: { label: "Pages" } },
						plugins: {
							"awcms-micro-docs": {
								enabled: true,
								adminMode: "react",
								adminPages: [{ path: "/", label: "Docs", icon: "book" }],
							},
							"alpha-plugin": {
								name: "Alpha Plugin",
								enabled: true,
								adminMode: "blocks",
								adminPages: [{ path: "/overview", label: "Overview", icon: "chart" }],
							},
						},
						taxonomies: [],
					}}
				/>
			</TestWrapper>,
		);

		await expect.element(screen.getByText("Dashboard")).toBeInTheDocument();
		const groupLabels = Array.from(
			document.querySelectorAll('[data-sidebar="group-label"]'),
			(node) => node.textContent,
		);
		// awcms-micro-docs is in SIDEBAR_PLUGIN_GROUP_ORDER (pos=2); alpha-plugin is unlisted (falls to end)
		expect(groupLabels.slice(0, 2)).toEqual(["Docs", "Alpha Plugin"]);
		await expect.element(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
		await expect.element(screen.getByText("Alpha Plugin")).toBeInTheDocument();
		// awcms-micro-docs is config-ordered (pos=2) so it is the first group/summary rendered
		expect(document.querySelector("summary [data-sidebar='group-label']")?.textContent).toBe(
			"Docs",
		);
		const sidebarStyles = Array.from(
			document.querySelectorAll("style"),
			(style) => style.textContent ?? "",
		).find((style) => style.includes(".emdash-sidebar"));
		expect(sidebarStyles).toContain(
			'.emdash-sidebar [data-sidebar="content"] {\n\t\t\t\tgap: 0.125rem !important;',
		);
		expect(sidebarStyles).toContain("margin-block: 0 !important;");
		expect(sidebarStyles).toContain("padding-block: 0.125rem;");
		expect(sidebarStyles).toContain("border: 0 !important;");
		expect(sidebarStyles).toContain("margin: 0.125rem 0.75rem;");
		expect(document.querySelectorAll("summary button").length).toBe(0);
		expect(document.querySelectorAll('[data-sidebar="separator"]').length).toBe(4);
	});

	it("does not render adjacent sidebar separators", async () => {
		const screen = await render(
			<TestWrapper>
				<SidebarNav
					manifest={{
						collections: {},
						plugins: {},
						taxonomies: [],
					}}
				/>
			</TestWrapper>,
		);

		await expect.element(screen.getByText("Dashboard")).toBeInTheDocument();
		const currentSidebar = [...document.querySelectorAll("aside")].at(-1);
		const children = [
			...(currentSidebar?.querySelector('[data-sidebar="content"]')?.children ?? []),
		];
		expect(
			children.some(
				(child, index) =>
					child.getAttribute("data-sidebar") === "separator" &&
					children[index + 1]?.getAttribute("data-sidebar") === "separator",
			),
		).toBe(false);
	});
});

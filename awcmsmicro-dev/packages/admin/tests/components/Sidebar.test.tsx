import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PluginAdminProvider } from "../../src/lib/plugin-context";
import { render } from "../utils/render.tsx";

vi.mock("@cloudflare/kumo", () => {
	function SidebarRoot({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
		return <nav {...props}>{children}</nav>;
	}

	function passthrough(name: string) {
		return ({ children, collapsible: _collapsible, defaultOpen: _defaultOpen, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
			const Tag = name === "menu" ? "ul" : name === "menu-item" ? "li" : "div";
			return <Tag data-sidebar={name} {...props}>{children}</Tag>;
		};
	}

	const Sidebar = Object.assign(SidebarRoot, {
		Provider: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
		Header: passthrough("header"),
		Content: passthrough("content"),
		Footer: passthrough("footer"),
		Group: passthrough("group"),
		GroupLabel: passthrough("group-label"),
		GroupContent: passthrough("group-content"),
		Menu: passthrough("menu"),
		MenuItem: passthrough("menu-item"),
		MenuBadge: passthrough("menu-badge"),
		Separator: passthrough("separator"),
	});

	return {
		Sidebar,
		Tooltip: ({ children }: React.PropsWithChildren) => <>{children}</>,
		useSidebar: () => ({ state: "expanded" }),
	};
});

vi.mock("@tanstack/react-router", async () => {
	const actual = await vi.importActual("@tanstack/react-router");
	return {
		...actual,
		Link: ({ children, to, ...props }: { children: React.ReactNode; to?: string; [key: string]: unknown }) => (
			<a href={typeof to === "string" ? to : "#"} {...props}>
				{children}
			</a>
		),
		useLocation: () => ({ pathname: "/" }),
	};
});

vi.mock("../../src/lib/api/client", async () => {
	const actual = await vi.importActual("../../src/lib/api/client");
	return {
		...actual,
		apiFetch: vi.fn().mockImplementation((url: string) => {
			if (url.includes("/auth/me")) {
				return Promise.resolve(
					new Response(
						JSON.stringify({
							data: { id: "1", email: "admin@example.com", name: "Admin", role: 50 },
						}),
						{ status: 200 },
					),
				);
			}

			if (url.includes("/admin/comments/counts")) {
				return Promise.resolve(
					new Response(
						JSON.stringify({
							data: { pending: 0, approved: 0, spam: 0, trash: 0 },
						}),
						{ status: 200 },
					),
				);
			}

			return Promise.resolve(new Response(JSON.stringify({ data: {} }), { status: 200 }));
		}),
	};
});

const { SidebarNav } = await import("../../src/components/Sidebar");

const manifest = {
	collections: {
		posts: { label: "Posts" },
	},
	plugins: {
		"awcms-micro-gallery": {
			enabled: true,
			adminPages: [{ path: "/admin", label: "Overview" }],
		},
		"awcms-micro-sikesra": {
			enabled: true,
			adminPages: [{ path: "/reports", label: "Reports" }],
		},
	},
	taxonomies: [],
	admin: { siteName: "AWCMS-Micro" },
	version: "0.15.0",
};

function Wrapper({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});

	return (
		<QueryClientProvider client={queryClient}>
			<PluginAdminProvider
				pluginAdmins={{
					"awcms-micro-gallery": { pages: { "/admin": () => null } },
					"awcms-micro-sikesra": { pages: { "/reports": () => null } },
				}}
			>
				{children}
			</PluginAdminProvider>
		</QueryClientProvider>
	);
}

describe("SidebarNav", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders each active plugin in its own group below Dashboard and before default sections", async () => {
		const screen = await render(<SidebarNav manifest={manifest} />, { wrapper: Wrapper });

		await expect.element(screen.getByText("Gallery")).toBeInTheDocument();
		await expect.element(screen.getByText("Sikesra")).toBeInTheDocument();
		await expect.element(screen.getByText("Overview")).toBeInTheDocument();
		await expect.element(screen.getByText("Reports")).toBeInTheDocument();

		const labels = Array.from(
			document.querySelectorAll('[data-sidebar="group-label"]'),
			(node) => node.textContent?.trim(),
		);
		expect(labels.slice(0, 3)).toEqual(["Gallery", "Sikesra", "Content"]);
	});
});

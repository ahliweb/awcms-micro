import { Sidebar } from "@cloudflare/kumo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { PluginAdminProvider } from "../../src/lib/plugin-context";
import type { SidebarNavProps } from "../../src/components/Sidebar";
import { render } from "../utils/render.tsx";

vi.mock("@tanstack/react-router", async () => {
	const actual = await vi.importActual("@tanstack/react-router");
	return {
		...actual,
		Link: ({ children, to, params, ...props }: any) => {
			let href = String(to ?? "");
			if (params && typeof params === "object") {
				for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
					const stringified =
						value == null
							? ""
							: typeof value === "string" || typeof value === "number"
								? String(value)
								: "";
					href = href.replace(`$${key}`, stringified);
				}
			}
			return (
				<a href={href} {...props}>
					{children}
				</a>
			);
		},
		useLocation: () => ({ pathname: "/" }),
	};
});

vi.mock("../../src/lib/api/current-user", () => ({
	useCurrentUser: () => ({ data: { role: 50 } }),
}));

vi.mock("../../src/lib/api/comments", () => ({
	fetchCommentCounts: vi.fn().mockResolvedValue({ pending: 0, approved: 0, spam: 0, trash: 0 }),
}));

const { SidebarNav } = await import("../../src/components/Sidebar");

function makeManifest(): SidebarNavProps["manifest"] {
	return {
		version: "1.0.0",
		collections: {
			articles: { label: "Articles" },
		},
		plugins: {
			"awcms-micro-sikesra": {
				package: "@awcms-micro/plugin-sikesra",
				enabled: true,
				adminMode: "react",
				adminPages: [
					{ path: "/registry", label: "Registry", icon: "chart" },
					{ path: "/settings", label: "Audit", icon: "gear" },
				],
			},
			embeds: {
				package: "@emdash-cms/plugin-embeds",
				enabled: true,
				adminMode: "blocks",
				adminPages: [{ path: "/youtube", label: "YouTube", icon: "video" }],
			},
		},
		taxonomies: [],
		admin: { siteName: "AWCMS" },
	};
}

function Wrapper({ children }: { children: React.ReactNode }) {
	const qc = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});

	return (
		<QueryClientProvider client={qc}>
			<PluginAdminProvider
				pluginAdmins={{
					"awcms-micro-sikesra": { pages: { "/registry": () => null, "/settings": () => null } },
				}}
			>
				<Sidebar.Provider defaultOpen>{children}</Sidebar.Provider>
			</PluginAdminProvider>
		</QueryClientProvider>
	);
}

describe("SidebarNav", () => {
	it("renders plugin pages as grouped sections before default menus", async () => {
		const screen = await render(
			<Wrapper>
				<SidebarNav manifest={makeManifest()} />
			</Wrapper>,
		);

		await expect.element(screen.getByText("Dashboard")).toBeInTheDocument();
		await expect.element(screen.getByText("Sikesra")).toBeInTheDocument();
		await expect.element(screen.getByRole("link", { name: "Registry" })).toBeInTheDocument();
		await expect.element(screen.getByRole("link", { name: "Audit" })).toBeInTheDocument();
		await expect.element(screen.getByText("Articles")).toBeInTheDocument();

		const bodyText = document.body.textContent ?? "";
		expect(bodyText.indexOf("Dashboard")).toBeLessThan(bodyText.indexOf("Sikesra"));
		expect(bodyText.indexOf("Sikesra")).toBeLessThan(bodyText.indexOf("Articles"));
	});
});

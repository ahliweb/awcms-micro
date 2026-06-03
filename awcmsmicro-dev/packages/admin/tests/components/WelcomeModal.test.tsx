import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { describe, it, expect, vi } from "vitest";

import { consumeWelcomeRedirectMarker } from "../../src/components/Shell";
import { WelcomeModal } from "../../src/components/WelcomeModal";
import { render } from "../utils/render";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AWCMS_BRAND_TEXT = "AWCMS by AhliWeb.com & EmDash";
const ADMIN_TEXT_REGEX = /As an administrator, you can invite other users/;

vi.mock("../../src/lib/api/client", async () => {
	const actual = await vi.importActual("../../src/lib/api/client");
	return {
		...actual,
		apiFetch: vi
			.fn()
			.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 })),
	};
});

function QueryWrapper({ children }: { children: React.ReactNode }) {
	const qc = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

const noop = () => {};

describe("WelcomeModal", () => {
	it("consumes welcome redirect marker before showing the modal", () => {
		window.history.replaceState({}, "", "/_emdash/admin?section=dashboard&welcome=1#top");

		expect(consumeWelcomeRedirectMarker()).toBe(true);
		expect(window.location.pathname).toBe("/_emdash/admin");
		expect(window.location.search).toBe("?section=dashboard");
		expect(window.location.hash).toBe("#top");
	});

	it("shows 'Administrator' for role >= 50", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userRole={50} />
			</QueryWrapper>,
		);
		await expect.element(screen.getByText("Administrator", { exact: true })).toBeInTheDocument();
	});

	it("shows 'Editor' for role >= 40", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userRole={40} />
			</QueryWrapper>,
		);
		await expect.element(screen.getByText("Editor")).toBeInTheDocument();
	});

	it("shows 'Author' for role >= 30", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userRole={30} />
			</QueryWrapper>,
		);
		await expect.element(screen.getByText("Author")).toBeInTheDocument();
	});

	it("shows 'Contributor' for role >= 20", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userRole={20} />
			</QueryWrapper>,
		);
		await expect.element(screen.getByText("Contributor")).toBeInTheDocument();
	});

	it("shows 'Subscriber' for role < 20", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userRole={10} />
			</QueryWrapper>,
		);
		await expect.element(screen.getByText("Subscriber")).toBeInTheDocument();
	});

	it("renders AWCMS branding", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userName="Alice Smith" userRole={30} />
			</QueryWrapper>,
		);
		await expect.element(screen.getByAltText("AWCMS")).toBeInTheDocument();
		await expect.element(screen.getByText(AWCMS_BRAND_TEXT)).toBeInTheDocument();
	});

	it("'Get Started' button triggers dismiss mutation and calls onClose", async () => {
		const onClose = vi.fn();
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={onClose} userRole={30} />
			</QueryWrapper>,
		);
		const button = screen.getByText("Get Started").element().closest("button")!;
		button.click();
		// The mutation resolves and calls onClose
		await vi.waitFor(() => {
			expect(onClose).toHaveBeenCalled();
		});
	});

	it("admin text shown only for role >= 50", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userRole={50} />
			</QueryWrapper>,
		);
		await expect.element(screen.getByText(ADMIN_TEXT_REGEX)).toBeInTheDocument();
	});

	it("admin text not shown for role < 50", async () => {
		const screen = await render(
			<QueryWrapper>
				<WelcomeModal open={true} onClose={noop} userRole={40} />
			</QueryWrapper>,
		);
		// Check that the admin invite text is NOT present
		expect(screen.container.textContent).not.toContain(
			"As an administrator, you can invite other users",
		);
	});
});

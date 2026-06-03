import * as React from "react";

import { useCurrentUser } from "../lib/api/current-user";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { Header } from "./Header";
import { Sidebar, SidebarNav } from "./Sidebar";
import { WelcomeModal } from "./WelcomeModal";

const WELCOME_REDIRECT_PARAM = "welcome";

export interface ShellProps {
	children: React.ReactNode;
	manifest: {
		collections: Record<string, { label: string }>;
		plugins: Record<
			string,
			{
				name?: string;
				package?: string;
				adminPages?: Array<{ path: string; label?: string; icon?: string }>;
			}
		>;
		taxonomies: Array<{
			name: string;
			label: string;
		}>;
		version?: string;
	};
}

/**
 * Admin shell layout with kumo Sidebar component.
 *
 * Sidebar.Provider wraps both the sidebar and main content area,
 * handling collapse state, mobile detection, and layout transitions.
 */
export function Shell({ children, manifest }: ShellProps) {
	const [welcomeModalOpen, setWelcomeModalOpen] = React.useState(false);

	const { data: user } = useCurrentUser();

	// Show welcome modal on first login or immediately after an explicit login redirect.
	React.useEffect(() => {
		if (!user) return;

		const hasWelcomeRedirectMarker = consumeWelcomeRedirectMarker();
		if (user.isFirstLogin || hasWelcomeRedirectMarker) {
			setWelcomeModalOpen(true);
		}
	}, [user]);

	return (
		<Sidebar.Provider
			defaultOpen
			style={
				{
					height: "100svh",
					minHeight: "0",
					overflow: "hidden",
					"--sidebar-width-icon": "53px",
				} as React.CSSProperties
			}
		>
			{/* Sidebar navigation */}
			<SidebarNav manifest={manifest} />

			{/* Main content area — scrolls independently so sidebar stays full height */}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>

			{/* Welcome modal for first-time users */}
			{user && (
				<WelcomeModal
					open={welcomeModalOpen}
					onClose={() => setWelcomeModalOpen(false)}
					userName={user.name}
					userRole={user.role}
				/>
			)}

			{/* Command palette for quick navigation */}
			<AdminCommandPalette manifest={manifest} />
		</Sidebar.Provider>
	);
}

export function consumeWelcomeRedirectMarker(): boolean {
	if (typeof window === "undefined") return false;

	const url = new URL(window.location.href);
	if (url.searchParams.get(WELCOME_REDIRECT_PARAM) !== "1") return false;

	url.searchParams.delete(WELCOME_REDIRECT_PARAM);
	window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
	return true;
}

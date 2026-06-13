import { Sidebar as KumoSidebar, Tooltip, useSidebar } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react/macro";
import {
	ArrowSquareOut,
	ChartBar,
	Check,
	Code,
	FileText,
	Gear,
	Globe,
	GridFour,
	Image,
	Info,
	LinkSimple,
	ListBullets,
	Lock,
	Palette,
	PuzzlePiece,
	Shield,
	Sliders,
	SquaresFour,
	Upload,
	Users,
	Stack,
	VideoCamera,
	ChatCircle,
	Storefront,
	Database,
	List,
	ArrowsLeftRight,
	BookOpen,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import * as React from "react";

import { fetchCommentCounts } from "../lib/api/comments";
import { useCurrentUser } from "../lib/api/current-user";
import { SIDEBAR_PLUGIN_GROUP_ORDER } from "../config/sidebar-plugin-order.config.js";
import { usePluginAdmins } from "../lib/plugin-context";
import { cn } from "../lib/utils";
import { BrandIcon } from "./Logo.js";

// Re-export for Shell.tsx and Header.tsx
export { KumoSidebar as Sidebar, useSidebar };

// Role levels (matching @emdash-cms/auth)
const ROLE_ADMIN = 50;
const ROLE_EDITOR = 40;

export const BYLINE_SCHEMA_NAV_ITEM = {
	to: "/byline-schema" as const,
	minRole: ROLE_ADMIN,
} as const;

export function filterNavItemsByRole<T extends { minRole?: number }>(
	items: T[],
	userRole: number,
): T[] {
	return items.filter((item) => !item.minRole || userRole >= item.minRole);
}

export interface SidebarNavProps {
	manifest: {
		collections: Record<string, { label: string }>;
		plugins: Record<
			string,
			{
				name?: string;
				package?: string;
				enabled?: boolean;
				adminMode?: "react" | "blocks" | "none";
				adminPages?: Array<{
					path: string;
					label?: string;
					icon?: string;
				}>;
				dashboardWidgets?: Array<{ id: string; title?: string }>;
				version?: string;
			}
		>;
		taxonomies: Array<{
			name: string;
			label: string;
		}>;
		version?: string;
		commit?: string;
		marketplace?: string;
		registry?: {
			aggregatorUrl: string;
		};
		admin?: {
			logo?: string;
			siteName?: string;
			favicon?: string;
		};
	};
}

interface PluginGroup {
	id: string;
	label: string;
	items: NavItem[];
}

interface NavItem {
	to: string;
	label: string;
	icon: React.ElementType;
	params?: Record<string, string>;
	/** Minimum role level required to see this item */
	minRole?: number;
	/** Optional badge count (e.g., pending comments) */
	badge?: number;
}

/**
 * Navigation item rendered as a TanStack Router <Link> inside kumo's
 * Sidebar.MenuItem. Styled to match kumo MenuButton appearance.
 * This approach guarantees client-side navigation works correctly.
 */
function NavMenuLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
	const { state } = useSidebar();
	const Icon = item.icon;

	const link = (
		<Link
			// eslint-disable-next-line typescript/no-unsafe-type-assertion -- TanStack Router requires literal route types
			to={item.to as "/"}
			params={item.params}
			aria-current={isActive ? "page" : undefined}
			data-active={isActive || undefined}
			data-sidebar="menu-button"
			className={cn(
				"emdash-nav-link group/menu-button flex w-full min-w-0 items-center gap-2.5 rounded-md no-underline outline-none cursor-pointer",
				"min-h-[36px] px-3 py-1.5 text-[13px]",
				"transition-all duration-200 ease-out",
				isActive ? "bg-kumo-brand text-white" : "text-white/70 hover:text-white hover:bg-white/8",
				"focus-visible:ring-2 focus-visible:ring-kumo-brand/50",
			)}
		>
			<Icon
				className={cn(
					"emdash-nav-icon size-[18px] shrink-0 transition-colors duration-200",
					isActive ? "text-white" : "text-white/60 group-hover/menu-button:text-white/90",
				)}
				aria-hidden="true"
			/>
			<span className="emdash-nav-label flex flex-1 items-center min-w-0 text-start overflow-hidden">
				{item.label}
				{item.badge != null && item.badge > 0 && (
					<KumoSidebar.MenuBadge>{item.badge}</KumoSidebar.MenuBadge>
				)}
			</span>
		</Link>
	);

	return (
		<KumoSidebar.MenuItem>
			{state === "collapsed" ? (
				<Tooltip content={item.label} side="right" asChild>
					{link}
				</Tooltip>
			) : (
				link
			)}
		</KumoSidebar.MenuItem>
	);
}

/** Resolves a nav item's route path by substituting $param placeholders. */
function resolveItemPath(item: NavItem): string {
	let path = item.to;
	if (item.params) {
		for (const [key, value] of Object.entries(item.params)) {
			path = path.replace(`$${key}`, value);
		}
	}
	return path;
}

export function humanizePluginLabel(pluginId: string, label?: string): string {
	if (label) return label;
	return pluginId
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function resolveSidebarIcon(iconKey?: string): React.ElementType {
	switch (iconKey) {
		case "chart":
			return ChartBar;
		case "check":
			return Check;
		case "code":
			return Code;
		case "file":
			return FileText;
		case "form":
			return ListBullets;
		case "gear":
		case "settings":
			return Gear;
		case "globe":
			return Globe;
		case "grid":
			return GridFour;
		case "image":
			return Image;
		case "info":
			return Info;
		case "inbox":
			return ListBullets;
		case "link":
			return LinkSimple;
		case "link-external":
			return ArrowSquareOut;
		case "list":
			return ListBullets;
		case "lock":
			return Lock;
		case "shield":
			return Shield;
		case "sliders":
			return Sliders;
		case "video":
			return VideoCamera;
		case "book":
			return BookOpen;
		default:
			return PuzzlePiece;
	}
}

interface AwcmsRootVersionInfo {
	version?: string;
	commit?: string;
	emdashCommit?: string;
}

function getAwcmsRootVersionInfo(): AwcmsRootVersionInfo {
	return {
		version: import.meta.env.AWCMS_ROOT_VERSION,
		commit: import.meta.env.AWCMS_ROOT_COMMIT,
		emdashCommit: import.meta.env.AWCMS_EMDASH_COMMIT,
	};
}

function formatAwcmsRootVersionLabel(rootVersion: AwcmsRootVersionInfo): string {
	const version = rootVersion.version?.trim() || "0.0.0";
	const commit = rootVersion.commit?.trim();
	return `AWCMS v${version}${commit ? ` (${commit})` : ""}`;
}

export function formatSidebarFooterLabels(
	manifest: SidebarNavProps["manifest"],
	rootVersion: AwcmsRootVersionInfo = getAwcmsRootVersionInfo(),
): { awcms: string; emdash: string } {
	const emdashVersion = manifest.version || "0.0.0";
	const emdashCommitValue = rootVersion.emdashCommit?.trim() || manifest.commit?.trim();
	const emdashCommit = emdashCommitValue ? ` (${emdashCommitValue})` : "";
	return {
		awcms: formatAwcmsRootVersionLabel(rootVersion),
		emdash: `EmDash v${emdashVersion}${emdashCommit}`,
	};
}

export function buildSidebarPluginGroups(
	manifest: SidebarNavProps["manifest"],
	pluginAdmins: Record<string, { pages?: Record<string, unknown> }>,
	groupOrder: readonly string[] = SIDEBAR_PLUGIN_GROUP_ORDER,
): PluginGroup[] {
	return Object.entries(manifest.plugins)
		.filter(([, config]) => config.enabled !== false && (config.adminPages?.length ?? 0) > 0)
		.map(([pluginId, config]) => {
			const pluginPages = pluginAdmins[pluginId]?.pages;
			const isBlocksMode = config.adminMode === "blocks";
			const singlePageLabel =
				config.adminPages?.length === 1 ? config.adminPages[0]?.label?.trim() : undefined;
			const pages = config.adminPages
				? config.adminPages
						.filter((page) => isBlocksMode || Boolean(pluginPages?.[page.path]))
						.map((page) => ({
							to: `/plugins/${pluginId}${page.path}`,
							label: page.label || humanizePluginLabel(pluginId),
							icon: resolveSidebarIcon(page.icon),
						}))
				: [];

			return {
				id: `plugin-${pluginId}`,
				label: config.name?.trim() || singlePageLabel || humanizePluginLabel(pluginId),
				items: pages,
			};
		})
		.filter((group) => group.items.length > 0)
		.toSorted((a, b) => {
			const pluginIdA = a.id.replace(/^plugin-/, "");
			const pluginIdB = b.id.replace(/^plugin-/, "");
			const posA = groupOrder.indexOf(pluginIdA);
			const posB = groupOrder.indexOf(pluginIdB);
			const effectivePosA = posA >= 0 ? posA : groupOrder.length;
			const effectivePosB = posB >= 0 ? posB : groupOrder.length;
			if (effectivePosA !== effectivePosB) return effectivePosA - effectivePosB;
			return (
				a.label.localeCompare(b.label, undefined, { sensitivity: "base" }) ||
				a.id.localeCompare(b.id)
			);
		});
}

/** Checks if a nav item is active based on the current router path. */
function isItemActive(itemPath: string, currentPath: string): boolean {
	return itemPath === "/"
		? currentPath === "/"
		: currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

/**
 * Admin sidebar navigation using kumo's Sidebar compound component.
 */
export function SidebarNav({ manifest }: SidebarNavProps) {
	const { t } = useLingui();
	const location = useLocation();
	const currentPath = location.pathname;
	const pluginAdmins = usePluginAdmins();
	const footerLabels = formatSidebarFooterLabels(manifest);

	const { data: user } = useCurrentUser();
	const userRole = user?.role ?? 0;

	// Fetch pending comment count for badge
	const { data: commentCounts } = useQuery({
		queryKey: ["commentCounts"],
		queryFn: fetchCommentCounts,
		staleTime: 60 * 1000,
		retry: false,
		enabled: userRole >= ROLE_EDITOR,
	});

	// --- Build nav item groups ---

	const contentItems: NavItem[] = [{ to: "/", label: t`Dashboard`, icon: SquaresFour }];
	for (const [name, config] of Object.entries(manifest.collections)) {
		contentItems.push({
			to: "/content/$collection",
			label: config.label,
			icon: FileText,
			params: { collection: name },
		});
	}
	contentItems.push({ to: "/media", label: t`Media`, icon: Image });

	const manageItems: NavItem[] = [
		{
			to: "/comments",
			label: t`Comments`,
			icon: ChatCircle,
			minRole: ROLE_EDITOR,
			badge: commentCounts?.pending,
		},
		{ to: "/menus", label: t`Menus`, icon: List, minRole: ROLE_EDITOR },
		{ to: "/redirects", label: t`Redirects`, icon: ArrowsLeftRight, minRole: ROLE_ADMIN },
		{ to: "/widgets", label: t`Widgets`, icon: GridFour, minRole: ROLE_EDITOR },
		{ to: "/sections", label: t`Sections`, icon: Stack, minRole: ROLE_EDITOR },
		...manifest.taxonomies.map((tax) => ({
			to: "/taxonomies/$taxonomy" as const,
			label: tax.label,
			icon: FileText,
			params: { taxonomy: tax.name },
			minRole: ROLE_EDITOR,
		})),
		{ to: "/bylines", label: t`Bylines`, icon: FileText, minRole: ROLE_EDITOR },
	];

	const adminItems: NavItem[] = [
		{ to: "/content-types", label: t`Content Types`, icon: Database, minRole: ROLE_ADMIN },
		{ to: "/users", label: t`Users`, icon: Users, minRole: ROLE_ADMIN },
		{ to: "/plugins-manager", label: t`Plugins`, icon: PuzzlePiece, minRole: ROLE_ADMIN },
	];

	if (manifest.registry) {
		adminItems.push({
			to: "/plugins/marketplace",
			label: t`Registry`,
			icon: Storefront,
			minRole: ROLE_ADMIN,
		});
	} else if (manifest.marketplace) {
		adminItems.push({
			to: "/plugins/marketplace",
			label: t`Marketplace`,
			icon: Storefront,
			minRole: ROLE_ADMIN,
		});
	}

	if (manifest.marketplace) {
		adminItems.push({
			to: "/themes/marketplace",
			label: t`Themes`,
			icon: Palette,
			minRole: ROLE_ADMIN,
		});
	}

	adminItems.push(
		{ to: "/import/wordpress", label: t`Import`, icon: Upload, minRole: ROLE_ADMIN },
		{ to: "/settings", label: t`Settings`, icon: Gear, minRole: ROLE_ADMIN },
	);

	const visibleContent = filterNavItemsByRole(contentItems, userRole);
	const visibleManage = filterNavItemsByRole(manageItems, userRole);
	const visibleAdmin = filterNavItemsByRole(adminItems, userRole);
	const visiblePluginGroups = buildSidebarPluginGroups(manifest, pluginAdmins).map((group) => ({
		...group,
		items: filterNavItemsByRole(group.items, userRole),
	}));
	const hasContentSection = visibleContent.length > 1;
	const hasPluginSection = visiblePluginGroups.length > 0;
	const hasManageSection = visibleManage.length > 0;
	const hasAdminSection = visibleAdmin.length > 0;

	function renderNavItems(items: NavItem[]) {
		return items.map((item, index) => {
			const itemPath = resolveItemPath(item);
			const active = isItemActive(itemPath, currentPath);
			return <NavMenuLink key={`${item.to}-${index}`} item={item} isActive={active} />;
		});
	}

	return (
		<>
			{/* Injected styles — Tailwind 4 strips [data-sidebar] attribute selectors from CSS files.
			    All sidebar-specific overrides go here to avoid conflicting with kumo's inline styles. */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
			/* Classic dark chrome — override kumo tokens within the sidebar */
			.emdash-sidebar {
				--color-kumo-base: #1d2327;
				--sidebar-bg: #1d2327;
				--color-kumo-tint: rgba(255,255,255,0.1);
				--color-kumo-line: rgba(255,255,255,0.08);
				--color-kumo-brand: #2271b1;
				--text-color-kumo-default: #fff;
				--text-color-kumo-subtle: rgba(255,255,255,0.7);
				--text-color-kumo-strong: #fff;
				background-color: #1d2327 !important;
				color: #fff !important;
				border-color: rgba(255,255,255,0.08) !important;
			}
			.emdash-sidebar details > summary {
				list-style: none;
				cursor: pointer;
				margin: 0;
			}
			.emdash-sidebar details {
				margin: 0;
			}
			.emdash-sidebar [data-sidebar="content"] {
				gap: 0.125rem !important;
			}
			.emdash-sidebar [data-sidebar="group"] {
				gap: 0.125rem !important;
				border: 0 !important;
				margin-block: 0 !important;
				padding-block: 0 !important;
			}
			.emdash-sidebar [data-sidebar="menu"] {
				gap: 0.125rem !important;
			}
			.emdash-sidebar details > summary::-webkit-details-marker {
				display: none;
			}
			.emdash-sidebar details > summary::marker {
				content: "";
			}
			/* Group labels — uppercase muted style */
			.emdash-sidebar [data-sidebar="group-label"] {
				color: rgba(255,255,255,0.45) !important;
				font-size: 11px !important;
				text-transform: uppercase;
				letter-spacing: 0.06em;
				font-weight: 600;
				border: 0 !important;
				padding-block: 0.125rem;
				padding-inline: 0.75rem;
			}
			.emdash-sidebar [data-sidebar="group-label"] svg {
				color: rgba(255,255,255,0.3);
			}
			.emdash-sidebar [data-sidebar="group-label"]:hover svg {
				color: rgba(255,255,255,0.6);
			}
			/* Separators */
			.emdash-sidebar [data-sidebar="separator"] {
				border-color: rgba(255,255,255,0.06) !important;
				margin: 0.125rem 0.75rem;
			}
			/* Header/footer borders */
			.emdash-sidebar [data-sidebar="header"] {
				border-bottom: 1px solid rgba(255,255,255,0.08);
			}
			.emdash-sidebar [data-sidebar="footer"] {
				border-top: 1px solid rgba(255,255,255,0.08);
			}

			/* Keep all nav icons visible when sidebar collapses to icon mode */
			.emdash-sidebar[data-state="collapsed"] [data-sidebar="group-content"] {
				grid-template-rows: 1fr !important;
			}
			/* Mobile drawer: kumo's Sheet has no data-state attribute, so group-content
			   stays at grid-rows-[0fr] (hidden). Force it open in the mobile sidebar. */
			.emdash-sidebar[data-mobile="true"] [data-sidebar="group-content"] {
				grid-template-rows: 1fr !important;
			}
			/* Collapsed separators — thin centered line */
			.emdash-sidebar[data-state="collapsed"] [data-sidebar="separator"] {
				margin: 0.125rem 0.625rem;
			}
			/* Collapsed: tighten group spacing */
			.emdash-sidebar[data-state="collapsed"] [data-sidebar="group"] {
				gap: 0.125rem;
			}
			.emdash-sidebar[data-state="collapsed"] [data-sidebar="menu"] {
				gap: 0.125rem;
			}

			/* Collapsed: nav links — center icon, hide text */
			.emdash-sidebar[data-state="collapsed"] .emdash-nav-link {
				justify-content: center;
				padding: 0.5rem 0;
				gap: 0;
				min-height: 36px;
			}
			.emdash-sidebar[data-state="collapsed"] .emdash-nav-label {
				display: none !important;
			}
			/* Collapsed: brand link */
			.emdash-sidebar[data-state="collapsed"] .emdash-brand-link {
				justify-content: center;
				padding-left: 0;
				padding-right: 0;
			}
			.emdash-sidebar[data-state="collapsed"] .emdash-brand-text {
				display: none !important;
			}

			/* Mobile drawer slide animation from left (LTR) */
			[data-starting-style]:has(> .emdash-sidebar[data-mobile="true"]),
			[data-ending-style]:has(> .emdash-sidebar[data-mobile="true"]) {
				transform: translateX(-100%);
			}

			/* Mobile drawer slide animation from right (RTL) */
			[dir="rtl"] [data-starting-style]:has(> .emdash-sidebar[data-mobile="true"]),
			[dir="rtl"] [data-ending-style]:has(> .emdash-sidebar[data-mobile="true"]) {
				transform: translateX(100%);
				--tw-translate-x: 100%;
			}

			/* RTL: Position drawer on right side */
			[dir="rtl"] :has(> .emdash-sidebar[data-mobile="true"]) {
				left: auto;
				right: 0;
			}
		`,
				}}
			/>
			<KumoSidebar className="emdash-sidebar" aria-label={t`Admin navigation`}>
				<KumoSidebar.Header>
					<Link
						to="/"
						className="emdash-brand-link flex w-full min-w-0 items-start gap-2 px-3 py-1"
					>
						<BrandIcon
							logoUrl={manifest.admin?.logo}
							siteName={manifest.admin?.siteName}
							className="size-5 shrink-0"
							aria-hidden="true"
						/>
						<span className="emdash-brand-text flex min-w-0 flex-col leading-tight">
							<span className="truncate font-semibold">AWCMS</span>
							<span className="text-[10px] font-normal text-white/40">
								AWCMS by ahliweb.com & EmDash
							</span>
						</span>
					</Link>
				</KumoSidebar.Header>

				<KumoSidebar.Content>
					{/* Dashboard — standalone */}
					<KumoSidebar.Group>
						<KumoSidebar.Menu>
							<NavMenuLink
								item={{ to: "/", label: t`Dashboard`, icon: SquaresFour }}
								isActive={isItemActive("/", currentPath)}
							/>
						</KumoSidebar.Menu>
					</KumoSidebar.Group>

					{(hasPluginSection || hasContentSection || hasManageSection || hasAdminSection) && (
						<KumoSidebar.Separator />
					)}

					{/* Plugin pages (collapsible, one group per plugin) */}
					{hasPluginSection && (
						<>
							{visiblePluginGroups.map((group) => (
								<React.Fragment key={group.id}>
									<KumoSidebar.Group>
										<details open>
											<summary>
												<KumoSidebar.GroupLabel className="[&>span]:text-start [&_svg]:rtl:-scale-x-100 [&_svg]:rtl:-scale-y-100">
													{group.label}
												</KumoSidebar.GroupLabel>
											</summary>
											<KumoSidebar.Menu>{renderNavItems(group.items)}</KumoSidebar.Menu>
										</details>
									</KumoSidebar.Group>
								</React.Fragment>
							))}
						</>
					)}

					{hasPluginSection && hasContentSection && <KumoSidebar.Separator />}

					{/* Content — collections + media (collapsible) */}
					{hasContentSection && (
						<KumoSidebar.Group>
							<details open>
								<summary>
									<KumoSidebar.GroupLabel className="[&>span]:text-start [&_svg]:rtl:-scale-x-100 [&_svg]:rtl:-scale-y-100">{t`Content`}</KumoSidebar.GroupLabel>
								</summary>
								<KumoSidebar.Menu>
									{renderNavItems(visibleContent.filter((i) => i.to !== "/"))}
								</KumoSidebar.Menu>
							</details>
						</KumoSidebar.Group>
					)}

					{(hasPluginSection || hasContentSection) && hasManageSection && <KumoSidebar.Separator />}

					{/* Manage — comments, menus, taxonomies, etc. (collapsible) */}
					{hasManageSection && (
						<KumoSidebar.Group>
							<details open>
								<summary>
									<KumoSidebar.GroupLabel className="[&>span]:text-start [&_svg]:rtl:-scale-x-100 [&_svg]:rtl:-scale-y-100">{t`Manage`}</KumoSidebar.GroupLabel>
								</summary>
								<KumoSidebar.Menu>{renderNavItems(visibleManage)}</KumoSidebar.Menu>
							</details>
						</KumoSidebar.Group>
					)}

					{(hasPluginSection || hasContentSection || hasManageSection) && hasAdminSection && (
						<KumoSidebar.Separator />
					)}

					{/* Admin — content types, users, plugins, import (collapsible) */}
					{hasAdminSection && (
						<KumoSidebar.Group>
							<details open>
								<summary>
									<KumoSidebar.GroupLabel className="[&>span]:text-start [&_svg]:rtl:-scale-x-100 [&_svg]:rtl:-scale-y-100">{t`Admin`}</KumoSidebar.GroupLabel>
								</summary>
								<KumoSidebar.Menu>{renderNavItems(visibleAdmin)}</KumoSidebar.Menu>
							</details>
						</KumoSidebar.Group>
					)}
				</KumoSidebar.Content>

				<KumoSidebar.Footer>
					<div className="emdash-nav-label px-3 py-2 text-[11px] leading-tight text-white/30">
						<p>{footerLabels.awcms}</p>
						<p>{footerLabels.emdash}</p>
					</div>
				</KumoSidebar.Footer>
			</KumoSidebar>
		</>
	);
}

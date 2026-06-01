import { AWCMS_SIKESRA_PLUGIN_ID } from "../runtime.js";

export const SIKESRA_ADMIN_ROUTE_BASE = `/_emdash/admin/plugins/${AWCMS_SIKESRA_PLUGIN_ID}`;

export function toSikesraAdminHref(path: string) {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${SIKESRA_ADMIN_ROUTE_BASE}${normalizedPath}`;
}

export function isSikesraAdminHref(href: string) {
	return href.startsWith(`${SIKESRA_ADMIN_ROUTE_BASE}/`);
}

export const SIKESRA_OPERATOR_WORKFLOW_STEPS = [
	"Configure",
	"Input or Import",
	"Validate",
	"Verify",
	"Publish Aggregate",
	"Report or Export",
	"Audit or Govern",
] as const;

export const SIKESRA_PAGE_ANATOMY = [
	"Page header",
	"Purpose description",
	"Primary action area",
	"Filters or search",
	"Status summary",
	"Main content table, card, or form",
	"Context panel or detail drawer",
	"Audit or status footer",
	"Empty, loading, and error states",
] as const;

export const SIKESRA_STATUS_BADGES = [
	"Draft",
	"Needs Review",
	"Pending Desa",
	"Pending Kecamatan",
	"Pending SOPD",
	"Pending Kabupaten",
	"Verified",
	"Rejected",
	"Needs Revision",
	"Archived",
	"Suppressed",
	"Public Safe",
	"Sensitive",
	"Restricted",
	"Orphaned User",
] as const;

export const SIKESRA_STANDARD_EMPTY_STATES = [
	"No records yet",
	"No pending verification",
	"No documents uploaded",
	"No import batch",
	"No audit event",
	"No user assignment",
	"No ABAC policy",
] as const;

export type SikesraStatusTone = "neutral" | "info" | "success" | "warning" | "danger" | "restricted";

export const SIKESRA_STATUS_BADGE_TONES: Record<(typeof SIKESRA_STATUS_BADGES)[number], SikesraStatusTone> = {
	Draft: "neutral",
	"Needs Review": "warning",
	"Pending Desa": "info",
	"Pending Kecamatan": "info",
	"Pending SOPD": "info",
	"Pending Kabupaten": "info",
	Verified: "success",
	Rejected: "danger",
	"Needs Revision": "warning",
	Archived: "neutral",
	Suppressed: "warning",
	"Public Safe": "success",
	Sensitive: "danger",
	Restricted: "restricted",
	"Orphaned User": "warning",
};

export function getSikesraStatusTone(label: string): SikesraStatusTone {
	return SIKESRA_STATUS_BADGE_TONES[label as (typeof SIKESRA_STATUS_BADGES)[number]] ?? "neutral";
}

export interface SikesraMaskedValueState {
	displayValue: string;
	masked: boolean;
	revealAllowed: boolean;
	reason: string;
}

export function createSikesraMaskedValueState(
	value: unknown,
	options: { sensitive?: boolean; revealAllowed?: boolean; maskLabel?: string } = {},
): SikesraMaskedValueState {
	const sensitive = options.sensitive === true;
	const revealAllowed = options.revealAllowed === true;
	if (sensitive && !revealAllowed) {
		return {
			displayValue: options.maskLabel ?? "[REDACTED]",
			masked: true,
			revealAllowed: false,
			reason: "Sensitive value is masked until reveal permission is granted.",
		};
	}
	return {
		displayValue: value == null ? "" : String(value),
		masked: false,
		revealAllowed,
		reason: sensitive ? "Reveal permission granted." : "Value is public-safe for this surface.",
	};
}

export interface SikesraEmptyStateModel {
	title: string;
	description: string;
	recommendedAction?: string;
	permissionRequired?: string;
}

export function createSikesraEmptyState(
	title: (typeof SIKESRA_STANDARD_EMPTY_STATES)[number],
	description: string,
	options: Pick<SikesraEmptyStateModel, "recommendedAction" | "permissionRequired"> = {},
): SikesraEmptyStateModel {
	return { title, description, ...options };
}

export type SikesraPageState = "loading" | "empty" | "ready" | "permission_denied" | "error";

export function getSikesraPageState(input: {
	loading?: boolean;
	error?: unknown;
	permissionDenied?: boolean;
	itemCount?: number;
}): SikesraPageState {
	if (input.loading) return "loading";
	if (input.permissionDenied) return "permission_denied";
	if (input.error) return "error";
	if ((input.itemCount ?? 0) === 0) return "empty";
	return "ready";
}

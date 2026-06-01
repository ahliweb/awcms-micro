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

/**
 * `site_search` permission catalog constants (Issue #270, ADR-0031 §6) — the
 * module key + activity codes the admin API guards on and the sql/088 permission
 * seed declares. Kept in `domain/` (pure, no imports) so both the route handlers
 * and the `module.ts` descriptor reference the same literals.
 */
export const SITE_SEARCH_MODULE_KEY = "site_search";

/** Activity for index status/rebuild/reconcile operations. */
export const SITE_SEARCH_INDEX_ACTIVITY_CODE = "index";

/** Activity for per-tenant search configuration. */
export const SITE_SEARCH_SETTINGS_ACTIVITY_CODE = "settings";

/** Activity for failed-item diagnostics. */
export const SITE_SEARCH_DIAGNOSTICS_ACTIVITY_CODE = "diagnostics";

/**
 * `seo_distribution` permission constants (Issue #266, ADR-0028 §9). Mirrors
 * the seeded rows in `sql/081` exactly — the module's `permissions` descriptor
 * and every route guard reference these constants rather than re-typing the
 * literal strings, so a rename can never drift one copy from another (same
 * convention `media-permissions.ts` / `news-media-permissions.ts` use).
 *
 * Only `config.{read,update}` exist in #266. `redirects.*` (#268) and
 * `sitemap.read` (#267) land with their own endpoints/tables — not seeded ahead
 * of a route that can exercise them.
 */
export const SEO_MODULE_KEY = "seo_distribution";

export const SEO_CONFIG_ACTIVITY_CODE = "config";

export type SeoConfigAction = "read" | "update";

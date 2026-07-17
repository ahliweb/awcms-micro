import { defineModule } from "../_shared/module-contract";

/**
 * ADR-0026 step 1 of 5 — the DECLARED owner of the tenant media registry.
 *
 * This module is deliberately registered BEFORE its code moves in. The registry
 * it will own (`awcms_micro_news_media_objects`, `sql/041`/`042`/`046`) already
 * exists and is already generic — it carries `module_key text NOT NULL DEFAULT
 * 'news_portal'` precisely because it was designed to serve more than one module
 * — but it currently lives inside `news_portal`, which means a tenant running a
 * brochure site (`blog_content` + `tenant_domain`, no news portal) has no managed
 * media at all. ADR-0026 §Konteks has the evidence; §Konsekuensi has the staged
 * plan this file is step 1 of.
 *
 * `status: "experimental"` is the honest signal while that holds: the module is
 * the agreed owner, but it owns nothing yet, so no tenant should depend on it.
 * The precedent is this lineage's own `idn_admin_regions` (upstream Issue #655),
 * registered `experimental` with no schema/API/UI while its epic landed — see
 * ADR-0013 §1's closing note. It flips to `active` at step 4, when media works
 * without `news_portal`.
 *
 * Nothing is declared below beyond identity and dependencies. `api`,
 * `permissions`, `navigation`, `capabilities`, `jobs`, `settings`, and `health`
 * stay undeclared until the code that backs each one actually moves here —
 * declaring them now would be exactly the "document ahead of the code" drift
 * ADR-0025 §5 makes binding, and `bun run modules:compose:check` would be
 * asserting bindings nothing implements.
 *
 * `dependencies` deliberately excludes `news_portal` and `blog_content`: ADR-0026
 * §2 INVERTS the ownership direction, so media must never depend on the modules
 * that consume it (ADR-0013 §1 — a System Foundation module depending on a
 * domain module is the violation this whole extraction removes).
 */
export const mediaLibraryModule = defineModule({
  key: "media_library",
  name: "Media Library",
  version: "0.1.0",
  status: "experimental",
  description:
    "Tenant-scoped media object registry and upload flow for every website module (ADR-0026, System Foundation). Declared owner of `awcms_micro_news_media_objects` — the generic media registry (`module_key` discriminator, `owner_resource_type`/`owner_resource_id` references, presigned direct-to-storage upload, orphan lifecycle, storage reconciliation) that currently still lives in `news_portal` and moves here at ADR-0026 step 2. Registered `experimental` because it owns no code yet: media today is reachable only when `news_portal` is enabled and R2-only mode is on, which is the product gap ADR-0026 exists to close — uploading a logo must not require switching on a news portal. Once extracted, `news_portal`, `blog_content`, and `social_publishing` consume it through a `media_library` capability port superseding `news_media`, and `news_portal` keeps only what is genuinely its own (R2-only editorial policy, preset readiness gate, homepage sections, ad placements). Deliberately NOT a CDN, image proxy, or DAM; byte processing never runs inside a DB transaction (ADR-0006).",
  dependencies: ["tenant_admin", "identity_access"],
  type: "system"
});

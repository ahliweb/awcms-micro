/**
 * Global capability contract version registry (Issue #741, epic #738
 * `platform-evolution`, Wave 1, ADR-0015).
 *
 * `ModuleCapabilityContract.provides`/`.consumes` (`module-contract.ts`,
 * Issue #681/ADR-0011) name capabilities as plain strings with NO version
 * — sufficient for the in-monolith ports-and-adapters pattern ADR-0011
 * defines, where a source-boundary test
 * (`tests/unit/module-boundary.test.ts`) is enough to keep provider and
 * consumer in sync, because both sides always ship in the same build. A
 * derived repository's compatibility manifest (ADR-0015) needs something
 * ADR-0011 deliberately doesn't: a way to declare "I was written against
 * version X of capability Y" and have that checked against a NEWER base
 * release that might have changed the port's shape — the two sides no
 * longer ship in the same build once a derived repository vendors an
 * older base checkout.
 *
 * This is a FIFTH independent versioning scheme (see `module-
 * contract.ts`'s own `MODULE_CONTRACT_VERSION` doc comment for the first
 * four: package release, REST contract, event contract, module descriptor
 * contract — all ADR-0008/#741 precedent) — one SemVer per capability
 * KEY, bumped only when that capability's own port interface
 * (`_shared/ports/*.ts`) shape changes:
 *
 * - **MAJOR** — the port interface's method signature changes in a
 *   breaking way (parameter removed/retyped, return shape changed).
 * - **MINOR** — a new optional method/field is added to the port
 *   interface, backward-compatible for existing adapters.
 * - **PATCH** — documentation-only clarification.
 *
 * Every capability a BASE module `provides` today is listed here at
 * `1.0.0` — a first declaration (same "not a stability milestone, just
 * the first assigned number" framing `MODULE_CONTRACT_VERSION` documents
 * for itself), not a claim these ports have reached some maturity bar.
 * Adding a new base capability: add one entry here in the SAME PR that
 * adds the `provides` string to the owning module's `module.ts` — this
 * registry is intentionally a flat, hand-maintained map (mirrors
 * `ALLOWED_PUBLIC_OPERATIONS`/`ROUTE_PARITY_EXEMPTIONS` in
 * `scripts/api-spec-check.ts`: one reviewed list everyone sees in the
 * diff, not an implicit convention).
 *
 * A derived repository's OWN capabilities (things it `provides` from its
 * own contributed modules, e.g. the fixture's `example_crm_directory`)
 * are NOT expected to appear here — this registry only versions
 * capabilities the BASE repository provides. A derived repository's
 * compatibility manifest declares versions for its OWN capabilities
 * directly (self-consistency, checked against the manifest's own
 * `capabilities.provides` list) — see
 * `src/modules/module-management/domain/extension-compatibility.ts`.
 */
export const CAPABILITY_CONTRACT_VERSIONS: Readonly<Record<string, string>> =
  Object.freeze({
    // media_library provides — consumed by blog_content, news_portal, and
    // social_publishing (ADR-0011).
    //
    // Replaces `news_media: "1.0.0"` (ADR-0026 steps 3-4), which `news_portal`
    // provided only because the media registry was born inside it. This is a NEW
    // key rather than a MAJOR bump of the old one: the provider changed, and the
    // contract dropped `isFullOnlineR2ModeActiveForTenant` in favour of a
    // question media can answer without a news portal. A derived repository
    // pinned to `news_media` should fail to resolve the capability outright
    // rather than silently bind to a port that no longer asks what it asked —
    // which is exactly what an unknown key does here.
    media_library: "1.0.0",
    // blog_content provides — consumed by news_portal (ADR-0011) and
    // social_publishing.
    public_content: "1.0.0",
    // blog_content provides (Issue #266, ADR-0028 §3) — the `seo_facts`
    // contribution contract (`_shared/ports/seo-facts-port.ts`) consumed by
    // `seo_distribution` (optional). Registered in the SAME PR that added
    // `provides: ["seo_facts"]` to `blog_content`'s module.ts (ADR-0015 rule).
    // Single provider by design: `blog_content` owns the public content
    // resources SEO renders — a second provider would be a
    // `capability_provider_conflict` (module-composition.ts). The port existed
    // as a type since #265 (ADR-0028 admission) with no version entry — the
    // `legal-hold-guard-port.ts` "type ahead of wiring" precedent — and gets its
    // version here now that a real provider declares it.
    //
    // 1.1.0 (Issue #267, sitemap/robots/feeds) — MINOR: three backward-compatible
    // additions to `SeoFactsSource` for bounded public discovery/syndication (the
    // documented "new optional method/field = MINOR" rule above). A 1.0.0 provider
    // stays valid: (1) an OPTIONAL `summarizePublicResourceFacts` method (cheap
    // count/max roll-up for the sitemap index size + ETag/Last-Modified cache
    // validators); (2) an OPTIONAL `order: "id_asc" | "published_desc"` on
    // `listPublicResourceFacts` (feeds need newest-first); (3) an OPTIONAL
    // `offset` for deterministic child-sitemap paging. No existing method
    // signature changed, so consumers pinned to 1.0.0 keep working.
    seo_facts: "1.1.0",
    // social_publishing provides — consumed by blog_content (optional).
    social_publishing: "1.0.0",
    // profile_identity provides (Issue #748, epic #738 platform-evolution
    // Wave 2) — no in-repo consumer yet, same "port defined ahead of
    // consumer wiring" precedent as `legal-hold-guard-port.ts`.
    party_directory: "1.0.0"
  });

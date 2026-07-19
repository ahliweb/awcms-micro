/**
 * `SeoFactsSource` (ADR-0028 — `seo_distribution` admission) — the capability
 * a content module (`blog_content`, `news_portal`, a derived application's own
 * content type, ...) PROVIDES and `seo_distribution` CONSUMES: read-only,
 * server-derived "SEO facts" for one public resource, so the SEO renderer
 * (#266), sitemap/feed generator (#267), and redirect resolver (#268) can
 * compose canonical URLs, metadata, structured data, sitemap/feed entries, and
 * redirects WITHOUT importing any content module's internals or writing to any
 * shared table.
 *
 * ## Why this file exists before any `seo_distribution` runtime code
 *
 * ADR-0028 is admission-only: it admits `seo_distribution` and freezes the
 * contribution contract, but registers NO module descriptor and ships NO
 * runtime rendering (that is #266-#268, which merge only after ADR-0028 is
 * Accepted). This file is the CONTRACT half of that admission — a neutral-ground
 * TYPE definition plus the pure invariants every future implementation must
 * satisfy. It imports NOTHING from any module (same rule as every other port
 * here), so a content module depends on the TYPE without depending on an
 * implementation, and vice versa.
 *
 * Precedent for "port defined ahead of consumer/provider wiring": this file is
 * deliberately NOT yet listed in `capability-contract-versions.ts` and NO
 * `module.ts` yet declares `provides: ["seo_facts"]` / `consumes` it — exactly
 * like `legal-hold-guard-port.ts` and `party-directory-port.ts`. The
 * `CAPABILITY_CONTRACT_VERSIONS["seo_facts"] = "1.0.0"` entry pairs with the
 * first provider's `provides` string and lands in #266 (ADR-0015 rule).
 *
 * ## Direction of the arrow (ADR-0028 §2)
 *
 * Content modules are PROVIDERS; `seo_distribution` is the CONSUMER/aggregator.
 * The arrow points inward on purpose: if `seo_distribution` consumed each
 * content module's own port instead, the aggregator would drag a dependency to
 * every content module and know which ones exist. Inverting it — content
 * modules contribute `seo_facts`, SEO discovers them at the composition root —
 * keeps `seo_distribution` ignorant of any specific content module and content
 * modules ignorant of SEO internals. This is a `capabilities.consumes`
 * relationship (source-level, optional, degrades safely), NEVER a lifecycle
 * `dependencies` edge, so it does not constrain the DAG (`module-boundary`
 * precedent: `blog_content` ↔ `news_portal`).
 *
 * ## What every value here guarantees (server-derived, not tenant-authored)
 *
 * All facts are DERIVED by the provider from already-validated tenant data,
 * never raw strings a tenant pasted. Two structural choices enforce the
 * ADR-0028 threat model at the type level rather than by convention:
 *
 * - **Paths, not hosts.** `canonicalPath` and `SeoLocaleAlternate.path` are
 *   PATHS relative to the tenant's primary domain. The host is derived by
 *   `seo_distribution` from `tenant_domain` (ADR-0010), so a provider cannot
 *   inject a host — the host-header-poisoning defense is that providers never
 *   name a host at all.
 * - **Media ids, not image URLs.** `openGraph.imageMediaId` is a media object
 *   id resolved later through `MediaLibraryPort` (same-tenant, verified), never
 *   a raw URL a tenant could point cross-tenant/off-origin.
 */

/**
 * Publication state of a resource — the provider's authoritative answer,
 * re-evaluated at resolve time (never cached from a curation list). `noindex`
 * is orthogonal (a `published` page can still be `noindex`) and lives on
 * `SeoVisibility` separately.
 */
export type SeoPublicationState =
  | "published"
  | "draft"
  | "scheduled"
  | "archived"
  | "deleted"
  | "private"
  | "unpublished";

export type SeoVisibility = {
  state: SeoPublicationState;
  /** `true` → the page may still render, but with `robots: noindex` and never in a sitemap/feed. */
  noindex: boolean;
  /** ISO-8601. When `state === "scheduled"`, the resource is not public until this instant. `null` otherwise. */
  scheduledPublishAt: string | null;
};

export type SeoRobotsDirective =
  "index,follow" | "index,nofollow" | "noindex,follow" | "noindex,nofollow";

export type SeoMetadata = {
  title: string;
  description: string | null;
  robots: SeoRobotsDirective;
};

export type SeoLocaleAlternate = {
  /** BCP-47 locale tag, or `"x-default"`. */
  locale: string;
  /** Path relative to the tenant's primary domain — host is derived by `seo_distribution`, never carried here. */
  path: string;
};

export type SeoOpenGraph = {
  title: string;
  description: string | null;
  /** Media object id resolved through `MediaLibraryPort` (same-tenant, verified) — never a raw URL. `null` when the resource has no social image. */
  imageMediaId: string | null;
  /** Open Graph object type, e.g. `"article"` / `"website"`. */
  type: string;
};

/** Present (non-`null`) only for resources that belong in a sitemap — i.e. publicly indexable ones. */
export type SeoSitemapEntry = {
  /** ISO-8601 `<lastmod>`; `null` when unknown. */
  lastmod: string | null;
  changefreq?:
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** 0.0–1.0. */
  priority?: number;
};

/** Present (non-`null`) only for resources that are feed items. */
export type SeoFeedEntry = {
  publishedAt: string;
  updatedAt: string | null;
};

/** The controlled schema.org `@type` set — JSON-LD injection is blocked by this union, not by ad-hoc sanitization. */
export type JsonLdType =
  | "Article"
  | "NewsArticle"
  | "BlogPosting"
  | "WebPage"
  | "WebSite"
  | "BreadcrumbList"
  | "Organization"
  | "ImageObject"
  | "Person";

export type JsonLdScalar = string | number | boolean;

export type JsonLdValue = JsonLdScalar | JsonLdNode | readonly JsonLdValue[];

export type JsonLdNode = {
  readonly "@type": JsonLdType;
  readonly [key: string]: JsonLdValue;
};

/**
 * Everything `seo_distribution` needs about ONE public resource of ONE tenant,
 * derived by the owning content module. The base article/page and any derived
 * content type flow through this identical shape — `resourceType` is an opaque
 * string (same generic pattern as `media_library`'s `owner_resource_type`), so
 * `seo_distribution` never knows any specific content type.
 */
export type SeoResourceFacts = {
  /** Opaque content-type discriminator, e.g. `"blog_post"`, `"blog_page"`, a derived app's `"product"`. Never interpreted by `seo_distribution`. */
  resourceType: string;
  resourceId: string;
  visibility: SeoVisibility;
  /** Canonical path relative to the tenant's primary domain (leading `/`). */
  canonicalPath: string;
  localeAlternates: readonly SeoLocaleAlternate[];
  metadata: SeoMetadata;
  openGraph: SeoOpenGraph;
  jsonLd: readonly JsonLdNode[];
  /** `null` when this resource must NOT appear in a sitemap (draft/private/deleted/scheduled/noindex/...). */
  sitemap: SeoSitemapEntry | null;
  /** `null` when this resource is not a feed item. */
  feed: SeoFeedEntry | null;
};

export type ListPublicResourceFactsOptions = {
  /** Keyset pagination cursor from a previous page; `undefined`/`null` for the first page. */
  cursor?: string | null;
  pageSize?: number;
  /** When set, the provider returns only facts for this locale's public resources. */
  locale?: string;
};

export type SeoResourceFactsPage = {
  items: readonly SeoResourceFacts[];
  nextCursor: string | null;
};

/**
 * The port itself. A content module implements it as
 * `<module>/application/seo-facts-port-adapter.ts` (lands in #266); the SEO
 * renderer/sitemap/feed generator imports that adapter at the composition root
 * and injects it as a plain function parameter — never a direct cross-module
 * import inside `application`/`domain`.
 */
export type SeoFactsSource = {
  /** Enumerate this tenant's public, sitemap/feed-eligible resources, keyset-paginated. Excludes every non-public resource by construction (ADR-0028 §6). */
  listPublicResourceFacts(
    tx: Bun.SQL,
    tenantId: string,
    options?: ListPublicResourceFactsOptions
  ): Promise<SeoResourceFactsPage>;

  /** Resolve one resource's facts for metadata rendering; `null` when the id does not exist for this tenant. Visibility is carried in the result (a `noindex`/`private` resource still resolves, so the caller can render `robots`/deny correctly) — the caller, not the provider, decides what to emit per ADR-0028 §6. */
  resolveResourceFacts(
    tx: Bun.SQL,
    tenantId: string,
    resourceType: string,
    resourceId: string
  ): Promise<SeoResourceFacts | null>;
};

// ---------------------------------------------------------------------------
// Contract invariants (pure). These are the CONTRACT's teeth, not the runtime
// renderer: #266-#268 inherit them as compile/asserted guarantees instead of
// re-deriving (and possibly weakening) them. None of these render a page,
// generate a sitemap, or touch a table.
// ---------------------------------------------------------------------------

export type SeoCacheKeyParts = {
  tenantId: string;
  /** The resolved primary host for this tenant (server-derived from `tenant_domain`), never the raw request `Host`. */
  host: string;
  locale: string;
  resourceType: string;
  resourceId: string;
  /** Contract version so a shape change invalidates every cached entry. */
  contractVersion: string;
};

/**
 * Compose the cache key for one rendered SEO contract. The three isolation
 * components — `tenantId`, `host`, `locale` — are MANDATORY: a missing/empty
 * one throws, so no implementation can accidentally build a key that lets one
 * tenant's output serve another (ADR-0028 §7, the cache-poisoning /
 * cross-tenant defense). Because `tenantId` is always part of the key, cross-
 * tenant cache confusion is structurally impossible.
 */
export function buildSeoCacheKey(parts: SeoCacheKeyParts): string {
  const required: readonly (keyof SeoCacheKeyParts)[] = [
    "tenantId",
    "host",
    "locale",
    "resourceType",
    "resourceId",
    "contractVersion"
  ];
  for (const field of required) {
    const value = parts[field];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `buildSeoCacheKey: "${field}" is required and must be a non-empty string — the SEO cache key must include tenant/host/locale so one tenant's output can never serve another (ADR-0028 §7).`
      );
    }
  }
  // Order is fixed and tenant-first; EVERY component (including
  // `contractVersion`) is percent-encoded so a value containing the `:`
  // separator cannot shift a component and forge a different key (uniform
  // injectivity).
  return [
    "seo",
    encodeURIComponent(parts.contractVersion),
    encodeURIComponent(parts.tenantId),
    encodeURIComponent(parts.host.toLowerCase()),
    encodeURIComponent(parts.locale),
    encodeURIComponent(parts.resourceType),
    encodeURIComponent(parts.resourceId)
  ].join(":");
}

/**
 * `true` when a resource may be SERVED as a public page (renders). A `noindex`
 * page is still resolvable (it renders with `robots: noindex`) — that is why
 * `noindex` does not fail this check.
 */
export function isPubliclyResolvable(
  visibility: SeoVisibility,
  nowIso: string
): boolean {
  switch (visibility.state) {
    case "draft":
    case "deleted":
    case "private":
    case "unpublished":
    case "archived":
      return false;
    case "scheduled":
      return (
        visibility.scheduledPublishAt !== null &&
        Date.parse(visibility.scheduledPublishAt) <= Date.parse(nowIso)
      );
    case "published":
      return true;
    default:
      // Fail-closed: any state outside the union (e.g. a value cast past the
      // type system) is treated as not public.
      return false;
  }
}

/**
 * `true` when a resource belongs in public discovery surfaces (sitemap, feeds,
 * `index` robots directive). Strictly stronger than `isPubliclyResolvable`: it
 * additionally requires NOT `noindex`. This single predicate is the
 * unpublished-content-leakage defense (ADR-0028 §6) — nothing that is not
 * publicly resolvable, and nothing marked `noindex`, ever reaches a sitemap or
 * feed.
 */
export function isPubliclyIndexable(
  visibility: SeoVisibility,
  nowIso: string
): boolean {
  return !visibility.noindex && isPubliclyResolvable(visibility, nowIso);
}

export type RedirectTargetClass =
  "same_tenant_internal" | "cross_host_external" | "invalid";

/**
 * Classify a redirect target relative to the tenant's own registered hosts.
 * Only `same_tenant_internal` targets are safe to emit (ADR-0028 §8, the open-
 * redirect / cross-tenant defense):
 *
 * - a same-origin RELATIVE path (`/x/y`) → `same_tenant_internal`;
 * - an ABSOLUTE `http(s)` URL whose host is one of the tenant's registered
 *   hosts → `same_tenant_internal`;
 * - an absolute `http(s)` URL to any other host → `cross_host_external`;
 * - anything else — protocol-relative `//evil.com`, backslash tricks
 *   (`/\evil.com`), embedded control characters (`/\t/evil.com`), non-http(s)
 *   schemes (`javascript:`, `data:`, `mailto:`), or unparseable input →
 *   `invalid`.
 *
 * The relative branch NEVER trusts the leading `/` alone: it re-parses the
 * target against a synthetic unresolvable base and confirms the resolved origin
 * did not escape it. Combined with the C0/DEL rejection below, this closes the
 * `"/\t/evil.com"` class of bypass (the WHATWG URL parser and browsers strip
 * TAB/LF/CR, so such a target would otherwise resolve to `//evil.com` →
 * `https://evil.com/` while looking like a same-origin path).
 */
export function classifyRedirectTarget(
  target: string,
  allowedHosts: readonly string[]
): RedirectTargetClass {
  if (typeof target !== "string" || target.trim() === "") return "invalid";

  // Reject C0 control characters (U+0000–U+001F) and DEL (U+007F). Browsers and
  // the WHATWG URL parser STRIP tab (U+0009), newline (U+000A), and carriage
  // return (U+000D) from a URL before parsing, so "/\t/evil.com" collapses to
  // "//evil.com" and would slip past a naive `startsWith("/")` relative-path
  // check as `same_tenant_internal` (a verified open-redirect bypass). Rejecting
  // the whole C0+DEL range is stricter than strictly necessary — a bare space or
  // NUL would otherwise be percent-encoded and stay same-origin — but never
  // unsafe (ADR-0028 §8).
  if (/[\u0000-\u001f\u007f]/.test(target)) return "invalid";

  // Protocol-relative (`//host`) and backslash-normalized variants (`/\host`,
  // `\/host`) are browser-interpreted as absolute cross-origin — reject before
  // the relative branch.
  const firstTwo = target.slice(0, 2);
  if (firstTwo === "//" || firstTwo === "/\\" || firstTwo === "\\/") {
    return "invalid";
  }

  // Synthetic base on an RFC-6761 `.invalid` host that can never resolve: a
  // genuine same-origin relative path resolves back to THIS origin; anything
  // that escaped to another origin does not.
  const syntheticBase = "https://seo-distribution.invalid";

  if (target.startsWith("/")) {
    // Path-absolute relative reference — normalize and confirm it did not
    // escape the synthetic origin. Never trust the `/` prefix on its own.
    let resolved: URL;
    try {
      resolved = new URL(target, syntheticBase);
    } catch {
      return "invalid";
    }
    return resolved.origin === syntheticBase
      ? "same_tenant_internal"
      : "invalid";
  }

  // Absolute reference (or unparseable).
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return "invalid";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return "invalid";

  const allowed = new Set(allowedHosts.map((h) => h.toLowerCase()));
  return allowed.has(url.hostname.toLowerCase())
    ? "same_tenant_internal"
    : "cross_host_external";
}

/** Throws unless `target` classifies as `same_tenant_internal` — the enforced form of `classifyRedirectTarget`. */
export function assertSafeRedirectTarget(
  target: string,
  allowedHosts: readonly string[]
): void {
  const cls = classifyRedirectTarget(target, allowedHosts);
  if (cls !== "same_tenant_internal") {
    throw new Error(
      `assertSafeRedirectTarget: redirect target ${JSON.stringify(
        target
      )} is "${cls}", not same-tenant-internal — SEO redirects must never open-redirect or cross tenants (ADR-0028 §8).`
    );
  }
}

export const JSON_LD_ALLOWED_TYPES: ReadonlySet<JsonLdType> =
  new Set<JsonLdType>([
    "Article",
    "NewsArticle",
    "BlogPosting",
    "WebPage",
    "WebSite",
    "BreadcrumbList",
    "Organization",
    "ImageObject",
    "Person"
  ]);

/**
 * Escape a text value for safe embedding inside a
 * `<script type="application/ld+json">` block. Escapes `<`, `>`, `&` (and the
 * line/paragraph separators JSON leaves raw) to their `\uXXXX` forms so a value
 * can never terminate the script element or open a new tag. The controlled
 * `JsonLdType` union already blocks structural injection; this handles the
 * remaining string-content vector (ADR-0028 threat model, JSON-LD injection).
 */
export function escapeJsonLdText(value: string): string {
  return value
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Object keys allowed in a controlled JSON-LD node. Deliberately narrow: a
 * key like `</script><script>` can break out of a `<script>` block exactly as a
 * value can, so keys must be plain schema.org term names / `@`-keywords. If a
 * future `@context` compact-IRI style key is ever needed, extend this pattern
 * consciously rather than loosening it silently.
 */
const JSON_LD_KEY_PATTERN = /^[A-Za-z@][A-Za-z0-9_@]*$/;

/**
 * Assert a JSON-LD node is built from the controlled schema only: every
 * `@type` (recursively) is in `JSON_LD_ALLOWED_TYPES`, every object KEY matches
 * `JSON_LD_KEY_PATTERN`, and no string value contains a raw `</script`
 * sequence. Throws on the first violation.
 *
 * This validates STRUCTURE (types + keys). It is NOT sufficient on its own to
 * emit safe markup — use `renderControlledJsonLd` for that, which validates
 * here AND escapes the serialized output so both keys and values are neutralized
 * by construction (a caller cannot forget to escape).
 */
export function assertControlledJsonLd(node: JsonLdNode): void {
  const visit = (value: JsonLdValue, path: string): void => {
    if (typeof value === "string") {
      if (/<\/script/i.test(value)) {
        throw new Error(
          `assertControlledJsonLd: string at ${path} contains a raw "</script" sequence — JSON-LD values must be escaped/controlled (ADR-0028 threat model).`
        );
      }
      return;
    }
    if (typeof value === "number" || typeof value === "boolean") return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }
    // Object node.
    const objectNode = value as JsonLdNode;
    const type = objectNode["@type"];
    if (!JSON_LD_ALLOWED_TYPES.has(type)) {
      throw new Error(
        `assertControlledJsonLd: "@type" ${JSON.stringify(
          type
        )} at ${path} is not in the controlled schema set (ADR-0028 threat model, JSON-LD injection).`
      );
    }
    for (const [key, child] of Object.entries(objectNode)) {
      if (!JSON_LD_KEY_PATTERN.test(key)) {
        throw new Error(
          `assertControlledJsonLd: object key ${JSON.stringify(
            key
          )} at ${path} is not a controlled JSON-LD key — a key can break out of a <script> block just like a value can (ADR-0028 threat model, JSON-LD injection).`
        );
      }
      visit(child, `${path}.${key}`);
    }
  };
  visit(node, "$");
}

/**
 * Render a JSON-LD node to the exact string safe to place inside a
 * `<script type="application/ld+json">` block — the SINGLE guard #266 should
 * use, so escaping can never be forgotten:
 *
 * 1. `assertControlledJsonLd` validates every `@type` and every object key
 *    against the closed schema;
 * 2. `JSON.stringify` serializes;
 * 3. `escapeJsonLdText` neutralizes `<`, `>`, `&`, U+2028, U+2029 across the
 *    WHOLE serialized string — so KEYS and VALUES are both covered (a `\uXXXX`
 *    escape inside a JSON string round-trips to the original character for a
 *    JSON-LD parser, but can never terminate the script element).
 *
 * The output is guaranteed to contain no raw `<`, `>`, or `&`.
 */
export function renderControlledJsonLd(node: JsonLdNode): string {
  assertControlledJsonLd(node);
  return escapeJsonLdText(JSON.stringify(node));
}

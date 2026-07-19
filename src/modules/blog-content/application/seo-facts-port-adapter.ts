/**
 * `blog_content`'s `SeoFactsSource` adapter (Issue #266, ADR-0028 §3) — the
 * PROVIDER half of the frozen `seo_facts` contribution contract. It turns a blog
 * post row into the neutral `SeoResourceFacts` the `seo_distribution` renderer
 * (#266) and, later, the sitemap/feed generator (#267) consume — WITHOUT either
 * side importing the other's internals.
 *
 * `blog_content` is the natural (and, per `module-composition.ts`'s
 * one-provider-per-capability rule, the single declared) `seo_facts` provider in
 * the base: it OWNS the public content resources SEO renders — the `/news` and
 * `/blog/{tenantCode}` routes are both this module's code. `news_portal`
 * composes these posts into a homepage but owns no standalone public content
 * resource of its own, so it is not a second provider (which would be a
 * `capability_provider_conflict`).
 *
 * This file imports ONLY the neutral port TYPE (`_shared/ports/seo-facts-port`)
 * and queries this module's own `awcms_micro_blog_posts` table — it never
 * imports `seo_distribution`, and `seo_distribution` never imports it (the route
 * composition root injects this adapter as a plain parameter). Facts carry PATHS
 * (not hosts — the host is server-derived by `seo_distribution` from
 * `tenant_domain`) and MEDIA IDS (not URLs — resolved through `MediaLibraryPort`
 * same-tenant), the structural host-header-poisoning / cross-tenant defenses.
 *
 * ## Visibility is re-derived from the row at resolve time (ADR-0028 §6)
 *
 * `resolveResourceFacts` fetches a post in ANY state and maps its
 * `status`/`visibility`/`deleted_at`/`published_at` to a `SeoVisibility` the
 * port's guards interpret — a future-dated `published` post is reported as
 * `scheduled` (so `isPubliclyResolvable` keeps it private until its time), an
 * `unlisted` post as `published` + `noindex`, a `private`/`draft`/`archived`/
 * soft-deleted post as its non-public state. The caller (renderer) then decides
 * what to emit; this adapter never pre-filters visibility away, exactly as the
 * port contract requires.
 */
import type {
  JsonLdNode,
  ListPublicResourceFactsOptions,
  SeoFactsSource,
  SeoResourceFacts,
  SeoResourceFactsPage,
  SeoRobotsDirective,
  SeoVisibility
} from "../../_shared/ports/seo-facts-port";
import type { BlogContentVisibility } from "../domain/post-status";

/** The single resource type this adapter produces — opaque to `seo_distribution`. */
export const BLOG_POST_SEO_RESOURCE_TYPE = "blog_post";

const DEFAULT_PUBLIC_BASE_PATH = "/news";
const DEFAULT_LIST_PAGE_SIZE = 50;
const MAX_LIST_PAGE_SIZE = 200;

type BlogPostSeoRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  seo_title: string | null;
  meta_description: string | null;
  locale: string;
  status: string;
  visibility: BlogContentVisibility;
  featured_media_id: string | null;
  seo_image_media_id: string | null;
  published_at: Date | null;
  scheduled_at: Date | null;
  updated_at: Date;
  deleted_at: Date | null;
};

const SEO_ROW_COLUMNS =
  "id, title, slug, excerpt, seo_title, meta_description, locale, status, " +
  "visibility, featured_media_id, seo_image_media_id, published_at, " +
  "scheduled_at, updated_at, deleted_at";

/**
 * Map a post row to the port's `SeoVisibility`. Deliberately fail-safe: any
 * ambiguity resolves toward LESS public. A `published` row whose `published_at`
 * is null or in the future is reported as `scheduled` so the port's time-gated
 * `isPubliclyResolvable` keeps it private until it is genuinely live.
 */
function deriveVisibility(row: BlogPostSeoRow): SeoVisibility {
  if (row.deleted_at !== null) {
    return { state: "deleted", noindex: true, scheduledPublishAt: null };
  }

  switch (row.status) {
    case "draft":
    case "review":
      return { state: "draft", noindex: true, scheduledPublishAt: null };
    case "scheduled":
      return {
        state: "scheduled",
        noindex: true,
        scheduledPublishAt:
          (row.scheduled_at ?? row.published_at)?.toISOString() ?? null
      };
    case "archived":
      return { state: "archived", noindex: true, scheduledPublishAt: null };
    case "published": {
      if (
        row.published_at === null ||
        row.published_at.getTime() > Date.now()
      ) {
        return {
          state: "scheduled",
          noindex: true,
          scheduledPublishAt: row.published_at?.toISOString() ?? null
        };
      }
      if (row.visibility === "private") {
        return { state: "private", noindex: true, scheduledPublishAt: null };
      }
      // `public` → indexable; `unlisted` → reachable by link but noindex.
      return {
        state: "published",
        noindex: row.visibility === "unlisted",
        scheduledPublishAt: null
      };
    }
    default:
      // Unknown status — fail closed.
      return { state: "unpublished", noindex: true, scheduledPublishAt: null };
  }
}

function robotsFor(visibility: SeoVisibility): SeoRobotsDirective {
  if (visibility.state === "published" && !visibility.noindex) {
    return "index,follow";
  }
  return "noindex,follow";
}

/**
 * Build the controlled `Article` JSON-LD node for one post — host-agnostic (no
 * absolute URL; `seo_distribution` owns the site-level `WebSite`/`Organization`
 * node with the absolute host). Only the fields this module fully owns, all
 * plain schema.org keys so the port's `renderControlledJsonLd` accepts them.
 */
function buildArticleJsonLd(
  row: BlogPostSeoRow,
  title: string,
  description: string | null
): JsonLdNode {
  const node: Record<string, unknown> = {
    "@type": "Article",
    headline: title,
    inLanguage: row.locale
  };
  if (description !== null) node.description = description;
  if (row.published_at !== null) {
    node.datePublished = row.published_at.toISOString();
  }
  node.dateModified = row.updated_at.toISOString();
  return node as JsonLdNode;
}

function toFacts(row: BlogPostSeoRow, basePath: string): SeoResourceFacts {
  const visibility = deriveVisibility(row);
  const title = row.seo_title?.trim() || row.title;
  const description =
    row.meta_description?.trim() || row.excerpt?.trim() || null;
  const canonicalPath = `${basePath}/${row.slug}`;
  const indexable = visibility.state === "published" && !visibility.noindex;

  return {
    resourceType: BLOG_POST_SEO_RESOURCE_TYPE,
    resourceId: row.id,
    visibility,
    canonicalPath,
    // Single-locale rows: the post's own locale is its only reciprocal
    // alternate. (Cross-locale translation linking is a later enhancement — the
    // contract already supports it via `localeAlternates`.)
    localeAlternates: [{ locale: row.locale, path: canonicalPath }],
    metadata: {
      title,
      description,
      robots: robotsFor(visibility)
    },
    openGraph: {
      title,
      description,
      // Explicit SEO/social override wins over the featured image (Issue #649
      // precedence), then the port resolves it same-tenant/verified.
      imageMediaId: row.seo_image_media_id ?? row.featured_media_id,
      type: "article"
    },
    jsonLd: [buildArticleJsonLd(row, title, description)],
    sitemap: indexable
      ? { lastmod: row.updated_at.toISOString(), changefreq: "weekly" }
      : null,
    feed:
      indexable && row.published_at !== null
        ? {
            publishedAt: row.published_at.toISOString(),
            updatedAt: row.updated_at.toISOString()
          }
        : null
  };
}

/**
 * Create the `blog_content` `SeoFactsSource`. `publicBasePath` is the route root
 * every canonical/alternate path is built under (`/news` by default — the
 * host-based, tenant-code-free public route; a composition root serving the
 * legacy `/blog/{tenantCode}` surface passes that instead). Injected here rather
 * than through the frozen port method signature so the adapter stays reusable
 * across both public route shapes without the port knowing about routing.
 */
export function createBlogContentSeoFactsAdapter(
  publicBasePath: string = DEFAULT_PUBLIC_BASE_PATH
): SeoFactsSource {
  const basePath = publicBasePath.endsWith("/")
    ? publicBasePath.slice(0, -1)
    : publicBasePath;

  return {
    async resolveResourceFacts(
      tx: Bun.SQL,
      tenantId: string,
      resourceType: string,
      resourceId: string
    ): Promise<SeoResourceFacts | null> {
      if (resourceType !== BLOG_POST_SEO_RESOURCE_TYPE) return null;

      const rows = (await tx`
        SELECT ${tx.unsafe(SEO_ROW_COLUMNS)}
        FROM awcms_micro_blog_posts
        WHERE tenant_id = ${tenantId} AND id = ${resourceId}
      `) as BlogPostSeoRow[];

      return rows[0] ? toFacts(rows[0], basePath) : null;
    },

    async listPublicResourceFacts(
      tx: Bun.SQL,
      tenantId: string,
      options?: ListPublicResourceFactsOptions
    ): Promise<SeoResourceFactsPage> {
      const pageSize = Math.min(
        Math.max(1, options?.pageSize ?? DEFAULT_LIST_PAGE_SIZE),
        MAX_LIST_PAGE_SIZE
      );
      const cursorId = options?.cursor ?? null;
      const localeFilter = options?.locale ?? null;

      // Only genuinely public, indexable posts (published + public visibility +
      // not soft-deleted + published_at reached) — the sitemap/feed eligibility
      // set. Keyset by id for stable pagination.
      const rows = (await tx`
        SELECT ${tx.unsafe(SEO_ROW_COLUMNS)}
        FROM awcms_micro_blog_posts
        WHERE tenant_id = ${tenantId}
          AND status = 'published'
          AND visibility = 'public'
          AND deleted_at IS NULL
          AND published_at IS NOT NULL
          AND published_at <= now()
          AND (${localeFilter}::text IS NULL OR locale = ${localeFilter})
          AND (${cursorId}::uuid IS NULL OR id > ${cursorId})
        ORDER BY id ASC
        LIMIT ${pageSize + 1}
      `) as BlogPostSeoRow[];

      const hasMore = rows.length > pageSize;
      const pageRows = hasMore ? rows.slice(0, pageSize) : rows;

      return {
        items: pageRows.map((row) => toFacts(row, basePath)),
        nextCursor: hasMore ? (pageRows[pageRows.length - 1]!.id ?? null) : null
      };
    }
  };
}

/** Default adapter instance for the primary host-based `/news` surface. */
export const blogContentSeoFactsAdapter: SeoFactsSource =
  createBlogContentSeoFactsAdapter();

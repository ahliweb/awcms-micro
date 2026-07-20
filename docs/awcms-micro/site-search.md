# Site Search — operator guide, runbook, and semantics (Issue #270, ADR-0031)

`site_search` provides tenant-scoped, cross-content PostgreSQL full-text search over PUBLISHED website content. This document covers indexing/rebuild operations, ranking/filter semantics, the privacy/retention policy, the public/admin surfaces, and accessibility notes. Governance and dependency direction are in [ADR-0031](../adr/0031-site-search-module-admission.md).

## Indexing model

The search index (`awcms_micro_site_search_documents`) is a PROJECTION of every content module's currently-public rows, built from the reviewed `SearchSourceDescriptor`s each module contributes. It is kept consistent by three operations:

| Operation     | What it does                                                                                                                     | Idempotent?                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **reconcile** | Upsert current public documents (skip unchanged via `source_checksum`), delete stale ones (source row gone or no longer public). | Yes — running it while in sync is a no-op.           |
| **rebuild**   | Delete the tenant's documents for the given sources, then reconcile.                                                             | Yes — end state identical regardless of prior state. |
| **reindex**   | Re-extract one resource; upsert if public, remove if not. The event-shaped incremental primitive.                                | Yes.                                                 |

```mermaid
flowchart LR
  SRC[(Content source tables)] -- SearchSourceDescriptor --> ENG[Generic engine]
  ENG -- upsert public / delete stale --> IDX[(awcms_micro_site_search_documents)]
  IDX --> Q[Public /search + JSON query/suggest]
```

**Publication filtering** happens at the source→index boundary: the engine only extracts rows satisfying the descriptor's declarative predicate (for `blog_content.post`: `status='published' AND visibility='public' AND deleted_at IS NULL AND published_at IS NOT NULL AND published_at <= now()`). A draft/private/deleted/scheduled resource is never read into the index. **The index is never an authorization source** — visibility is always owned by the content module.

### Runbook

- **Scheduled reconcile (backbone):** `bun run site-search:reconcile` — run every ~15 minutes (cron/systemd timer). Deterministic + idempotent; safe to re-run. `--tenant=<uuid>` limits to one tenant; `--rebuild` forces a full rebuild.
- **On-demand rebuild:** `POST /api/v1/site-search/index/rebuild` (permission `site_search.index.rebuild`, `Idempotency-Key` required, audited). Use after a bulk content change or a descriptor change.
- **On-demand reconcile:** `POST /api/v1/site-search/index/reconcile` (permission `site_search.index.reconcile`).
- **Status/freshness:** `GET /api/v1/site-search/index/status` (permission `site_search.index.read`) — document count, per-type breakdown, latest indexed timestamp, last run, open failure count, recent runs.
- **Failed-item diagnostics:** `GET /api/v1/site-search/index/failures` (permission `site_search.diagnostics.read`) — sanitized error class/detail per item; each reconcile clears its source's prior failures first, so the list reflects the latest run.

Since base `blog_content` publishes lifecycle as log lines (not real `domain_event_runtime` events), the scheduled reconcile is the deterministic backbone today. When a content module (derived, or a future blog enhancement) publishes real lifecycle events, `reindexSearchResource` provides the low-latency incremental path automatically.

## Ranking and filter semantics

- **Relevance:** `ts_rank(search_vector, websearch_to_tsquery('simple', q)) * source.weight`, ordered `rank DESC, id ASC` (keyset-paginated). The `tsvector` weights title=A, summary=B, tags=C, body=D, so a title match ranks above a body match.
- **Query normalization:** whitespace-collapsed, control-stripped, bounded to 128 chars; shorter than the tenant's `min_query_length` returns empty; the normalized string is a bound parameter (never interpolated).
- **Locale:** every query is locale-scoped; an EN query never returns an ID-locale document.
- **Type filter:** `?type=<resourceType>` is honored only when the tenant admits it (`enabled_resource_types`, `null` = all admitted).
- **Snippets:** `ts_headline` with non-HTML sentinels, escaped, then wrapped in `<mark>` — never raw content markup.
- **Suggestions:** bounded `pg_trgm` typeahead over titles, tenant + locale scoped, capped at `suggestion_limit`.

## Tenant configuration

`GET`/`PUT /api/v1/site-search/settings` (permissions `site_search.settings.{read,update}`; PUT is `Idempotency-Key`'d + audited):

| Field                                    | Bounds      | Meaning                                            |
| ---------------------------------------- | ----------- | -------------------------------------------------- |
| `enabled`                                | boolean     | Serve public search + suggestions for this tenant. |
| `enabledResourceTypes`                   | ≤50 or null | Admitted types (`null` = all).                     |
| `resultLimit`                            | 1–100       | Public search page size.                           |
| `minQueryLength`                         | 1–20        | Minimum query length.                              |
| `suggestionsEnabled` / `suggestionLimit` | bool / 1–20 | Typeahead.                                         |
| `analyticsEnabled`                       | boolean     | Opt-in minimized query analytics.                  |

## Privacy and retention

- **Query log (`awcms_micro_site_search_query_log`)** is written ONLY when `analytics_enabled` is on, and stores ONLY a sha256 of the normalized query (never the raw query), its length, the locale, and the result count — no PII / sensitive parameter can leak. Registered as a `generic` data-lifecycle descriptor (`analytics_telemetry`, hard-delete, default 30-day retention).
- **Failed-item diagnostics (`awcms_micro_site_search_index_failures`)** store a sanitized error class/detail only; registered as a `generic` data-lifecycle descriptor (`system_event`, hard-delete, default 90-day retention). Both are purged by the generic `data_lifecycle` engine (running as the least-privilege worker role).

## Anonymous abuse controls

Per-IP rate limits (`SITE_SEARCH_RATE_LIMIT_MAX`/`_WINDOW_SEC`, and `_SUGGEST_` variants), query-length bounds, the session `statement_timeout`, and result caps. Every non-resolving / disabled / rejected outcome returns the same neutral empty payload — never leaking WHY.

## Accessibility (WCAG)

The `/search` page works with NO JavaScript — a native `<form role="search">` + result links, fully keyboard accessible. The suggestion typeahead is progressive enhancement: an ARIA combobox (`role="combobox"` + `role="listbox"`/`role="option"`, `aria-expanded`/`aria-activedescendant`) with ArrowUp/ArrowDown/Enter/Escape keyboard navigation, populated via `textContent` (never `innerHTML`). The results region is an `aria-live="polite"` landmark; the results page is `robots: noindex`.

## Deferred (documented)

Blog PAGES and non-`blog_post` resource types (blog pages have no public route today), media/gallery metadata, per-document `domain_event_runtime` events, and an admin dashboard UI — the descriptor seam already supports the additional sources.

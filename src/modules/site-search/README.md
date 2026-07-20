# site_search

Tenant-scoped, cross-content **PostgreSQL full-text search** over PUBLISHED website content (Issue #270, epic #261 Wave 2, [ADR-0031](../../../docs/adr/0031-site-search-module-admission.md)). Official Optional Module, `type: "domain"`, depends only on Core (`tenant_admin`, `identity_access`).

## What it owns

- The unified search index `awcms_micro_site_search_documents` (sql/087, RLS FORCE'd) — a `tsvector`/GIN projection of every content module's currently-public rows, plus a `pg_trgm` GIN index on `title` for suggestions.
- Per-tenant config (`awcms_micro_site_search_settings`), the index run ledger (`awcms_micro_site_search_index_runs`), failed-item diagnostics (`awcms_micro_site_search_index_failures`), and an opt-in minimized query log (`awcms_micro_site_search_query_log`).
- The public `/search` page + JSON `/api/v1/site-search/{query,suggest}`, and the admin API `/api/v1/site-search/{settings,index/*}`.

## Contribution seam — `SearchSourceDescriptor` (ADR-0031 §3)

Content modules declare **pure-data** `SearchSourceDescriptor`s in their own `module.ts` via `ModuleDescriptor.searchSources` (see `blog_content`'s `blog_content.post` descriptor). A descriptor maps a source table's columns (title/summary/body/tags/locale/slug/updated_at) + a **declarative publication filter** (equals / notNull / isNull / timeReached) + a URL template + a relevance weight. There is **no executable extractor and no tenant SQL** — the generic engine (`application/search-index-engine.ts`) builds a parameterized query from the descriptor; only reviewed IDENTIFIERS (validated against `^[a-z_][a-z0-9_]*$` / `awcms_micro_`) are interpolated, exactly like `data_lifecycle`'s generic executionMode.

`site_search`'s `domain/search-source-registry.ts` aggregates + validates every module's descriptors through `listModules()` (the `reporting`/`data_lifecycle` precedent), so a **derived module can contribute a reviewed source without editing the base registry** and without writing to `site_search`'s tables. It is NOT modeled as a `search_source` capability `provides` — >1 provider would trip `capability_provider_conflict`.

## Indexing (ADR-0031 §4)

- **reconcile** (deterministic, idempotent): upsert the current public set (checksum-gated skip) + delete stale index documents (source row gone or no longer public). Re-running while in sync is a no-op; matches source counts/checksums.
- **rebuild** (idempotent): delete the tenant's documents for the given sources, then reconcile — end state identical regardless of prior state.
- **reindex** (`reindexSearchResource`): re-extract one resource; public → upsert, no longer public → remove. The event-shaped incremental primitive.
- **Job:** `bun run site-search:reconcile` (scheduled backbone; `--rebuild`, `--tenant=<id>`). Because base `blog_content` publishes lifecycle as log lines (not real outbox events), this scheduled sweep is the deterministic backbone; the reindex primitive + a future domain-event consumer are the low-latency path once a content module emits real lifecycle events.

## Security spine

- **Publication-state** enforced at the source→index boundary — the index holds public content only and is NEVER an authorization source.
- **Tenant + locale isolation** — RLS FORCE + explicit `tenant_id`/`locale` predicates; `buildSearchCacheKey` refuses a key without tenant/locale/query-hash (cache-poisoning / cross-tenant defense).
- **SQL injection** — the query is always a bound parameter into `websearch_to_tsquery('simple', $1)`; descriptor identifiers are validated before interpolation.
- **XSS** — snippets are built by `ts_headline` with non-HTML sentinels, escaped in `renderSafeSnippet`, then the sentinels become `<mark>` — content-originated markup can never survive.
- **Anonymous abuse** — per-IP rate limits, query-length bounds, session `statement_timeout`, result caps.

## Deferred (documented)

Blog PAGES and non-`blog_post` resource types (pages have no public route today), media/gallery metadata, per-document `domain_event_runtime` events, and an admin dashboard UI — the descriptor seam already supports the additional sources.

See `docs/awcms-micro/site-search.md` for the indexing/rebuild runbook, ranking/filter semantics, and privacy/retention policy.

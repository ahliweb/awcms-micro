# comments

Tenant-scoped, **MODERATION-FIRST commenting** over PUBLISHED, PUBLIC commentable resources (Issue #271, epic #261 Wave 2, [ADR-0032](../../../docs/adr/0032-comments-module-admission.md)). Official Optional Module, `type: "domain"`, `status: "active"`, default-OFF, depends only on Core (`tenant_admin`, `identity_access`). Admission + first runtime landed together, bumping the base registry 20 → 21 and `MODULE_CONTRACT_VERSION` 1.3.0 → 1.4.0.

## What it owns

- **Threads** (`awcms_micro_comments_threads`) — one per `(commentable resource, locale)`, storing the resolved public URL, the resolved policy mode, and denormalized counters.
- **Comments** (`awcms_micro_comments_comments`, sql/089, RLS FORCE'd) — bounded-depth (0..4 CHECK) replies, raw plain-text body, soft-delete lifecycle, and privacy-minimized author fields (sha256 email hash + `j***@e***` mask, hashed ip/ua — never raw).
- **Append-only moderation history** (`..._moderation_events`) and a dedup-bounded **abuse-report ledger** (`..._reports`, `open → reviewed/dismissed`).
- **Reply-notify subscriptions** (`..._reply_subscriptions`) — minimized, double-opt-in, AES-256-GCM-encrypted recipient reference.
- **Per-tenant settings** (`..._settings`) and minimized **anti-abuse telemetry** (`..._abuse_events`).
- The PUBLIC submit/list/reply/edit/report/delete-request API and the ABAC-guarded, audited admin moderation API under `/api/v1/comments/*`; the public island `src/components/comments/CommentsSection.astro` (+ `/comments/demo` reference page) and the admin moderation queue `/admin/comments`.

## Contribution seam — `CommentableResourceDescriptor` (ADR-0032 §3)

Content modules declare **pure-data** `CommentableResourceDescriptor`s in their own `module.ts` via `ModuleDescriptor.commentableResources` (see `blog_content`'s `blog_content.post` descriptor). A descriptor maps a source table's columns (tenant/id/locale/slug) + a **declarative publication filter** (equals / notNull / isNull / timeReached) + a URL template + a default policy mode. There is **no executable extractor and no tenant SQL** — the generic engine (`application/commentable-resource-engine.ts`) builds a parameterized publication-check query from the descriptor; only reviewed IDENTIFIERS (validated against `^[a-z][a-z0-9_]*$` / `awcms_micro_`) are interpolated, exactly like `site_search`'s / `data_lifecycle`'s generic executionMode.

`comments`'s `domain/commentable-resource-registry.ts` aggregates + validates every module's descriptors through `listModules()` (the `site_search`/`reporting` precedent — unique `key`, unique `(tableName, resourceType)`), so a **derived module can contribute a reviewed source without editing the base registry** and without writing to `comments`'s tables. It is NOT modeled as a `commentable_resource` capability `provides` — >1 provider would trip `capability_provider_conflict`.

The first descriptor is `blog_content.post`: `resourceType: blog_post`, table `awcms_micro_blog_posts`, URL `/news/:slug`, publication filter `status='published' AND visibility='public' AND deleted_at IS NULL AND published_at IS NOT NULL AND published_at <= now()`, `defaultPolicy: moderated-anonymous`. Blog PAGES are not contributed (no public route).

## Security spine (ADR-0032 threat model)

- **No stored HTML → no stored XSS** — bodies are stored as raw plain text; `renderCommentHtml` (`domain/comment-sanitization.ts`) escapes EVERY character of HTML on render, then autolinks only bare http(s) URLs (with the URL escaped in both `href` and visible text) emitted with `rel="nofollow ugc noopener noreferrer"` + `target="_blank"`. `javascript:` / `data:` / `vbscript:` / `file:` / relative / control-char URLs are never linkified — they render as escaped plain text. The public list returns this SAFE HTML; there is no path by which a stored comment reaches a browser as raw markup.
- **Allowed safe-text subset (exact):** plain UTF-8 text with C0/C1 control characters stripped (tab + newline kept, `\r\n?` normalized to `\n`, runs of 3+ blank lines collapsed to one), trimmed, bounded by `maxLength` (default 4000, hard cap 4000) and `maxLinksPerComment` (default 2). The ONLY tags the renderer can emit are the fixed `<a>` (safe http(s) autolink) and `<br>` (newline). No other tag, attribute, or scheme is ever produced.
- **Publication-state at the resource→thread boundary** — a comment is only ever accepted or shown against a resource that passes the descriptor's declarative `publicationFilter` (parameterized query, bound values, validated identifiers). A draft/private/deleted/scheduled resource never receives or exposes comments. The comment surface is **never** an authorization source for the underlying resource.
- **Tenant isolation** — every table is RLS FORCE'd with an explicit `tenant_id` predicate; hashes are tenant-salted (`sha256(tenantId + ':' + value)`) so they never collide/leak across tenants.
- **Public list = approved-only, NO moderation metadata** — reason codes, actor, ip/email hashes, internal ids never leave the admin surface.

## Policy modes + status machine

**Policy modes** (`domain/comment-policy.ts`): `disabled` (no submissions) | `authenticated-only` (registered authors only) | `moderated-anonymous` (anyone; every submission starts `pending`) | `moderated-registered` (registered only; every submission `pending`). Moderation-first: every accepted submission starts `pending` by default; anonymous submissions ALWAYS require moderation regardless of `require_moderation`.

**Status machine** (`domain/comment-status.ts`, the ONE place transition semantics live): `pending → approved | rejected | spam | deleted`; `approved → rejected | spam | deleted` (and `archive` maps an approved comment to `rejected` with the reserved `archived` reason code, kept out of public view for history); `rejected | spam → pending (restore) | deleted`; `deleted` is terminal. Illegal transitions throw `IllegalCommentTransitionError`.

## Anti-abuse (server-side, `domain/anti-abuse.ts`)

Honeypot field (`website` — any value = bot), submit-timing floor via an HMAC-signed timing token (`domain/timing-token.ts`, never trusts a client number), case-insensitive blocked-term substring match, sha256 duplicate fingerprint over normalized body + author within a 600s window, per-IP rate limits, and per-comment link/length bounds. Optional Turnstile verification is a documented thin provider seam (ADR-0006): verified OUTSIDE any DB transaction, no-op when unconfigured. Every blocked submission writes one minimized `abuse_events` telemetry row (ip/fingerprint HASHES + reason only).

## Privacy / retention

- Author email is NEVER stored raw — `author_email_hash` (sha256 lookup) + `author_email_masked` (`j***@e***`). IP/UA are hashed (`author_ip_hash`/`user_agent_hash`) for abuse correlation only.
- Reply-notify recipients live ONLY in `..._reply_subscriptions`, AES-256-GCM-encrypted (`domain/subscriber-crypto.ts`, separate `COMMENTS_SUBSCRIBER_ENCRYPTION_KEY`) or the unresolvable sentinel when no key is configured — never exposed in any API response, event, or log; only the email dispatcher decrypts at send time.
- **Retention job** `bun run comments:retention` (`application/comment-retention.ts`): a bounded, per-tenant sweep that anonymizes (NULLs author identity on) comments older than the cutoff (default 365d) while retaining the row + body + append-only history, and deletes unconfirmed reply subscriptions past the confirmation window. It SKIPS a tenant under an active legal hold on `comments.comments`. The `abuse_events` and stale confirmed `reply_subscriptions` age-out via the `data_lifecycle` generic engine.

## API surface

Public (anonymous, host-resolved tenant): `GET /api/v1/comments` (approved list), `POST /api/v1/comments` (submit), `POST /{id}/replies`, `PATCH /{id}` (edit within window), `POST /{id}/report`, `POST /{id}/delete-request`. Admin (ABAC default-deny, audited, high-risk mutations `Idempotency-Key`'d): `GET /admin/queue`, `POST /admin/{id}/moderate` (approve|reject|spam), `POST /admin/{id}/archive`, `POST /admin/{id}/restore`, `POST /admin/bulk-moderate`, `GET`/`PUT /admin/settings`. Permissions: `comments.moderation.{read,approve,reject,archive,restore,delete}` + `comments.settings.{read,update}` — `reject` gates both reject and mark-as-spam (spam is a rejection subtype). Navigation entry `admin.comments.nav_label → /admin/comments`, gated by `comments.moderation.read`.

## Events

Address-free domain events (v1.0) through the `domain_event_runtime` outbox (same-commit, ADR-0006) + AsyncAPI: `awcms-micro.comments.comment.submitted`, `awcms-micro.comments.comment.approved`, `awcms-micro.comments.reply.created`. Payloads carry only opaque ids + resource type/url + status — never a recipient address.

## Metrics

Low-cardinality counters (`src/lib/observability/metrics-port.ts`): `comments_submissions_total`, `comments_moderation_total`, `comments_abuse_blocks_total`, `comments_reports_total`.

## Deferred (documented)

Turnstile is a thin provider seam (no-op until configured), the email reply-notify dispatcher is a documented follow-up consumer, richer notification UI, per-resource-type policy overrides, and additional commentable resource types (blog pages, media) — the descriptor seam already supports the additional sources.

See [`docs/awcms-micro/comments.md`](../../../docs/awcms-micro/comments.md) for the moderation policy, privacy/consent/retention matrix, admin/moderator/user guide, anti-abuse runbook, incident handling, a11y and i18n notes.

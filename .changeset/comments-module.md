---
"awcms-micro": minor
---

Admit + implement the `comments` module (ADR-0032, Issue #271) — a tenant-scoped, MODERATION-FIRST commenting system over PUBLISHED, PUBLIC commentable resources.

- Base registry **20 → 21**; `MODULE_CONTRACT_VERSION` **1.3.0 → 1.4.0** (new optional `ModuleDescriptor.commentableResources` + `CommentableResourceDescriptor`/`CommentableResourcePublicationFilter`/`CommentableResourceDefaultPolicy` types — MINOR, additive).
- New descriptor-list contribution seam (`commentableResources`) mirroring `searchSources`: content modules declare pure-data, reviewed commentable resources; `comments`'s generic engine reads them via `listModules()` and re-validates identifiers before any SQL. `blog_content` contributes the first descriptor (`blog_content.post`). CONSUMER/aggregator inward leaf — nothing depends on `comments`.
- Migrations `089` (schema: threads, comments, moderation events, reports, reply subscriptions, settings, abuse events — all RLS FORCE'd, tenant-scoped, CHECK-bounded) + `090` (permission catalog seed). Least-privilege worker GRANTs for the retention job + data_lifecycle generic purge.
- Public API (`POST/GET /api/v1/comments`, replies, edit-within-window, report, delete-request) — host-resolved tenant, anti-abuse-gated (honeypot, submit-timing token, blocked terms, duplicate fingerprint, per-IP rate limits), neutral responses (no existence/moderation oracle), stored plain text + escape-on-render (no stored XSS). Admin/moderation API (`/api/v1/comments/admin/*` queue, moderate, archive/restore, bulk, settings) — ABAC default-deny, audited with reason codes, Idempotency-Key on high-risk mutations.
- Domain events (`comments.comment.submitted`/`.approved`, `comments.reply.created`) via the transactional outbox with ADDRESS-FREE payloads (AsyncAPI + event-type registry); reply-notify recipients stored encrypted/minimized and resolved by the email dispatcher outside any DB transaction.
- Public comment island + admin moderation queue screen (a11y AA, i18n en+id), retention/anonymization job (`bun run comments:retention`, legal-hold aware), low-cardinality metrics, and data_lifecycle registration for the high-volume tables.

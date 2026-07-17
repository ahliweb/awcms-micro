-- ADR-0026 step 3+4 — give `media_library` its own per-tenant "managed media
-- enforcement is on" signal, so that question stops being `news_portal`'s to
-- answer.
--
-- ## The product gap this closes
--
-- `blog_content`'s media gate only enforces registry-backed references when
-- `news_portal`'s full-online R2-only mode is active for the tenant. That mode
-- is owned by `news_portal` (`awcms_micro_news_portal_tenant_state`, sql/043).
-- Consequence: a tenant running a brochure site (`blog_content` +
-- `tenant_domain`, no news portal) can only ever paste raw URLs — the
-- `online_website` preset is literally a website with no managed media.
-- Uploading a logo must not require switching on a NEWS PORTAL.
--
-- ## Why a second table rather than reading sql/043
--
-- Reading `awcms_micro_news_portal_tenant_state` from `media_library` would
-- make a System Foundation module depend on a domain module — the ADR-0013 §1
-- inversion ADR-0026 exists to remove. The signal has to be owned by the module
-- that answers the question. `news_portal`'s preset becomes ONE writer of this
-- flag, not its owner; sql/043 keeps its own, narrower meaning ("this tenant
-- applied the news portal preset"), which is still genuinely news_portal's fact.
--
-- ## Tamper-proofing — inherited deliberately, not by copy-paste
--
-- Same construction as sql/043, for the same reasons its header documents at
-- length: NO generic write endpoint anywhere, RLS FORCE'd, and the only code
-- that writes it is `media-library/application/media-library-tenant-state.ts`'s
-- `markManagedMediaEnforced`. That file's callers are the sanctioned preset
-- entry points. The two mechanisms sql/043 rejected (`awcms_micro_tenant_modules`
-- — opt-out-by-default, so every tenant reads as enabled; and
-- `awcms_micro_module_settings` — tenant-writable via the generic
-- `PATCH /api/v1/tenant/modules/{moduleKey}/settings`, confirmed exploitable
-- end-to-end in review) would fail here for EXACTLY the same reasons: this flag
-- decides whether media validation runs at all, so a tenant able to clear it
-- could switch off its own media validation. Do not "simplify" this into a
-- module setting.
CREATE TABLE IF NOT EXISTS awcms_micro_media_library_tenant_state (
  tenant_id uuid PRIMARY KEY REFERENCES awcms_micro_tenants (id),
  managed_media_enforced_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE awcms_micro_media_library_tenant_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_media_library_tenant_state FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_media_library_tenant_state_tenant_isolation
  ON awcms_micro_media_library_tenant_state
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Backfill: every tenant that already applied the news_portal R2-only preset
-- has media enforcement TODAY (that is exactly what the old gate keyed on), so
-- it must keep it. Without this, deploying this migration would silently switch
-- media validation OFF for precisely the tenants who opted into it — a security
-- regression disguised as a refactor.
--
-- Timestamp is carried over verbatim rather than set to now(): this records when
-- enforcement genuinely began for that tenant, and now() would falsely claim
-- every historical activation happened at deploy time.
--
-- This runs as the migration role (superuser/owner with BYPASSRLS — see sql/013's
-- header: RLS is bypassed unconditionally for SUPERUSER/BYPASSRLS regardless of
-- FORCE), so it reads across every tenant rather than the zero rows a
-- tenant-scoped connection would see. `tests/integration/media-library-tenant-state.integration.test.ts`
-- asserts the row count actually moved, rather than trusting that reasoning.
INSERT INTO awcms_micro_media_library_tenant_state
  (tenant_id, managed_media_enforced_at, updated_at)
SELECT tenant_id, full_online_r2_mode_applied_at, now()
FROM awcms_micro_news_portal_tenant_state
ON CONFLICT (tenant_id) DO NOTHING;

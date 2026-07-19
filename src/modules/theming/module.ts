import { defineModule } from "../_shared/module-contract";
import {
  THEMING_CONFIG_ACTIVITY_CODE,
  THEMING_MODULE_KEY,
  THEMING_PREVIEW_ACTIVITY_CODE,
  THEMING_VERSION_ACTIVITY_CODE
} from "./domain/theme-permissions";

/** data_lifecycle registry key for the short-lived preview-session table (Issue #269). */
export const THEMING_PREVIEW_LIFECYCLE_KEY = "theming.preview_sessions";

/**
 * `theming` — Official Optional Module admitted AND implemented by ADR-0029
 * (Issue #269, epic #261 Wave 2). Registered here with its first (and only)
 * runtime code, bumping the base registry 18 → 19 (`EXPECTED_BASE_MODULE_COUNT`
 * in `scripts/scope-consistency-check.ts`, regenerated inventories). Unlike
 * `seo_distribution` (ADR-0028, admission-only first), theming has no latent
 * cross-module behavior to consolidate ahead of code, so admission + runtime land
 * atomically (the ADR-0026 posture: register when the code exists).
 *
 * ## What this module OWNS
 *
 * Tenant-selectable presentation with NO uploaded server code and NO arbitrary
 * templates. A THEME is trusted, reviewed, BUILD-TIME source (a `ThemeDescriptor`
 * composed by `theme-registry.ts`, base + a derived-repo seam
 * `application-theme-registry.ts` mirroring `application-registry.ts`); only a
 * tenant's DATA configuration of a theme lives in the database
 * (`awcms_micro_theming_config_versions` + `_tenant_state`, sql/085, RLS FORCE'd).
 *
 * The security spine (`domain/css-value-validation.ts`) validates every design
 * token VALUE by REJECTION (never sanitization) against strict, bounded grammars
 * — colors, dimensions with an allowed-unit list, plain numbers, and font
 * families chosen from a per-theme allow-list (the emitted font stack is
 * descriptor-owned, never tenant-authored). `url(...)`, `expression()`,
 * `@import`, `javascript:`, comment breakouts, `;{}<>` and unbalanced tokens can
 * never reach the emitted CSS. Token values are serialized to a `text/css`
 * custom-property block served as an EXTERNAL same-origin stylesheet
 * (`/theming/tokens.css`), so the app's `style-src 'self'` CSP is never weakened
 * (no per-request inline `<style>`). Rendering is only through the trusted
 * build-time `PublicThemeLayout.astro` — there is NO database-stored executable
 * template, no tenant-authored Astro/JS/SQL/eval/raw HTML.
 *
 * Published configuration versions are IMMUTABLE (INSERT-only engine + a sql/085
 * BEFORE UPDATE/DELETE trigger); the active theme pointer lives on the state row,
 * so publish/rollback/retire move a pointer while history stays intact.
 *
 * Preview sessions (`awcms_micro_theming_preview_sessions`, sql/085) are
 * authorized (token stored as a SHA-256 hash), short-lived (`expires_at`, generic
 * data_lifecycle purge), non-indexable (`X-Robots-Tag: noindex`), and isolated
 * from the public cache (`private, no-store` + a distinct URL namespace).
 *
 * ## Direction of the arrow (ADR-0029 §2) — depends on nothing but Core
 *
 * `theming` is a CONSUMER/leaf: it consumes `media_library` (logo/favicon/image
 * id resolution, optional) plus — at the composition root, not as versioned ports
 * — SEO metadata, `tenant_domain` host resolution, and i18n. NO existing module
 * depends on `theming`, and it `provides` no capability, so the DAG is unchanged
 * and no `CAPABILITY_CONTRACT_VERSIONS` entry is added. Lifecycle `dependencies`
 * are only the two Core modules.
 *
 * ## Deliberately NOT here yet (documented follow-ups)
 *
 * `navigation` is undeclared: the admin API exists, not a rich admin SCREEN (the
 * token editor / responsive-preview dashboard) — deferred API-first, same posture
 * as `seo_distribution`'s #266 config API. `events` stays undeclared: publish/
 * rollback/retire are audited synchronous hooks, not yet published domain events
 * (same decision as `seo_distribution` #268). `jobs` remains undeclared: preview
 * retention rides the generic data_lifecycle purge engine (declared below).
 */
export const themingModule = defineModule({
  key: THEMING_MODULE_KEY,
  name: "Theming",
  version: "1.0.0",
  status: "active",
  description:
    "Tenant-selectable presentation via trusted, reviewed, BUILD-TIME theme descriptors (ADR-0029, Official Optional Module). A theme is composed by `src/modules/theming/theme-registry.ts` (base themes + a derived-repo build-time seam `application-theme-registry.ts`, mirroring `application-registry.ts`) — NEVER a database row or an uploaded artifact. Only a tenant's DATA configuration of a theme lives in the database (`awcms_micro_theming_config_versions` draft + immutable published versions, and `awcms_micro_theming_tenant_state` active pointer, sql/085, RLS FORCE'd): bounded, schema-validated design-token overrides, slot variant selections, media asset ids (resolved same-tenant/verified through `media_library`), content-section order, and nav placement. The security spine (`domain/css-value-validation.ts`) validates every CSS token value by REJECTION against strict grammars (hex/rgb/hsl colors with numeric components, dimensions with an allowed-unit list, bounded numbers, font families from a per-theme allow-list whose emitted stack is descriptor-owned) — `url(...)`, `expression()`, `@import`, `javascript:`, comment breakouts, `;{}<>` and unbalanced tokens can never reach output. Token values ship as an EXTERNAL same-origin `text/css` stylesheet (`/theming/tokens.css`), so the app's `style-src 'self'` CSP is never weakened (no per-request inline style). Rendering is only through the trusted build-time `PublicThemeLayout.astro` (no DB-stored template, no tenant-authored Astro/JS/SQL/eval/raw HTML). Published versions are IMMUTABLE (INSERT-only engine + a sql/085 BEFORE UPDATE/DELETE trigger); lifecycle is draft → validate → preview → publish → rollback/retire, with rollback/retire moving the active pointer while history stays intact. Preview sessions (sql/085) are authorized (token stored hashed), short-lived, non-indexable (X-Robots-Tag: noindex), and isolated from the public cache (private, no-store + distinct URL namespace). Admin API under /api/v1/theming/* (selection, token edit, validate, preview, publish, version history, rollback, retire) is ABAC-gated, idempotency-keyed on high-risk mutations, and audited. A default theme (`aria`) ships in-repo; a derived repository contributes its own reviewed theme through the build-time seam without editing the base registry (proved by tests/fixtures/derived-theme-example).",
  dependencies: ["tenant_admin", "identity_access"],
  type: "domain",
  capabilities: {
    consumes: [
      // `media_library` — resolve logo/favicon/image asset ids to safe,
      // same-tenant, verified URLs (optional: absent → the theme renders without
      // its media, degrading safely). The only versioned capability port this
      // module consumes; SEO/tenant_domain/i18n are wired at the composition root.
      {
        capability: "media_library",
        providedBy: "media_library",
        optional: true
      }
    ]
  },
  api: {
    openApiPath: "openapi/awcms-micro-public-api.openapi.yaml",
    basePath: "/api/v1/theming"
  },
  permissions: [
    {
      activityCode: THEMING_CONFIG_ACTIVITY_CODE,
      action: "read",
      description:
        "Read this tenant's theme selection, available themes, the draft config, and published version history"
    },
    {
      activityCode: THEMING_CONFIG_ACTIVITY_CODE,
      action: "update",
      description:
        "Edit this tenant's draft theme config (design tokens, slot variants, media assets, section order) — bounded, validated data (high-risk, audited)"
    },
    {
      activityCode: THEMING_VERSION_ACTIVITY_CODE,
      action: "publish",
      description:
        "Publish a validated draft as an immutable theme version and make it the live look (high-risk, idempotency-keyed, audited)"
    },
    {
      activityCode: THEMING_VERSION_ACTIVITY_CODE,
      action: "restore",
      description:
        "Roll the active theme back to an earlier published version (high-risk, idempotency-keyed, audited)"
    },
    {
      activityCode: THEMING_VERSION_ACTIVITY_CODE,
      action: "archive",
      description:
        "Retire the active theme so the site falls back to the default (high-risk, idempotency-keyed, audited)"
    },
    {
      activityCode: THEMING_PREVIEW_ACTIVITY_CODE,
      action: "create",
      description:
        "Create a short-lived, non-indexable preview session for the draft theme config (audited)"
    }
  ],
  dataLifecycle: [
    {
      key: THEMING_PREVIEW_LIFECYCLE_KEY,
      tableName: "awcms_micro_theming_preview_sessions",
      ownerModuleKey: THEMING_MODULE_KEY,
      scope: "tenant",
      cursorColumn: "expires_at",
      retentionClass: "operational_queue",
      retentionMinDays: 1,
      retentionMaxDays: 30,
      defaultRetentionDays: 1,
      partition: {
        eligible: false,
        rationale:
          "Ephemeral, low-cardinality operational rows (one short-lived session per preview request, each already unusable past its own expires_at). Volume is bounded by concurrent preview activity, not traffic, and the tenant+expires_at index keeps the age-based purge cheap without partitioning."
      },
      archive: {
        archivable: false,
        rationale:
          "A preview session is disposable, hashed, short-lived authorization state — there is nothing to retain once it has expired; it is simply purged."
      },
      deletion: {
        mode: "hard_delete",
        rationale:
          "A straight age-based DELETE of expired sessions — no soft-delete lifecycle for ephemeral preview tokens, and nothing references a row once purged."
      },
      legalHold: {
        applicable: false,
        precedence: "not_applicable"
      },
      requiredIndexes: [
        {
          columns: ["tenant_id", "expires_at"],
          purpose:
            "awcms_micro_theming_preview_sessions_tenant_expires_idx (sql/085) — the exact (tenant, cursor) composite the generic purge engine filters + orders by for its bounded age-based DELETE."
        }
      ],
      batchLimit: 5000,
      backupRestoreNotes:
        "No special backup/restore implications: derived, purgeable, hashed, short-lived authorization state. A restore that omits this table loses only in-flight preview sessions (operators simply re-create previews), never any source-of-truth data.",
      executionMode: "generic"
    }
  ]
});

#!/usr/bin/env bun
/**
 * `bun run api:tenant-route:check` — Issue #370.
 *
 * Every NEW route under `src/pages/api` must open its tenant transaction
 * through `defineTenantRoute` (`src/modules/_shared/tenant-route.ts`), not
 * by calling `withTenant` directly.
 *
 * ## Why a gate
 *
 * 201 of 260 routes copy the same eight-line opening (`resolveAuthInputs` →
 * tenant/token guards → `getDatabaseClient` → `hashSessionToken` →
 * `withTenant` → `authorizeInTransaction` → `auth.denied`). That duplication
 * is what turned #323 (`withTenant`'s 503 `Response` leaking into
 * non-`Response` callers) and #324 (`Promise.all` over one `tx` leaking
 * work-class slots, 16 edit sites) into repo-wide sweeps, and it is why 221
 * routes share login's pool budget by omission rather than by decision
 * (`docs/awcms-micro/work-class-registry.generated.json`, `source:
 * "default"`). A grep-shaped gate is the only thing that keeps the count of
 * hand-rolled openings going DOWN while the migration proceeds module by
 * module.
 *
 * ## The allowlist is a debt ledger, not an off switch
 *
 * The migration is deliberately incremental (one module per PR, no
 * behaviour change), so routes that predate the factory are listed below
 * verbatim. Two rules make that list one-directional:
 *
 * 1. A route under `src/pages/api` that calls `withTenant` directly and is
 *    NOT listed fails the gate — that is a NEW route, and new routes have
 *    no excuse.
 * 2. A listed route that no longer calls `withTenant` directly (because it
 *    was migrated, or deleted) ALSO fails the gate, with an instruction to
 *    delete the line. The list can therefore only shrink; it can never
 *    quietly absorb a regression.
 *
 * Same literal, comment-skipping, regex-over-AST idiom as
 * `scripts/http-method-check.ts` and `scripts/work-class-registry-generate.ts`
 * — auditable in review, no new dependency. The `withTenant` pattern is
 * copied from the latter deliberately: a call written as `withTenant<T>(...)`
 * must be detected too (that exact false negative was a real finding on PR
 * #770).
 */
import { readdir } from "node:fs/promises";
import path from "node:path";

const ROUTES_ROOT = "src/pages/api";

/** Identical to `work-class-registry-generate.ts`'s — matches `withTenant(` AND `withTenant<T>(`. */
const WITH_TENANT_CALL_PATTERN = /\bwithTenant\s*(?:<[^()]*>)?\s*\(/;

/**
 * Routes that still open their own transaction, measured at `0a8c3ba5`
 * (v1.1.0). ONLY REMOVE LINES FROM THIS LIST. Never add one: a new entry
 * means a new route skipped `defineTenantRoute`, which is exactly what this
 * gate exists to prevent.
 */
const NOT_YET_MIGRATED: readonly string[] = [
  "src/pages/api/v1/access/assignments.ts",
  "src/pages/api/v1/access/decision-logs.ts",
  "src/pages/api/v1/access/evaluate.ts",
  "src/pages/api/v1/access/modules.ts",
  "src/pages/api/v1/analytics/devices.ts",
  "src/pages/api/v1/analytics/events.ts",
  "src/pages/api/v1/analytics/locations.ts",
  "src/pages/api/v1/analytics/pages.ts",
  "src/pages/api/v1/analytics/realtime.ts",
  "src/pages/api/v1/analytics/retention/purge.ts",
  "src/pages/api/v1/analytics/security.ts",
  "src/pages/api/v1/analytics/sessions.ts",
  "src/pages/api/v1/analytics/settings.ts",
  "src/pages/api/v1/analytics/summary.ts",
  "src/pages/api/v1/auth/login.ts",
  "src/pages/api/v1/auth/logout.ts",
  "src/pages/api/v1/auth/me.ts",
  "src/pages/api/v1/auth/mfa/recovery-codes/regenerate.ts",
  "src/pages/api/v1/auth/mfa/status.ts",
  "src/pages/api/v1/auth/mfa/totp/disable.ts",
  "src/pages/api/v1/auth/mfa/totp/enroll/start.ts",
  "src/pages/api/v1/auth/mfa/totp/enroll/verify.ts",
  "src/pages/api/v1/auth/mfa/totp/verify.ts",
  "src/pages/api/v1/auth/password/forgot.ts",
  "src/pages/api/v1/auth/password/reset.ts",
  "src/pages/api/v1/auth/providers/google/callback.ts",
  "src/pages/api/v1/auth/providers/google/link.ts",
  "src/pages/api/v1/auth/providers/google/start.ts",
  "src/pages/api/v1/auth/providers/google/unlink.ts",
  "src/pages/api/v1/auth/register.ts",
  "src/pages/api/v1/auth/sso/[providerKey]/callback.ts",
  "src/pages/api/v1/auth/sso/[providerKey]/link.ts",
  "src/pages/api/v1/auth/sso/[providerKey]/start.ts",
  "src/pages/api/v1/auth/sso/[providerKey]/unlink.ts",
  "src/pages/api/v1/auth/sso/providers.ts",
  "src/pages/api/v1/blog/ads/[id].ts",
  "src/pages/api/v1/blog/ads/index.ts",
  "src/pages/api/v1/blog/internal-tag-links/settings.ts",
  "src/pages/api/v1/blog/menus/[id].ts",
  "src/pages/api/v1/blog/menus/index.ts",
  "src/pages/api/v1/blog/pages/[id].ts",
  "src/pages/api/v1/blog/pages/[id]/quality-checklist.ts",
  "src/pages/api/v1/blog/pages/index.ts",
  "src/pages/api/v1/blog/posts/[id].ts",
  "src/pages/api/v1/blog/posts/[id]/archive.ts",
  "src/pages/api/v1/blog/posts/[id]/internal-links/preview.ts",
  "src/pages/api/v1/blog/posts/[id]/publish.ts",
  "src/pages/api/v1/blog/posts/[id]/purge.ts",
  "src/pages/api/v1/blog/posts/[id]/quality-checklist.ts",
  "src/pages/api/v1/blog/posts/[id]/restore.ts",
  "src/pages/api/v1/blog/posts/[id]/revisions/[revisionId].ts",
  "src/pages/api/v1/blog/posts/[id]/revisions/[revisionId]/restore.ts",
  "src/pages/api/v1/blog/posts/[id]/revisions/index.ts",
  "src/pages/api/v1/blog/posts/[id]/schedule.ts",
  "src/pages/api/v1/blog/posts/[id]/submit-review.ts",
  "src/pages/api/v1/blog/posts/index.ts",
  "src/pages/api/v1/blog/search/index.ts",
  "src/pages/api/v1/blog/settings/index.ts",
  "src/pages/api/v1/blog/templates/[id].ts",
  "src/pages/api/v1/blog/templates/index.ts",
  "src/pages/api/v1/blog/terms/[id].ts",
  "src/pages/api/v1/blog/terms/index.ts",
  "src/pages/api/v1/blog/theme/index.ts",
  "src/pages/api/v1/blog/widgets/[id].ts",
  "src/pages/api/v1/blog/widgets/index.ts",
  "src/pages/api/v1/comments/admin/[id]/archive.ts",
  "src/pages/api/v1/comments/admin/[id]/moderate.ts",
  "src/pages/api/v1/comments/admin/[id]/restore.ts",
  "src/pages/api/v1/comments/admin/bulk-moderate.ts",
  "src/pages/api/v1/comments/admin/queue.ts",
  "src/pages/api/v1/comments/admin/settings.ts",
  "src/pages/api/v1/domain-events/consumers/[name]/pause.ts",
  "src/pages/api/v1/domain-events/consumers/[name]/resume.ts",
  "src/pages/api/v1/domain-events/consumers/index.ts",
  "src/pages/api/v1/domain-events/deliveries/[id].ts",
  "src/pages/api/v1/domain-events/deliveries/[id]/replay.ts",
  "src/pages/api/v1/domain-events/deliveries/index.ts",
  "src/pages/api/v1/domain-events/events/[id].ts",
  "src/pages/api/v1/domain-events/events/index.ts",
  "src/pages/api/v1/email/announcements/index.ts",
  "src/pages/api/v1/email/announcements/preview.ts",
  "src/pages/api/v1/email/messages/[id]/cancel.ts",
  "src/pages/api/v1/email/messages/index.ts",
  "src/pages/api/v1/email/suppressions/[id].ts",
  "src/pages/api/v1/email/suppressions/index.ts",
  "src/pages/api/v1/email/templates/[id].ts",
  "src/pages/api/v1/email/templates/[id]/preview.ts",
  "src/pages/api/v1/email/templates/[id]/restore.ts",
  "src/pages/api/v1/email/templates/index.ts",
  "src/pages/api/v1/form-drafts/[id].ts",
  "src/pages/api/v1/form-drafts/[id]/submit.ts",
  "src/pages/api/v1/form-drafts/index.ts",
  "src/pages/api/v1/identity/business-scope/assignments/[id]/revoke.ts",
  "src/pages/api/v1/identity/business-scope/assignments/index.ts",
  "src/pages/api/v1/identity/business-scope/conflicts/index.ts",
  "src/pages/api/v1/identity/business-scope/exceptions/[id]/approve.ts",
  "src/pages/api/v1/identity/business-scope/exceptions/[id]/reject.ts",
  "src/pages/api/v1/identity/business-scope/exceptions/[id]/revoke.ts",
  "src/pages/api/v1/identity/business-scope/exceptions/index.ts",
  "src/pages/api/v1/identity/sso/policy/index.ts",
  "src/pages/api/v1/identity/sso/providers/[id].ts",
  "src/pages/api/v1/identity/sso/providers/index.ts",
  "src/pages/api/v1/logs/audit.ts",
  "src/pages/api/v1/logs/observability/dependency-health.ts",
  "src/pages/api/v1/media/news-images/upload-sessions/[id]/cancel.ts",
  "src/pages/api/v1/media/news-images/upload-sessions/index.ts",
  "src/pages/api/v1/media/objects/[id].ts",
  "src/pages/api/v1/media/objects/[id]/attach.ts",
  "src/pages/api/v1/media/objects/[id]/detach.ts",
  "src/pages/api/v1/media/objects/[id]/purge.ts",
  "src/pages/api/v1/media/objects/[id]/restore.ts",
  "src/pages/api/v1/media/objects/index.ts",
  "src/pages/api/v1/modules/[moduleKey].ts",
  "src/pages/api/v1/modules/[moduleKey]/health.ts",
  "src/pages/api/v1/modules/[moduleKey]/health/check.ts",
  "src/pages/api/v1/modules/[moduleKey]/jobs.ts",
  "src/pages/api/v1/modules/[moduleKey]/permissions.ts",
  "src/pages/api/v1/modules/index.ts",
  "src/pages/api/v1/modules/sync.ts",
  "src/pages/api/v1/navigation/sidebar-config/index.ts",
  "src/pages/api/v1/navigation/sidebar-config/reset.ts",
  "src/pages/api/v1/news-portal/ad-placements/[id].ts",
  "src/pages/api/v1/news-portal/ad-placements/index.ts",
  "src/pages/api/v1/news-portal/homepage-sections/[id].ts",
  "src/pages/api/v1/news-portal/homepage-sections/index.ts",
  "src/pages/api/v1/newsletter/admin/campaigns/[id]/cancel.ts",
  "src/pages/api/v1/newsletter/admin/campaigns/[id]/dispatch.ts",
  "src/pages/api/v1/newsletter/admin/campaigns/[id]/index.ts",
  "src/pages/api/v1/newsletter/admin/campaigns/[id]/preview.ts",
  "src/pages/api/v1/newsletter/admin/campaigns/[id]/reconcile.ts",
  "src/pages/api/v1/newsletter/admin/campaigns/[id]/schedule.ts",
  "src/pages/api/v1/newsletter/admin/campaigns/index.ts",
  "src/pages/api/v1/newsletter/admin/subscribers/[id]/consent.ts",
  "src/pages/api/v1/newsletter/admin/subscribers/index.ts",
  "src/pages/api/v1/newsletter/admin/suppression.ts",
  "src/pages/api/v1/newsletter/admin/topics/[id].ts",
  "src/pages/api/v1/newsletter/admin/topics/index.ts",
  "src/pages/api/v1/permissions/index.ts",
  "src/pages/api/v1/profile-duplicate-candidates/[id]/review.ts",
  "src/pages/api/v1/profile-duplicate-candidates/index.ts",
  "src/pages/api/v1/profile-merge-requests/[id].ts",
  "src/pages/api/v1/profile-merge-requests/[id]/decisions.ts",
  "src/pages/api/v1/profile-merge-requests/[id]/execute.ts",
  "src/pages/api/v1/profile-merge-requests/index.ts",
  "src/pages/api/v1/profiles/[id].ts",
  "src/pages/api/v1/profiles/[id]/addresses/[addressId].ts",
  "src/pages/api/v1/profiles/[id]/addresses/index.ts",
  "src/pages/api/v1/profiles/[id]/channels/[channelId].ts",
  "src/pages/api/v1/profiles/[id]/channels/index.ts",
  "src/pages/api/v1/profiles/[id]/duplicate-candidates/scan.ts",
  "src/pages/api/v1/profiles/[id]/identifiers/[identifierId].ts",
  "src/pages/api/v1/profiles/[id]/identifiers/index.ts",
  "src/pages/api/v1/profiles/[id]/purge.ts",
  "src/pages/api/v1/profiles/[id]/relationships/[relationshipId].ts",
  "src/pages/api/v1/profiles/[id]/relationships/index.ts",
  "src/pages/api/v1/profiles/[id]/restore.ts",
  "src/pages/api/v1/profiles/index.ts",
  "src/pages/api/v1/registration-requests/[id]/approve.ts",
  "src/pages/api/v1/registration-requests/[id]/reject.ts",
  "src/pages/api/v1/registration-requests/index.ts",
  "src/pages/api/v1/reports/access-audit.ts",
  "src/pages/api/v1/reports/email-health.ts",
  "src/pages/api/v1/reports/exports/[id]/disable.ts",
  "src/pages/api/v1/reports/exports/index.ts",
  "src/pages/api/v1/reports/exports/runs.ts",
  "src/pages/api/v1/reports/exports/runs/[id]/download.ts",
  "src/pages/api/v1/reports/exports/trigger.ts",
  "src/pages/api/v1/reports/module-usage.ts",
  "src/pages/api/v1/reports/projections/[key]/index.ts",
  "src/pages/api/v1/reports/projections/[key]/rebuild/cancel.ts",
  "src/pages/api/v1/reports/projections/[key]/rebuild/index.ts",
  "src/pages/api/v1/reports/projections/[key]/reconcile.ts",
  "src/pages/api/v1/reports/projections/index.ts",
  "src/pages/api/v1/reports/sync-health.ts",
  "src/pages/api/v1/reports/tenant-activity.ts",
  "src/pages/api/v1/roles/[id].ts",
  "src/pages/api/v1/roles/index.ts",
  "src/pages/api/v1/seo/config.ts",
  "src/pages/api/v1/seo/not-found/[id].ts",
  "src/pages/api/v1/seo/not-found/index.ts",
  "src/pages/api/v1/seo/redirects/[id].ts",
  "src/pages/api/v1/seo/redirects/[id]/lifecycle.ts",
  "src/pages/api/v1/seo/redirects/capture-url-change.ts",
  "src/pages/api/v1/seo/redirects/import.ts",
  "src/pages/api/v1/seo/redirects/index.ts",
  "src/pages/api/v1/seo/redirects/settings.ts",
  "src/pages/api/v1/seo/redirects/validate.ts",
  "src/pages/api/v1/settings/index.ts",
  "src/pages/api/v1/site-search/index/failures.ts",
  "src/pages/api/v1/site-search/index/rebuild.ts",
  "src/pages/api/v1/site-search/index/reconcile.ts",
  "src/pages/api/v1/site-search/index/status.ts",
  "src/pages/api/v1/site-search/settings.ts",
  "src/pages/api/v1/social-publishing/accounts/[id].ts",
  "src/pages/api/v1/social-publishing/accounts/[id]/disconnect.ts",
  "src/pages/api/v1/social-publishing/accounts/[id]/verify.ts",
  "src/pages/api/v1/social-publishing/accounts/index.ts",
  "src/pages/api/v1/social-publishing/jobs/[id].ts",
  "src/pages/api/v1/social-publishing/jobs/[id]/approve.ts",
  "src/pages/api/v1/social-publishing/jobs/[id]/cancel.ts",
  "src/pages/api/v1/social-publishing/jobs/[id]/retry.ts",
  "src/pages/api/v1/social-publishing/jobs/index.ts",
  "src/pages/api/v1/social-publishing/rules/[id].ts",
  "src/pages/api/v1/social-publishing/rules/index.ts",
  "src/pages/api/v1/social-publishing/settings/index.ts",
  "src/pages/api/v1/social-publishing/templates/[id].ts",
  "src/pages/api/v1/social-publishing/templates/index.ts",
  "src/pages/api/v1/sync/conflicts/[id]/resolve.ts",
  "src/pages/api/v1/sync/conflicts/index.ts",
  "src/pages/api/v1/sync/nodes/[id].ts",
  "src/pages/api/v1/sync/nodes/index.ts",
  "src/pages/api/v1/sync/object-queue/[id]/retry.ts",
  "src/pages/api/v1/sync/object-queue/index.ts",
  "src/pages/api/v1/sync/objects/index.ts",
  "src/pages/api/v1/sync/objects/status.ts",
  "src/pages/api/v1/sync/pull.ts",
  "src/pages/api/v1/sync/push.ts",
  "src/pages/api/v1/sync/status.ts",
  "src/pages/api/v1/tenant/domains/[id].ts",
  "src/pages/api/v1/tenant/domains/[id]/set-primary.ts",
  "src/pages/api/v1/tenant/domains/[id]/verify.ts",
  "src/pages/api/v1/tenant/domains/index.ts",
  "src/pages/api/v1/tenant/modules/[moduleKey]/disable.ts",
  "src/pages/api/v1/tenant/modules/[moduleKey]/enable.ts",
  "src/pages/api/v1/tenant/modules/[moduleKey]/settings.ts",
  "src/pages/api/v1/tenant/modules/index.ts",
  "src/pages/api/v1/theming/draft.ts",
  "src/pages/api/v1/theming/index.ts",
  "src/pages/api/v1/theming/preview.ts",
  "src/pages/api/v1/theming/publish.ts",
  "src/pages/api/v1/theming/retire.ts",
  "src/pages/api/v1/theming/rollback.ts",
  "src/pages/api/v1/theming/validate.ts",
  "src/pages/api/v1/users/[id].ts",
  "src/pages/api/v1/users/index.ts"
];

async function* walk(directory: string): AsyncGenerator<string> {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      yield* walk(full);
      continue;
    }

    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      yield full;
    }
  }
}

/**
 * Comment lines are documentation, and documentation legitimately names
 * `withTenant(` in prose — this file's own header does, and so do several
 * route headers explaining why they use the factory. Same heuristic, and
 * same reasoning, as `http-method-check.ts`: the cost of missing a call
 * hidden inside a comment is zero.
 */
export function callsWithTenantDirectly(source: string): boolean {
  return source.split("\n").some((line) => {
    const trimmed = line.trimStart();

    if (
      trimmed.startsWith("*") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*")
    ) {
      return false;
    }

    return WITH_TENANT_CALL_PATTERN.test(line);
  });
}

export type TenantRouteMigrationResult = {
  /** Routes calling `withTenant` directly that are NOT on the allowlist — a newly hand-rolled opening. */
  unlisted: string[];
  /** Allowlist entries that no longer call `withTenant` directly — the list must only shrink. */
  stale: string[];
};

/** Pure over already-read file contents, so both failure directions can be unit tested without a synthetic file tree. */
export function evaluateTenantRouteMigration(
  files: readonly { path: string; content: string }[],
  allowlist: readonly string[]
): TenantRouteMigrationResult {
  const allowed = new Set(allowlist);
  const unlisted: string[] = [];
  const stillDirect = new Set<string>();

  for (const file of files) {
    if (!callsWithTenantDirectly(file.content)) {
      continue;
    }

    if (allowed.has(file.path)) {
      stillDirect.add(file.path);
      continue;
    }

    unlisted.push(file.path);
  }

  return {
    unlisted,
    stale: allowlist.filter((entry) => !stillDirect.has(entry))
  };
}

async function main(): Promise<void> {
  const files: { path: string; content: string }[] = [];

  for await (const file of walk(ROUTES_ROOT)) {
    files.push({
      path: file.split(path.sep).join("/"),
      content: await Bun.file(file).text()
    });
  }

  // `ROUTES_ROOT` is repo-relative (same idiom as `http-method-check.ts`), so
  // a run from the wrong working directory would walk nothing and report a
  // cheerful, meaningless OK. A gate that passes having scanned zero files is
  // worse than no gate — this repo has already shipped one dead-but-healthy
  // -looking check (#359/#361).
  if (files.length === 0) {
    console.error(
      `api:tenant-route:check GAGAL — scanned 0 files under ${ROUTES_ROOT}. ` +
        "Run this from the repository root."
    );
    process.exit(1);
  }

  const { unlisted, stale } = evaluateTenantRouteMigration(
    files,
    NOT_YET_MIGRATED
  );

  if (unlisted.length === 0 && stale.length === 0) {
    console.log(
      `api:tenant-route:check OK — every route under ${ROUTES_ROOT} either uses defineTenantRoute ` +
        `or is one of the ${NOT_YET_MIGRATED.length} routes still queued for migration (Issue #370).`
    );
    process.exit(0);
  }

  for (const file of unlisted) {
    console.error(
      `${file} — calls withTenant() directly. New routes must use defineTenantRoute ` +
        "(src/modules/_shared/tenant-route.ts), which carries the tenant/token guards, the " +
        "guard chain, and a REQUIRED work class. Do not add this file to NOT_YET_MIGRATED."
    );
  }

  for (const file of stale) {
    console.error(
      `${file} — listed in NOT_YET_MIGRATED but no longer calls withTenant() directly ` +
        "(migrated or deleted). Delete the line: the list may only shrink."
    );
  }

  console.error(
    `\napi:tenant-route:check GAGAL — ${unlisted.length} rute belum lewat factory, ` +
      `${stale.length} entri allowlist basi.`
  );

  process.exit(1);
}

if (import.meta.main) {
  await main();
}

/**
 * Cross-file mutual exclusion for the E2E specs that repoint the GLOBAL
 * `awcms_micro_setup_state` singleton — the one row that drives localhost
 * default-tenant resolution for the public discovery/syndication/search/theming
 * routes (steps 2-4 of `resolvePublicTenantFromRequest`; the E2E server runs
 * WITHOUT `PUBLIC_TENANT_RESOLUTION_MODE=host_default`, so those routes fall
 * through to `awcms_micro_setup_state.tenant_id` for a `localhost` request).
 *
 * Six spec files repoint that singleton at their own freshly-seeded tenant and
 * then assert on what `localhost` serves: `seo-discovery-smoke`,
 * `seo-redirect-smoke`, `newsletter-smoke`, `comments-smoke`,
 * `site-search-smoke`, and `theming-preview`. Playwright runs spec FILES in
 * parallel (`fullyParallel: true`); `test.describe.configure({ mode: "serial" })`
 * only serializes tests WITHIN a file and does nothing across files. So a
 * sibling spec's repoint can land between this spec's seed and its HTTP request,
 * and the public route then resolves the WRONG tenant — an empty
 * sitemap/feed/search response and an intermittent, diff-unrelated failure
 * (observed as `seo-discovery-smoke`'s "sitemap … with the published URL"
 * returning an empty `<urlset>`).
 *
 * A Postgres SESSION-level advisory lock on a dedicated reserved connection,
 * acquired before seeding and held until after the file's last test, makes those
 * six specs MUTUALLY EXCLUSIVE while leaving the rest of the suite parallel.
 * Session-level (not `pg_advisory_xact_lock`, which releases at the next COMMIT)
 * because ownership must span many HTTP round-trips i.e. many transactions;
 * blocking `pg_advisory_lock` (not `pg_try_advisory_lock`) so each waiting spec
 * simply queues for its turn. Mirrors `src/lib/jobs/advisory-lock.ts`, which
 * documents the same reserve-hold-release discipline.
 */

/**
 * A private `(namespace, key)` pair shared by every setup_state-owning spec —
 * two-int form so it never collides with the job runner's own single-int
 * advisory locks. The values are arbitrary but must stay STABLE (all six specs
 * must hash to the same lock) and identical across specs.
 */
const SETUP_STATE_LOCK_NAMESPACE = 0x5e795e7; // "seo/seed" — E2E setup_state ownership
const SETUP_STATE_LOCK_KEY = 1;

export type SetupStateOwnership = {
  /**
   * Release the advisory lock and return the reserved connection to the pool,
   * then close it. Idempotent — safe to call from `afterAll` even if a later
   * step already released it.
   */
  release: () => Promise<void>;
};

/**
 * Acquire exclusive ownership of the `awcms_micro_setup_state` singleton for the
 * calling spec file. BLOCKS until any other setup_state-owning spec releases, so
 * call it at the TOP of `beforeAll` (before seeding) and call `release()` at the
 * END of `afterAll` (after cleanup). `seedUrl` is the PRIVILEGED (superuser)
 * `E2E_SEED_DATABASE_URL`, same connection the spec seeds with.
 */
export async function acquireSetupStateOwnership(
  seedUrl: string
): Promise<SetupStateOwnership> {
  const sql = new Bun.SQL(seedUrl);
  const reserved = await sql.reserve();

  try {
    await reserved`
      SELECT pg_advisory_lock(${SETUP_STATE_LOCK_NAMESPACE}, ${SETUP_STATE_LOCK_KEY})
    `;
  } catch (error) {
    reserved.release();
    await sql.end();
    throw error;
  }

  let released = false;

  return {
    async release(): Promise<void> {
      if (released) {
        return;
      }
      released = true;

      try {
        await reserved`
          SELECT pg_advisory_unlock(${SETUP_STATE_LOCK_NAMESPACE}, ${SETUP_STATE_LOCK_KEY})
        `;
      } finally {
        reserved.release();
        await sql.end();
      }
    }
  };
}

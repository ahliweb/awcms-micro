---
"awcms-micro": patch
---

test: make the shared database client independent of test file order

`getDatabaseClient()` memoizes its pool for the whole `bun test` process. A unit
test that reached the tenant-route factory while `DATABASE_URL` still held the
privileged migration-owner URL pinned a superuser pool, so every later
RLS-isolation test ran as a role RLS does not apply to and failed or passed on
file order alone. The unit test now always uses an unused sentinel URL and drops
its pool, and the integration harness drops the memoized pool of a kind whenever
it repoints that role's URL (new test seam `resetDatabaseClientsForTests`, never
called by production code). The backup/restore drill hooks also get a 60s
timeout: `DROP DATABASE` forces a checkpoint that exceeded the 5s default on a
busy runner. No RLS or authorization assertion was weakened or skipped.

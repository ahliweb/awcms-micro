---
"awcms-micro": patch
---

fix(tests): skip the backup/restore drill when the PostgreSQL client is absent, instead of failing the whole file (#293)

`backup-restore-drill.integration.test.ts` probes `psql`/`pg_dump` at module-load
time to decide whether the client is version-compatible with the server, and is
explicitly designed to **skip** when it is not ("this is an environment
constraint, not a code defect"). But `Bun.spawnSync` **throws** `ENOENT` when the
executable is absent entirely rather than returning a failed result — so version
_mismatch_ was handled while version _absence_ took the whole file down as an
unhandled error.

Found running `production:preflight` against a live deployment target: the `test`
stage runs in a minimal runtime container (Bun, no PostgreSQL client binaries),
so this single file was the last thing standing between a real target and a green
preflight — 4718 pass, 1 fail, and the one failure was `psql` simply not being
installed.

The runtime counterpart of this probe
(`src/lib/resilience/scenarios/backup-restore-drill.ts`) already guards the
identical call with its own `trySpawnSync`; only the test-side copy was missing
it, so this restores parity rather than introducing a new convention. With the
fix the file reports **8 skip / 0 fail** on a machine without `psql`, versus
**1 fail / 1 error** before.

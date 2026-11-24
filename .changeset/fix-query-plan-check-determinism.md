---
"awcms-micro": patch
---

fix(performance): make the query-plan budget check independent of autovacuum timing and table residue

`performance:query-plan:check` failed `audit-events-tenant-activity-reporting`
(Seq Scan, cost 740) in CI. The app role the check runs as can neither VACUUM
nor ANALYZE, and the fixture reset can only `DELETE`, so the heap kept dead
space and earlier steps' rows; heap-bound plans are costed by page count, so the
same query planned as Seq Scan, Bitmap Heap Scan or Index Only Scan (cost 171
to 3688 locally) depending on whether autovacuum had run. The script now runs
one `VACUUM (FULL, ANALYZE)` through an opt-in
`QUERY_PLAN_MAINTENANCE_DATABASE_URL` (held to the same non-production guard;
CI passes the migration owner), after which the cost is identical run after run
(554.2). No budget, ceiling or forbidden node type was changed.

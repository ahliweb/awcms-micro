---
"awcms-micro": patch
---

Fix a database connection-pool leak that saturated the `interactive` work-class and made `/admin/*` return `503 DATABASE_BUSY`. Several code paths ran multiple queries on a single `withTenant` transaction connection concurrently via `Promise.all([...])`. `tx` is one reserved Postgres connection — firing concurrent queries on it desyncs the connection, leaving the transaction stuck `idle in transaction` (COMMIT never sent), which holds the connection and its work-class slot forever (`statement_timeout` can't reap an idle-in-transaction session). Because `fetchSidebarArrangement` runs on every admin render (AdminLayout), it exhausted all 8 `interactive` slots in production (8 sessions stuck idle-in-transaction for ~22 min).

- Serialized the concurrent-on-one-`tx` queries (await sequentially) across all affected modules: sidebar-menu, seo-distribution (discovery + metadata), site-search diagnostics, business-scope assignment, module-matrix, visitor-analytics (rollup + summary), blog admin pages + menus API, theming API, analytics devices API, and seo discovery providers. Identical queries/order/results — only execution is serialized.
- Defense-in-depth: `getDatabaseClient()` now sets `idle_in_transaction_session_timeout` (new `DATABASE_IDLE_IN_TXN_TIMEOUT_MS`, default 30000ms) so any future such leak self-heals instead of permanently saturating the pool.
- Documented the rule in `docs/awcms-micro/database-pooling.md` §9 (never `Promise.all` multiple queries on one `tx`).

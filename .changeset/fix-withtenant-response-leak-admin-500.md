---
"awcms-micro": patch
---

Fix admin pages returning HTTP 500 under database pool saturation. `withTenant()`'s pool-gate fallback returns a `503 DATABASE_BUSY` `Response` cast to its generic `T` — correct for API routes (which return it to the client), but SSR renders and `resolveSsrContext` call `withTenant` with `T` being a plain data object. Under saturation/circuit-open those callers received a truthy `Response` instead of their data, which their `try/catch` did not catch, so the template then crashed (`context.permissions.has(...)` on a `Response`, `Response.types.map(...)`) → 500 on `/admin/*`.

- New opt-in `withTenant` option `unavailableBehavior: "throw"` (default `"response"` preserves API-route behavior) makes the three pool-gate fallbacks throw the new exported `DatabaseUnavailableError` (carrying `retryAfterSeconds`) instead of returning a `Response`.
- `resolveSsrContext` now surfaces the leaked `Response` and the middleware serves it as a proper 503 (with `Retry-After`) rather than storing it as `Astro.locals.ssrContext` — the session may be valid, the DB is just busy, so a `/login` bounce would be misleading.
- All 14 SSR render call sites (AdminLayout + 10 admin pages) pass `unavailableBehavior: "throw"`, so their existing `try/catch` degrades gracefully (fallback nav / `loadError` notice) under saturation instead of 500ing.
- Regression tests cover all three fallback paths throwing `DatabaseUnavailableError` for non-Response callers.

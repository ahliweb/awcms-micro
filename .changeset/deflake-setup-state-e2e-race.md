---
"awcms-micro": patch
---

Fix an intermittent E2E failure (`seo-discovery-smoke`: "sitemap … with the published URL" returning an empty `<urlset>`) caused by a cross-file race on the global `awcms_micro_setup_state` singleton.

Six public-content smoke specs (`seo-discovery-smoke`, `seo-redirect-smoke`, `newsletter-smoke`, `comments-smoke`, `site-search-smoke`, `theming-preview`) each repoint that one singleton — which drives localhost default-tenant resolution — at their own freshly-seeded tenant, then assert on what localhost serves. Under Playwright's `fullyParallel: true` those files run concurrently, so a sibling's repoint could land between a spec's seed and its HTTP request and the public route would resolve the wrong tenant (`test.describe.configure({ mode: "serial" })` only serializes within a file). A new `tests/e2e/helpers/setup-state-ownership.ts` holds a Postgres session-level advisory lock (mirroring `src/lib/jobs/advisory-lock.ts`) for each such spec's lifetime, making them mutually exclusive while leaving the rest of the suite parallel. Test-only change — no runtime code affected.

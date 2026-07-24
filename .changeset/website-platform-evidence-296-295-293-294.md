---
"awcms-micro": patch
---

Advance the website-platform production-proof issues (#293–#296, epic #261) with in-repo automation + measured real-infra evidence.

- **#296** — add `tests/e2e/public-link-crawl.e2e.ts`: a hermetic rendered-site internal-link crawl over the public entry pages (fetch each page, extract same-origin `<a href>`, assert all resolve < 400). Complements the handler-level `public-link-integrity.integration.test.ts`.
- **#295** — add `tests/e2e/public-web-vitals.e2e.ts`: a lab Core Web Vitals regression gate measuring LCP + CLS in Chromium (via `PerformanceObserver`) against the Google "good" thresholds on the hermetic public pages.
- **#293** — record live-edge deployment evidence (dinkes-prod): TLS (Let's Encrypt), HSTS, strict CSP (no `unsafe-inline`), X-Frame-Options/nosniff/Referrer-Policy/Permissions-Policy verified on the live edge; durable R2 configured; a found config gap (apex serves generic robots.txt, sitemap/feeds 404 — tenant-by-host resolution unmapped).
- **#294** — record a measured backup/restore drill against live prod PG (backup ≈1.7 s/708 KB, restore ≈6.3 s, data-faithful → RPO 0 at dump instant) and a critical gap: **0 scheduled Coolify backups → RPO currently unbounded**.

Docs: `website-platform-e2e-evidence.md` §Deferred and `resilience-dr-verification.md` §RTO/RPO updated with the above; `awcms-micro-browser-test` + `awcms-micro-performance` skills note the new specs. No app/runtime code changed.

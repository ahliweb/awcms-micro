---
"awcms-micro": patch
---

Add automated axe-core accessibility coverage over the public rendered content-reading templates (Issue #296, epic #261 website-platform).

`tests/e2e/public-content-a11y.e2e.ts` seeds a tenant with a published EN post and a published ID post — the same proven seed shape as `seo-discovery-smoke` (tenant + verified primary domain + `awcms_micro_setup_state` singleton, holding the shared `setup-state-ownership` cross-file advisory lock) — then runs axe-core (WCAG 2.2 A/AA, failing on any critical/serious violation) over BOTH the tenant-code-free `/news/{slug}` route and the `/blog/{tenantCode}/{slug}` route, in English and Indonesian (the rendered `<html lang>` is the article's own `locale`) at desktop (1280×800) and mobile (390×844) viewports. This closes the `public-a11y-smoke` deferred item "axe over the rendered content-reading templates (`/news`, `/blog` article pages)"; the screen-reader pass and the full pilot-site journey remain deferred (manual). Evidence matrix updated.

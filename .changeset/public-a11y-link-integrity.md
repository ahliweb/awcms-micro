---
"awcms-micro": patch
---

Advance website-platform evidence for #296 (epic #261): add public-surface accessibility (axe-core, EN + ID) Playwright smoke and an automated link-integrity integration test (sitemap URLs, canonical/hreflang/feed links all resolve; unpublished content stays out of the sitemap and 404s). Closes the in-repo, base-app portion of #296's "public-journey accessibility + automated link checking" that per-module suites did not cover; the derived-pilot-site full journey and full device/SR matrix remain tracked on #296. Tests-only; no application contract, schema, endpoint, or runtime-behavior change.

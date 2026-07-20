---
"awcms-micro": patch
---

Advance website-platform evidence for #296 (epic #261): add public-surface accessibility (axe-core, EN + ID) Playwright smoke and an automated link-integrity integration test (sitemap `<loc>` URLs, canonical, hreflang, and the `robots.txt` `Sitemap:` line all resolve; unpublished content stays out of the sitemap and 404s). The a11y smoke caught a real WCAG 2.2 AA 2.5.8 (Target Size) violation on the foundation homepage — fixed by giving `src/pages/index.astro`'s links a ≥24px touch target + spacing. Closes the in-repo, base-app portion of #296's public-journey accessibility + automated link checking; the derived-pilot-site full journey and full device/screen-reader matrix remain tracked on #296.

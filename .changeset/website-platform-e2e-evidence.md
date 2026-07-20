---
"awcms-micro": patch
---

Add integrated cross-feature website-platform evidence suites and evidence matrix (Issue #273, epic #261). Three new PostgreSQL integration suites prove tenant/domain/locale isolation across public+admin surfaces, public security headers/CSP + anti-enumeration + open-redirect/host-poisoning controls, and SEO/JSON-LD/sitemap/feed/robots/ETag validity plus published-only idempotent search — the "proven together" evidence per-module suites structurally cannot provide. Adds `docs/awcms-micro/website-platform-e2e-evidence.md` mapping every epic/#273 acceptance criterion to its test/command, and honestly marks the external derived-site pilot, deployment, measured RTO/RPO, CWV, and base-upgrade-rehearsal criteria as deferred to their own atomic issues. Tests-only + docs; no application contract, schema, endpoint, or runtime-behavior change.

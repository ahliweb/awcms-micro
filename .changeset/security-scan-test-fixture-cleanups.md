---
"awcms-micro": patch
---

Security-scan triage: two test-fixture cleanups with no runtime behavior change.

- CodeQL `js/unused-local-variable` (#291): drop the dead `MEDIA_PERMISSIONS` import from `tests/modules/news-portal-module.test.ts`. Its parity assertion moved to `media-library-module.test.ts` under ADR-0026 step 2; the remaining media-absence test filters by `activityCode === "media"` and never needs the constant.
- Secret-scanning #1 (Telegram Bot Token): replace the canonical public Telegram-docs example token — a shape fixture for `looksLikeRawSecretToken`, never a live credential — with an inert synthetic value of the same `\d{6,10}:[A-Za-z0-9_-]{30,45}` shape. Alert resolved as `used_in_tests`.

The remaining open code-scanning alerts (283–290) were confirmed CodeQL false positives and dismissed via the API per the `awcms-micro-codeql-triage` catalog; no code change was warranted.

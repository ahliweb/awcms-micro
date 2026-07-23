---
"awcms-micro": patch
---

Advance the website-platform evidence trail (epic #261) — test + docs only, no runtime behavior change:

- **#296 (accessibility)** — the public a11y smoke (`public-a11y-smoke.e2e.ts`) now runs its axe-core scans across a **desktop (1280×800) + mobile (390×844) device matrix**, not desktop-only, so viewport-dependent WCAG 2.2 AA rules (`target-size`, reflow, breakpoint contrast) are covered on every hermetic public page in EN + ID.
- **#293 (deployment rehearsal)** — `website-platform-e2e-evidence.md` §Deferred work now records the **partial real-infra evidence** produced by the dinkes-prod deployment (production image builds + boots on Coolify against internal PostgreSQL, migrations applied with the DB secret kept server-side, R2 durable storage configured, live edge reachable over TLS) with the exact criteria still pending operator sign-off.

---
"awcms-micro": patch
---

Sync docs, config registry, and agent/skills with the connection-pool fixes (#323/#324). Register the new `DATABASE_IDLE_IN_TXN_TIMEOUT_MS` env var in `src/lib/config/registry.ts` + `.env.example` + doc 18 (three-way config-docs parity), document the "never `Promise.all` multiple queries on one `withTenant` `tx`" rule and the `unavailableBehavior: "throw"` requirement for non-Response callers in doc 16 and `database-pooling.md` §9, add the idle-in-transaction leak diagnosis to the capacity runbook's saturation SOP, and add the anti-pattern to the coder/reviewer agent checklists and the new-endpoint/performance skills.

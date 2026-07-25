---
"awcms-micro": patch
---

fix(preflight): never hand the deployment target's `DATABASE_URL` to the `test` stage; add INP to the lab CWV gate (#293, #295)

`bun run production:preflight` documented every stage as read-only, but the
`test` stage spawned `bun test` with the ambient environment inherited. The
invocation its own runbooks prescribe —
`APP_ENV=production DATABASE_URL=<target> bun run production:preflight` —
therefore enabled the integration suite against the deployment target, and that
suite `TRUNCATE`s every `awcms_micro_*` table (`resetDatabase()`, 113 files) and
runs `ALTER ROLE ... WITH LOGIN PASSWORD '<fixture literal committed in this
repo>'` for the `awcms_micro_app`/`_worker`/`_setup` roles. Running the
documented preflight would have wiped the target and weakened its role
credentials.

The new pure `planTestStage` gate never forwards the target DSN to `bun test`.
Real integration coverage is opted into with a **disposable**
`PREFLIGHT_TEST_DATABASE_URL` (a DSN equal to the target is refused); without
it the stage runs unit-only with `DATABASE_URL` removed from the child
environment and reports `SKIP` — now a blocking skip under
`APP_ENV=production`, so it cannot silently claim coverage for ~1000 tests that
never ran.

Also extends `tests/e2e/public-web-vitals.e2e.ts` from LCP+CLS to **LCP+CLS+INP**
(Google "good" budget, 200 ms). The spec drives its own non-navigating
interactions and separately counts dispatched `pointerdown`/`keydown` events, so
an `inp: 0` reading (legitimate below Event Timing's 16 ms `durationThreshold`
floor) can never be mistaken for a page that swallowed every interaction.

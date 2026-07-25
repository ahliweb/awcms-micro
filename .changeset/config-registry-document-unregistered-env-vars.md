---
"awcms-micro": patch
---

config: register the twenty environment variables the application already read but never documented

`src/lib/config/registry.ts` calls itself the "single source of truth for every
environment variable this application reads", and `bun run config:docs:check`
enforces that the registry, `.env.example`, and doc 18 agree. But that gate
compares three surfaces against each other — it never scans the code — so a
variable missing from all three was invisible to it. Twenty were: the comments
module's `COMMENTS_TIMING_SECRET`/`COMMENTS_SUBSCRIBER_ENCRYPTION_KEY`/
`COMMENTS_RETENTION_DAYS`, newsletter's three equivalents, site search's four
rate-limit knobs, the seven Redis readiness variables, and
`PREFLIGHT_TEST_DATABASE_URL` (the disposable-database DSN a production
preflight needs, without which its `test` stage skips and blocks go-live).

Every one is now registered with its real type, requirement, owner module,
sensitivity, and default, and documented in `.env.example` + doc 18 §Comments /
§Newsletter / §Site search / §Redis / §Preflight tooling — including what each
one costs when left unset, which is the part an operator actually needs: three
of them fail closed (an address stored unresolvable, a callback refused, a
notification never sent) rather than failing loudly.

Six more variables are recorded as explicit `CONFIG_EXEMPTIONS` because they are
not application configuration at all: `PATH`, the CI-only
`CHANGESET_POLICY_BASE_REF`/`RELEASE_TAG_REF`, and the container-level
`REDIS_PASSWORD`/`REDIS_MAXMEMORY`/`REDIS_MAXMEMORY_POLICY`.

Registry metadata only — no validation behavior changes, no boot-time
enforcement added.

---
name: backend-services
description: Backend services for AWCMS-Micro and EmDash plugins/APIs. Use when implementing API routes, service layers, route handlers, plugin hooks, auth/RBAC/ABAC, serializers, storage, queues, Cloudflare Workers runtime behavior, or server-side integration.
---

# Backend Services

Use this skill for backend implementation in AWCMS-Micro plugins, EmDash-compatible services, API routes, hooks, and Cloudflare/Node runtime integration.

## Priority Sources

Prefer the local Claude/EmDash skill and repository guidance in this order:

1. `awcmsmicro-dev/AGENTS.md` for EmDash backend route, handler, auth, CSRF, pagination, error, storage, caching, and environment rules.
2. `awcmsmicro-dev/skills/creating-plugins/SKILL.md` for plugin descriptors, `definePlugin()`, hooks, routes, capabilities, sandboxed/trusted execution, storage, KV, and publishing constraints.
3. `awcmsmicro-dev/skills/emdash-cli/SKILL.md` for operational CLI behavior around schema, content, seed export, media, and automation.
4. Root `AGENTS.md`, `docs/awcms-micro-implementation-boundaries.md`, and project governance docs for downstream boundaries.
5. Cloudflare Workers docs/skills when changing Workers runtime, bindings, Durable Objects, Queues, D1, R2, or Wrangler config.

## Boundary Rules

- Keep AWCMS-Micro product behavior inside approved plugin/template boundaries.
- Do not add SIKESRA-specific or project-specific behavior to EmDash core unless an issue explicitly justifies upstream work.
- Use patch overlays only for narrow downstream source-level overrides that must survive rebuilds.
- Record active patch overlays in `docs/upstream-sync/DIVERGENCE_LOG.md`.

## API And Handler Rules

- Keep route files thin; put business logic in service/handler layers.
- Return typed result envelopes where the target project already uses them.
- Do not expose raw `error.message` to clients. Map failures to stable error codes and safe messages.
- Never add `GET` handlers for state-changing operations.
- State-changing admin/API calls must respect EmDash CSRF expectations such as `X-EmDash-Request: 1` where applicable.
- List endpoints should return `{ items, nextCursor? }`, not bare arrays, unless the existing contract says otherwise.

## Auth And Security

- Use trusted EmDash identity from request/session context; do not trust client-provided identity headers for authorization decisions.
- Use permission/capability checks rather than role-string shortcuts where the codebase provides permission helpers.
- Keep public APIs aggregate-only and public-safe for sensitive domains like SIKESRA.
- Validate request bodies with schemas; do not cast `request.json()` directly into trusted types.
- For plugin sandbox compatibility, avoid Node built-ins in code that must run inside isolates.

## Integration Rules

- Connect UI, API routes, service layer, serializers, and database/repository layer through typed contracts.
- Keep serializers responsible for public-safe masking and response shape stability.
- Prefer Web APIs and platform bindings that work in both Cloudflare and Node targets when the feature must be portable.

## Verification

Use the closest relevant checks:

- `pnpm typecheck`
- package/plugin-specific `pnpm test`
- route-focused Vitest filters where available
- `bash scripts/validate-awcmsmicro-boundaries.sh` for rebuild safety
- SIKESRA: `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync`

import type { APIContext, APIRoute, AstroCookies } from "astro";

import { fail } from "./api-response";
import type { BusinessScopeHierarchyPort } from "./ports/business-scope-hierarchy-port";
import { hashSessionToken } from "../../lib/auth/session-token";
import { getDatabaseClient } from "../../lib/database/client";
import { withTenant } from "../../lib/database/tenant-context";
import type { WorkClass } from "../../lib/database/work-class";
import {
  authorizeInTransaction,
  resolveAuthInputs,
  type AuthorizeResult
} from "../identity-access/application/access-guard";
import type { AccessRequest } from "../identity-access/domain/access-control";

/**
 * `defineTenantRoute` (Issue #370) — the ONE place the auth/tenant opening
 * that 201 of 260 `src/pages/api` routes copy verbatim is written down:
 *
 * ```
 * resolveAuthInputs → tenantId? (400 TENANT_REQUIRED) → token? (401 AUTH_REQUIRED)
 *   → getDatabaseClient → hashSessionToken → withTenant(workClass, unavailableBehavior)
 *   → authorizeInTransaction → short-circuit auth.denied → handler
 * ```
 *
 * ## Why a factory and not "just a helper"
 *
 * The repo's two worst incidents were both "fix one concept in many
 * places". #323 (`withTenant` leaking its 503 `Response` into non-`Response`
 * callers) and #324 (`Promise.all` over one `tx` leaking work-class slots,
 * **16** edit sites) were expensive precisely because the opening was
 * duplicated: "did every site get it?" could only be answered by grep, never
 * by the type checker. Everything below is stated once so the next such fix
 * is a one-file diff.
 *
 * ## `workClass` is REQUIRED, deliberately
 *
 * `withTenant`'s own `workClass` is optional and defaults to `"interactive"`.
 * That default is how 221 of 241 registered routes ended up in the same pool
 * budget as login (`docs/awcms-micro/work-class-registry.generated.json`,
 * `source: "default"`) — nobody ever *decided* it. Here it has no default:
 * omitting it is a compile error, so every migrated route carries a written,
 * reviewable classification. Re-affirming `"interactive"` is a perfectly good
 * answer; leaving it unsaid is not.
 *
 * ## `unavailableBehavior` is hard-coded to `"response"`, deliberately
 *
 * A route built by this factory is a `Response` caller by construction: the
 * factory itself is what returns `withTenant`'s result to Astro, and the
 * generic is pinned to `Response` below. `"response"` is therefore the
 * CORRECT setting — the 503 `DATABASE_BUSY` (with `Retry-After`) that
 * `withTenant` synthesizes under breaker-open / queue-full / saturation IS
 * the reply the client should get. It is passed explicitly rather than
 * inherited from the default so the #323 question ("is this caller
 * Response-shaped?") is answered in the code, not by omission.
 *
 * It is intentionally NOT configurable. `"throw"` exists for NON-`Response`
 * callers (SSR frontmatter, `resolveSsrContext`) that must catch
 * `DatabaseUnavailableError` and degrade; letting a route opt into it here
 * would let that error escape into Astro's error handler and turn a
 * controlled 503 into a 500 — exactly the #323 failure mode with the arrow
 * reversed. Non-`Response` callers must call `withTenant` directly with
 * `{ unavailableBehavior: "throw" }`; they are not routes.
 */

/** Everything available BEFORE the transaction opens. */
export type TenantRouteRequestContext = {
  request: Request;
  cookies: AstroCookies;
  url: URL;
  params: APIContext["params"];
  locals: APIContext["locals"];
  /** Already validated non-null (a missing one produced `400 TENANT_REQUIRED`). */
  tenantId: string;
  /** One clock for the whole request — the same instant the guard chain sees. */
  now: Date;
};

/** The `allowed: true` half of {@link AuthorizeResult} — `auth.context.tenantUserId` reads exactly as it does in a hand-written route. */
export type AuthorizedAccess = Extract<AuthorizeResult, { allowed: true }>;

export type TenantRouteHandlerContext<TPrepared> = TenantRouteRequestContext & {
  /**
   * The tenant transaction, with `app.current_tenant_id` already set.
   *
   * **`tx` IS ONE RESERVED CONNECTION. NEVER run two queries on it
   * concurrently** — no `Promise.all([qA(tx), qB(tx)])`, no
   * `Promise.all(items.map((item) => q(tx, item)))`. Concurrent queries
   * desync the connection, Bun.SQL never sends `COMMIT`, and the session
   * is stranded `idle in transaction` holding its work-class slot forever
   * → pool saturation → `503 DATABASE_BUSY` for everyone (Issue #324, 16
   * sites; `docs/awcms-micro/database-pooling.md` §9). `await` each query
   * in sequence, or use a plain `for` loop.
   */
  tx: Bun.TransactionSQL;
  /** Already narrowed to allowed — a deny was returned before `handler` ran. */
  auth: AuthorizedAccess;
  /** Whatever `prepare` returned (`undefined` when there is no `prepare`). */
  prepared: TPrepared;
};

export type TenantRouteConfig<TPrepared> = {
  /**
   * REQUIRED — no default. See this file's header: the whole point of the
   * factory is that 221 implicit `"interactive"` classifications become
   * written ones. `scripts/work-class-registry-generate.ts` reads this
   * literal and records the route as `source: "explicit"`.
   */
  workClass: WorkClass;
  /** Forwarded verbatim to `withTenant` (defaults to its own 2000ms). */
  queueTimeoutMs?: number;
  /**
   * The ABAC guard. A plain `AccessRequest` for the usual static case, or a
   * function when the guard depends on what `prepare` parsed (e.g. an
   * action that differs by request body).
   *
   * INFERENCE ORDER, when you use the callback form: write `prepare` BEFORE
   * `authorize` in the object literal. TypeScript infers `TPrepared` from
   * object-literal properties in source order, and an unannotated
   * `authorize` callback appearing first pins `TPrepared` to its default
   * (`undefined`) before `prepare` is ever looked at — the symptom is
   * "`prepare` is not assignable to `... => Response | undefined`", not a
   * silent wrong type.
   */
  authorize:
    | AccessRequest
    | ((
        context: TenantRouteRequestContext & { prepared: TPrepared }
      ) => AccessRequest);
  /** Forwarded verbatim to `authorizeInTransaction` (hierarchy-aware SoD matching, Issue #802). */
  authorizeOptions?: { hierarchyPort?: BusinessScopeHierarchyPort };
  /**
   * Runs AFTER the tenant/token checks and BEFORE any database work — the
   * slot for everything hand-written routes do between the `401` guard and
   * `withTenant`: body parsing, query-parameter validation, `Idempotency-Key`
   * presence, request hashing. Returning a `Response` short-circuits with it
   * (so a malformed body still costs no connection); returning anything else
   * hands that value to `handler` as `prepared`.
   */
  prepare?: (
    context: TenantRouteRequestContext
  ) => TPrepared | Response | Promise<TPrepared | Response>;
  /** Runs inside the tenant transaction, only when access was ALLOWED. */
  handler: (
    context: TenantRouteHandlerContext<TPrepared>
  ) => Response | Promise<Response>;
};

export function defineTenantRoute<TPrepared = undefined>(
  config: TenantRouteConfig<TPrepared>
): APIRoute {
  return async ({ request, cookies, url, params, locals }) => {
    const { tenantId, token } = resolveAuthInputs(request, cookies);

    if (!tenantId) {
      return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
    }
    if (!token) {
      return fail(401, "AUTH_REQUIRED", "Authentication required.");
    }

    const requestContext: TenantRouteRequestContext = {
      request,
      cookies,
      url,
      params,
      locals,
      tenantId,
      now: new Date()
    };

    let prepared = undefined as TPrepared;

    if (config.prepare) {
      const prepareResult = await config.prepare(requestContext);

      if (prepareResult instanceof Response) {
        return prepareResult;
      }

      prepared = prepareResult;
    }

    const guard =
      typeof config.authorize === "function"
        ? config.authorize({ ...requestContext, prepared })
        : config.authorize;

    const sql = getDatabaseClient();
    const tokenHash = hashSessionToken(token);

    // `withTenant<Response>` — pinned, not inferred: this is the #323
    // invariant the hard-coded `unavailableBehavior: "response"` above
    // depends on, stated where a future edit would have to break it on
    // purpose.
    return withTenant<Response>(
      sql,
      tenantId,
      async (tx) => {
        const auth = await authorizeInTransaction(
          tx,
          tenantId,
          tokenHash,
          requestContext.now,
          guard,
          config.authorizeOptions
        );

        if (!auth.allowed) {
          return auth.denied;
        }

        return config.handler({ ...requestContext, tx, auth, prepared });
      },
      {
        workClass: config.workClass,
        queueTimeoutMs: config.queueTimeoutMs,
        unavailableBehavior: "response"
      }
    );
  };
}

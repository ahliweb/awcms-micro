// SIKESRA Route Handler Utility
// Shared admin API handler plumbing
// Source: docs/sikesra/02_architecture.md

import type { SikesraRequestContext } from "../security/request-context";
import { getOrCreateRequestId } from "../api/request-id";
import { ok, fail, type ApiSuccess, type ApiFailure } from "../api/envelope";
import type { D1Binding } from "../repositories/db";

export interface RouteEnv {
  SIKESRA_DB: D1Binding;
  // SIKESRA_DOCUMENTS: R2Bucket; // R2 binding for document operations
}

export interface RouteHandlerInput {
  request: Request;
  input?: unknown;
}

export type RouteHandler<TInput = unknown, TOutput = unknown> = (
  input: RouteHandlerInput,
  db: D1Binding,
) => Promise<ApiSuccess<TOutput> | ApiFailure>;

// Build trusted context from request (auth placeholder)
// In production, derive from EmDash session/Cloudflare Access JWT
export async function buildHandlerContext(request: Request, _env: RouteEnv): Promise<SikesraRequestContext> {
  const requestId = getOrCreateRequestId(request);
  // TODO: derive tenant/site/user/roles/permissions from authenticated session
  return {
    requestId,
    tenantId: "default",
    siteId: "default",
    userId: "stub-user",
    roles: ["admin"],
    permissions: [],
    subjectAttributes: {},
    regionScope: {},
    nowIso: new Date().toISOString(),
  };
}

// Wrap a handler with standard admin API sequence
export function withHandlerSequence<TInput, TOutput>(
  handler: (input: RouteHandlerInput, db: D1Binding, ctx: SikesraRequestContext) => Promise<TOutput>,
): RouteHandler<TInput, TOutput> {
  return async (input: RouteHandlerInput, db: D1Binding) => {
    const requestId = getOrCreateRequestId(input.request);
    try {
      // TODO: Steps 1-7 from SIKESRA admin API handler sequence
      // 1. requestId (done)
      // 2. build trusted context (placeholder)
      // 3. validate input (zod schema)
      // 4. enforce auth
      // 5. route RBAC check
      // 6. load resource metadata if needed
      // 7. evaluate ABAC

      const ctx: SikesraRequestContext = {
        requestId, tenantId: "default", siteId: "default",
        userId: "stub-user", roles: ["admin"], permissions: [],
        subjectAttributes: {}, regionScope: {}, nowIso: new Date().toISOString(),
      };

      const data = await handler(input, db, ctx);
      // 8-9: service executed, TODO: serialize through masking layer
      // 10: TODO: write audit event if required
      return ok(requestId, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal error";
      return fail(requestId, "INTERNAL_ERROR", message);
    }
  };
}

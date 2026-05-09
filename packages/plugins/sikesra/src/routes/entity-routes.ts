// SIKESRA Entity Route Handlers
// Bridges HTTP requests to entity service with admin API sequence
// Source: docs/sikesra/04_api_contracts.md

import type { D1Binding } from "../repositories/db";
import { listEntities, getEntityDetail, createEntity, patchEntity } from "../services/entity";
import { withHandlerSequence, type RouteHandlerInput } from "./handler-utils";
import type { SikesraRequestContext } from "../security/request-context";
import type { EntityListParams, EntityCreateInput, EntityPatchInput } from "../services/entity";

// GET /entities
export const entityListHandler = withHandlerSequence(async (input: RouteHandlerInput, db: D1Binding, ctx: SikesraRequestContext) => {
  const url = new URL(input.request.url);
  const params: EntityListParams = {
    filters: {
      keyword: url.searchParams.get("keyword") ?? undefined,
      objectTypeCode: url.searchParams.get("object_type") ?? undefined,
      villageCode: url.searchParams.get("village") ?? undefined,
      statusData: url.searchParams.get("status") as never,
      statusVerification: url.searchParams.get("verification") ?? undefined,
    },
    page: Number(url.searchParams.get("page")) || 1,
    perPage: Number(url.searchParams.get("per_page")) || 50,
  };
  return listEntities(db, params, ctx);
});

// POST /entities
export const entityCreateHandler = withHandlerSequence(async (input: RouteHandlerInput, db: D1Binding, ctx: SikesraRequestContext) => {
  const body = input.input as EntityCreateInput;
  return createEntity(db, body, ctx);
});

// GET /entities/:id
export const entityDetailHandler = withHandlerSequence(async (input: RouteHandlerInput, db: D1Binding, ctx: SikesraRequestContext) => {
  const url = new URL(input.request.url);
  const id = url.pathname.split("/").pop()!;
  return getEntityDetail(db, id, ctx);
});

// PATCH /entities/:id
export const entityPatchHandler = withHandlerSequence(async (input: RouteHandlerInput, db: D1Binding, ctx: SikesraRequestContext) => {
  const url = new URL(input.request.url);
  const id = url.pathname.split("/").pop()!;
  const body = input.input as EntityPatchInput;
  return patchEntity(db, id, body, ctx);
});

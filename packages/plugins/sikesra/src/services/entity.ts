// SIKESRA Entity Service
// Registry list, detail, access flags
// Source: docs/sikesra/04_api_contracts.md

import type { SikesraRequestContext } from "../security/request-context";
import type { PageMeta, OfficialRegionBreadcrumb, LocalRegionBreadcrumb, AuditHint } from "./types";

// ---------- Entity Types ----------

export type EntityKind = "person" | "institution" | "building" | "group" | "service_record";
export type DataStatus = "draft" | "submitted" | "active" | "archived";
export type SensitivityLevel = "public_safe" | "internal" | "restricted" | "highly_restricted";
export type DuplicateStatus = "unknown" | "none" | "candidate" | "confirmed" | "resolved";
export type SourceInput = "manual" | "import" | "integration";

export interface SikesraEntitySummary {
  id: string;
  sikesraId20?: string;
  objectTypeCode: string;
  objectTypeName: string;
  objectSubtypeCode: string;
  objectSubtypeName: string;
  entityKind: EntityKind;
  displayName: string;
  masked: boolean;
  officialRegion: OfficialRegionBreadcrumb;
  localRegion?: LocalRegionBreadcrumb;
  statusData: DataStatus;
  statusVerification: string;
  verificationLevel?: string;
  sensitivityLevel: SensitivityLevel;
  completenessPercent: number;
  duplicateStatus?: DuplicateStatus;
  sourceInput: SourceInput;
  createdAt: string;
  updatedAt: string;
}

export interface EntityListFilters {
  keyword?: string;
  objectTypeCode?: string;
  objectSubtypeCode?: string;
  districtCode?: string;
  villageCode?: string;
  localRegionId?: string;
  statusData?: DataStatus;
  statusVerification?: string;
  sensitivityLevel?: SensitivityLevel;
  sourceInput?: SourceInput;
  duplicateStatus?: DuplicateStatus;
  completenessMin?: number;
  completenessMax?: number;
}

export interface EntityListParams {
  filters?: EntityListFilters;
  page?: number;
  perPage?: number;
  cursor?: string;
}

export interface EntityListResponse {
  items: SikesraEntitySummary[];
  meta: PageMeta;
}

export interface EntityAccessFlags {
  canEdit: boolean;
  canSubmit: boolean;
  canVerify: boolean;
  canGenerateCode: boolean;
  canRevealSensitive: boolean;
  canDownloadDocuments: boolean;
  deniedActions: Array<{ action: string; reasonCode: string }>;
}

export interface EntityDetailResponse {
  entity: SikesraEntitySummary;
  summary: Record<string, unknown>;
  details?: Record<string, unknown>;
  attributes?: Record<string, unknown>[];
  documents?: Record<string, unknown>[];
  verification?: Record<string, unknown>;
  benefits?: Record<string, unknown>[];
  audit?: Record<string, unknown>[];
  access: EntityAccessFlags;
}

export interface EntityCreateInput {
  objectTypeCode: string;
  objectSubtypeCode: string;
  displayName: string;
  officialVillageCode: string;
  localRegionId?: string;
  sensitivityLevel?: SensitivityLevel;
  sourceInput?: SourceInput;
  sourceInstitution?: string;
}

export interface EntityPatchInput {
  displayName?: string;
  localRegionId?: string;
  addressText?: string;
  latitude?: number;
  longitude?: number;
  sensitivityLevel?: SensitivityLevel;
  [key: string]: unknown; // section patches
}

// ---------- Entity Service Stubs ----------

export async function listEntities(
  params: EntityListParams,
  ctx: SikesraRequestContext,
): Promise<EntityListResponse> {
  // TODO: query awcms_sikesra_entities with tenant/site/deleted/region scope
  // Apply masking via maskNikKia/maskProtectedName etc.
  // Never return raw hashes or R2 keys
  return {
    items: [],
    meta: { perPage: params.perPage ?? 50, hasMore: false },
  };
}

export async function getEntityDetail(
  entityId: string,
  ctx: SikesraRequestContext,
): Promise<EntityDetailResponse | null> {
  // TODO: load entity with joins (details, attributes, documents, verification, benefits, audit)
  // Evaluate ABAC before returning
  // Build access flags from ABAC + permission checks
  return null;
}

export async function createEntity(
  input: EntityCreateInput,
  ctx: SikesraRequestContext,
): Promise<SikesraEntitySummary> {
  // TODO: insert into awcms_sikesra_entities with tenant/site from ctx
  // Set status_data = 'draft', status_verification = 'pending'
  // Return summary with default flags
  throw new Error("Not implemented");
}

export async function patchEntity(
  entityId: string,
  input: EntityPatchInput,
  ctx: SikesraRequestContext,
): Promise<SikesraEntitySummary> {
  // TODO: update entity fields
  // Evaluate ABAC before updating
  // Recalculate completeness_percent
  // Audit the change
  throw new Error("Not implemented");
}

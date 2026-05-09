// SIKESRA Region Service
// Official and local region lookup/management
// Source: docs/sikesra/04_api_contracts.md

import type { SikesraRequestContext } from "../security/request-context";

export type OfficialRegionLevel = "province" | "regency" | "district" | "village";
export type LocalRegionLevel = "dusun" | "lingkungan" | "rw" | "rt" | "blok" | "zona" | "area_petugas";

export interface OfficialRegion {
  code: string;
  name: string;
  level: OfficialRegionLevel;
  parentCode?: string;
  kemendagriVersion?: string;
  isActive: boolean;
}

export interface LocalRegion {
  id: string;
  officialVillageCode: string;
  parentId?: string;
  level: LocalRegionLevel;
  codeLocal?: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface LocalRegionCreateInput {
  officialVillageCode: string;
  parentId?: string;
  level: LocalRegionLevel;
  codeLocal?: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

// ---------- Service Stubs ----------

export async function getOfficialRegions(
  parentCode?: string,
  level?: OfficialRegionLevel,
): Promise<OfficialRegion[]> {
  // TODO: query awcms_sikesra_official_regions
  return [];
}

export async function getLocalRegions(
  villageCode?: string,
  ctx?: SikesraRequestContext,
): Promise<LocalRegion[]> {
  // TODO: query awcms_sikesra_local_regions
  return [];
}

export async function createLocalRegion(
  input: LocalRegionCreateInput,
  ctx: SikesraRequestContext,
): Promise<LocalRegion> {
  // TODO: insert into awcms_sikesra_local_regions
  // Audit the creation
  // Local region changes must never mutate sikesra_id_20
  throw new Error("Not implemented");
}

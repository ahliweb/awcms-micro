// SIKESRA Settings Service
// Module settings: public visibility, thresholds, limits, feature flags
// Source: docs/sikesra/04_api_contracts.md

import type { SikesraRequestContext } from "../security/request-context";

export interface SikesraSettings {
  publicEnabled: boolean;
  publicTitle: string;
  publicDescription?: string;
  dataScopeNote?: string;
  officialContact?: string;
  smallCellThreshold: number;
  maxUploadBytes: number;
  allowedMimeTypes?: string[];
  exportMaxSyncRows: number;
  requireReasonForHighlyRestrictedDownload: boolean;
  featureFlags?: Record<string, boolean>;
}

export interface SettingsUpdateInput {
  publicEnabled?: boolean;
  publicTitle?: string;
  publicDescription?: string;
  dataScopeNote?: string;
  officialContact?: string;
  smallCellThreshold?: number;
  maxUploadBytes?: number;
  allowedMimeTypes?: string[];
  exportMaxSyncRows?: number;
  requireReasonForHighlyRestrictedDownload?: boolean;
  featureFlags?: Record<string, boolean>;
}

export async function getSettings(ctx: SikesraRequestContext): Promise<SikesraSettings> {
  // TODO: query awcms_sikesra_settings
  return {
    publicEnabled: false,
    publicTitle: "SIKESRA",
    smallCellThreshold: 5,
    maxUploadBytes: 10485760,
    exportMaxSyncRows: 5000,
    requireReasonForHighlyRestrictedDownload: true,
  };
}

export async function updateSettings(
  input: SettingsUpdateInput,
  reason: string,
  ctx: SikesraRequestContext,
): Promise<SikesraSettings> {
  // TODO: require awcms:sikesra:settings:update permission
  // Validate reason provided
  // Update settings row
  // Audit settings.update
  throw new Error("Not implemented");
}

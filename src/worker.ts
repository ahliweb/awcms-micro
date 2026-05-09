// SIKESRA Cloudflare Worker
// D1-backed API endpoints for SIKESRA public and admin routes
// Source: docs/sikesra/04_api_contracts.md

import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
}

function ok<T>(data: T, requestId: string, meta?: Record<string, unknown>) {
  return new Response(JSON.stringify({ ok: true, requestId, data, meta }), {
    headers: { "Content-Type": "application/json" },
  });
}

function fail(requestId: string, code: string, message: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, requestId, error: { code, message } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const reqId = crypto.randomUUID();
    const path = url.pathname;

    try {
      // Health check
      if (path === "/" || path === "/health") {
        const dbCheck = await env.DB.prepare("SELECT 1 as ok").first();
        return ok({ service: "AWCMS-Micro SIKESRA", status: "operational", database: dbCheck ? "connected" : "error", storage: "connected", timestamp: new Date().toISOString() }, reqId);
      }

      // Public metadata
      if (path === "/_emdash/api/plugins/sikesra/public/metadata") {
        const row = await env.DB.prepare(
          "SELECT public_enabled, public_title, public_description, data_scope_note, official_contact, updated_at FROM awcms_sikesra_settings WHERE public_enabled = 1 AND deleted_at IS NULL LIMIT 1"
        ).first<Record<string, unknown>>();
        if (!row) return ok({ enabled: false, title: "SIKESRA", description: "Data agregat kesejahteraan rakyat", dataScopeNote: "Data ditampilkan dalam bentuk agregat" }, reqId);
        return ok({ enabled: !!row.public_enabled, title: row.public_title, description: row.public_description, dataScopeNote: row.data_scope_note ?? "", officialContact: row.official_contact, latestUpdateAt: row.updated_at }, reqId);
      }

      // Public filters
      if (path === "/_emdash/api/plugins/sikesra/public/filters") {
        const types = await env.DB.prepare("SELECT code, name FROM awcms_sikesra_object_types WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order").all<{ code: string; name: string }>();
        return ok({ objectTypes: types.results, districts: [], villages: [], years: [], statuses: [{ code: "active", label: "Aktif" }, { code: "verified", label: "Terverifikasi" }] }, reqId);
      }

      // Public summary (aggregate-safe)
      if (path === "/_emdash/api/plugins/sikesra/public/summary") {
        const total = await env.DB.prepare("SELECT COUNT(*) as cnt FROM awcms_sikesra_entities WHERE status_data = 'active' AND status_verification = 'verified' AND deleted_at IS NULL").first<{ cnt: number }>();
        const verified = parseInt(String(total?.cnt ?? 0), 10);
        const villages = await env.DB.prepare("SELECT COUNT(DISTINCT official_village_code) as cnt FROM awcms_sikesra_entities WHERE deleted_at IS NULL").first<{ cnt: number }>();
        return ok({
          kpis: { totalEntities: verified, verifiedEntities: verified, activeVillages: villages?.cnt ?? 0, latestUpdateAt: new Date().toISOString() },
          charts: { byObjectType: [], byRegion: [], byVerificationStatus: [], bySafeAttribute: [] },
          suppression: { threshold: 5, suppressedCells: 0 },
          caveat: "Data pada halaman ini merupakan rekapitulasi agregat yang telah diverifikasi. Data pribadi, data anak, data disabilitas, dan alamat detail tidak ditampilkan.",
        }, reqId);
      }

      // Entity list (admin)
      if (path === "/_emdash/api/plugins/sikesra/v1/entities") {
        const page = parseInt(url.searchParams.get("page") ?? "1", 10);
        const perPage = Math.min(parseInt(url.searchParams.get("per_page") ?? "50", 10), 100);
        const offset = (page - 1) * perPage;
        const keyword = url.searchParams.get("keyword");
        const typeCode = url.searchParams.get("object_type");

        let where = "WHERE deleted_at IS NULL";
        const params: unknown[] = [];
        if (keyword) { where += " AND (display_name LIKE ? OR sikesra_id_20 LIKE ?)"; params.push(`%${keyword}%`, `%${keyword}%`); }
        if (typeCode) { where += " AND object_type_code = ?"; params.push(typeCode); }

        const countSql = `SELECT COUNT(*) as cnt FROM awcms_sikesra_entities ${where}`;
        const total = (await env.DB.prepare(countSql).bind(...params).first<{ cnt: number }>())?.cnt ?? 0;

        const sql = `SELECT id, sikesra_id_20, object_type_code, object_subtype_code, entity_kind, display_name, official_village_code, status_data, status_verification, verification_level, sensitivity_level, completeness_percent, duplicate_status, source_input, created_at, updated_at FROM awcms_sikesra_entities ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        const rows = await env.DB.prepare(sql).bind(...params, perPage, offset).all<Record<string, unknown>>();

        const items = rows.results.map((r) => ({
          id: r.id, sikesraId20: r.sikesra_id_20, objectTypeCode: r.object_type_code, objectTypeName: "", objectSubtypeCode: r.object_subtype_code, objectSubtypeName: "",
          entityKind: r.entity_kind, displayName: r.display_name, masked: false,
          officialRegion: {}, statusData: r.status_data, statusVerification: r.status_verification, verificationLevel: r.verification_level,
          sensitivityLevel: r.sensitivity_level, completenessPercent: r.completeness_percent, duplicateStatus: r.duplicate_status,
          sourceInput: r.source_input, createdAt: r.created_at, updatedAt: r.updated_at,
        }));

        return ok({ items, meta: { page, perPage, total, hasMore: offset + perPage < total } }, reqId);
      }

      // Object types list
      if (path === "/_emdash/api/plugins/sikesra/v1/object-types") {
        const rows = await env.DB.prepare("SELECT code, name, entity_kind, description, is_active, sort_order FROM awcms_sikesra_object_types WHERE deleted_at IS NULL ORDER BY sort_order").all();
        return ok(rows.results, reqId);
      }

      // Settings get
      if (path === "/_emdash/api/plugins/sikesra/v1/settings") {
        const row = await env.DB.prepare("SELECT * FROM awcms_sikesra_settings WHERE deleted_at IS NULL LIMIT 1").first<Record<string, unknown>>();
        return ok(row ?? { publicEnabled: false, publicTitle: "SIKESRA", smallCellThreshold: 5, maxUploadBytes: 10485760, exportMaxSyncRows: 5000, requireReasonForHighlyRestrictedDownload: true }, reqId);
      }

      return fail(reqId, "NOT_FOUND", "Route not found", 404);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal server error";
      return fail(reqId, "INTERNAL_ERROR", message, 500);
    }
  },
};

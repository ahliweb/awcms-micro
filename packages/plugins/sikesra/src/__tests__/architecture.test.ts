// SIKESRA Architecture Validation Tests
// Validates the core patterns: repository → service → route handler → envelope
// Uses InMemoryD1Binding for test isolation

import { describe, it, expect } from "vitest";
import { InMemoryD1Binding } from "../repositories/db";
import { buildTrustedRequestContext, type SikesraRequestContext } from "../security/request-context";
import { listEntities, createEntity, getEntityDetail } from "../services/entity";
import { fail, ok } from "../api/envelope";
import { getOrCreateRequestId } from "../api/request-id";
import { maskNikKia, maskPhone, maskR2Key } from "../security/masking";
import { SIKESRA_PERMISSIONS } from "../security/permissions";
import { AUDIT_ACTIONS, isHighRiskAction } from "../services/audit";
import { applySmallCellSuppression } from "../services/public";

function makeContext(overrides?: Partial<SikesraRequestContext>): SikesraRequestContext {
  return buildTrustedRequestContext({
    requestId: getOrCreateRequestId(),
    tenantId: "test-tenant",
    siteId: "test-site",
    userId: "test-user",
    roles: ["admin"],
    permissions: Object.values(SIKESRA_PERMISSIONS),
    ...overrides,
  });
}

describe("SIKESRA Architecture Validation", () => {
  describe("API Utilities", () => {
    it("should generate request IDs", () => {
      const id = getOrCreateRequestId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe("string");
    });

    it("should produce ok envelope", () => {
      const res = ok("req-1", { items: [] });
      expect(res.ok).toBe(true);
      expect(res.requestId).toBe("req-1");
      expect(res.data).toEqual({ items: [] });
    });

    it("should produce fail envelope", () => {
      const res = fail("req-1", "NOT_FOUND", "Entity not found");
      expect(res.ok).toBe(false);
      expect(res.error.code).toBe("NOT_FOUND");
      expect(res.error.message).toBe("Entity not found");
    });
  });

  describe("Security Utilities", () => {
    it("should mask NIK/KIA when not authorized", () => {
      const result = maskNikKia("1234567890123456", { canRevealSensitive: false, canRevealHighlyRestricted: false });
      expect(result).toBe("************3456");
    });

    it("should not mask NIK/KIA when highly-restricted authorized", () => {
      const result = maskNikKia("1234567890123456", { canRevealSensitive: true, canRevealHighlyRestricted: true });
      expect(result).toBe("1234567890123456");
    });

    it("should mask phone", () => {
      const result = maskPhone("081234567890", { canRevealSensitive: false, canRevealHighlyRestricted: false });
      expect(result).toBe("******7890");
    });

    it("should never return R2 key", () => {
      expect(maskR2Key("tenants/x/sites/y/documents/secret.pdf", {} as never)).toBeNull();
    });

    it("should have all 33 permissions registered", () => {
      expect(Object.keys(SIKESRA_PERMISSIONS).length).toBe(33);
    });

    it("should identify high-risk audit actions", () => {
      expect(isHighRiskAction(AUDIT_ACTIONS.CODE_CORRECT)).toBe(true);
      expect(isHighRiskAction(AUDIT_ACTIONS.SENSITIVE_REVEAL)).toBe(true);
      expect(isHighRiskAction(AUDIT_ACTIONS.ENTITY_UPDATE)).toBe(false);
    });
  });

  describe("Public Data Safety", () => {
    it("should suppress small cells", () => {
      const points = [
        { key: "a", label: "A", total: 3 },
        { key: "b", label: "B", total: 10 },
        { key: "c", label: "C", total: 1 },
      ];
      const result = applySmallCellSuppression(points, 5);
      expect(result.suppressed[0].total).toBe(0); // 3 < 5
      expect(result.suppressed[1].total).toBe(10); // 10 >= 5
      expect(result.suppressed[2].total).toBe(0); // 1 < 5
      expect(result.suppressionCount).toBe(2);
    });
  });

  describe("Repository Layer", () => {
    const db = new InMemoryD1Binding();
    const ctx = makeContext();

    it("should return empty list for new database", async () => {
      const result = await listEntities(db, { perPage: 10 }, ctx);
      expect(result.items).toEqual([]);
      expect(result.meta.hasMore).toBe(false);
    });

    it("should create an entity", async () => {
      const entity = await createEntity(db, {
        objectTypeCode: "01",
        objectSubtypeCode: "01",
        displayName: "Test Masjid",
        officialVillageCode: "6201021005",
        sensitivityLevel: "internal",
      }, ctx);

      expect(entity.id).toBeTruthy();
      expect(entity.displayName).toBe("Test Masjid");
      expect(entity.statusData).toBe("draft");
      expect(entity.entityKind).toBe("building");
    });

    it("should return null for non-existent entity detail", async () => {
      const result = await getEntityDetail(db, "nonexistent", ctx);
      expect(result).toBeNull();
    });
  });

  describe("Request Context", () => {
    it("should build trusted context from inputs", () => {
      const ctx = makeContext();
      expect(ctx.tenantId).toBe("test-tenant");
      expect(ctx.siteId).toBe("test-site");
      expect(ctx.userId).toBe("test-user");
      expect(ctx.roles).toContain("admin");
      expect(ctx.nowIso).toBeTruthy();
    });

    it("should freeze roles and permissions copies", () => {
      const ctx = makeContext({ roles: ["editor"], permissions: ["awcms:sikesra:entity:read"] });
      ctx.roles.push("admin");
      expect(ctx.roles).toEqual(["editor"]);
    });
  });
});

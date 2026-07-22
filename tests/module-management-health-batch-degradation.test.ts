/**
 * Per-source graceful-degradation test for the batched module-health path
 * (`perf/module-health-batch`). No database: a fake `tx` throws for exactly
 * ONE of the three batched reads (module registry scan / permission catalog
 * / this tenant's settings rows). The contract restored here — matching the
 * old per-module path — is that one transient query failure degrades ONLY
 * the signal it feeds (to the same fixed generic string) for every module,
 * and NEVER throws out of `fetchModuleHealthReports` (which would blank the
 * whole `/admin/modules` page whose entire purpose is diagnosing health).
 */
import { describe, expect, test } from "bun:test";

import { listModules } from "../src/modules";
import { fetchModuleHealthReports } from "../src/modules/module-management/application/health-registry";

/**
 * A minimal stand-in for `Bun.SQL`'s tagged-template call. Every query
 * resolves to `[]` (an empty result set — harmless for the signals we are
 * not testing) EXCEPT those whose SQL text matches `failWhen`, which reject
 * to simulate a transient DB hiccup on that one source.
 */
function fakeTx(failWhen: (sql: string) => boolean): Bun.SQL {
  const call = (strings: TemplateStringsArray, ..._values: unknown[]) => {
    const sql = strings.join(" ");
    if (failWhen(sql)) {
      return Promise.reject(new Error("simulated transient DB outage"));
    }
    return Promise.resolve([]);
  };
  return call as unknown as Bun.SQL;
}

const ALL_KEYS = listModules().map((descriptor) => descriptor.key);

function detailOf(
  reports: Map<
    string,
    { signals: { name: string; status: string; detail?: string }[] }
  >,
  moduleKey: string,
  signalName: string
): { status: string; detail?: string } | undefined {
  const signal = reports
    .get(moduleKey)
    ?.signals.find((s) => s.name === signalName);
  return signal ? { status: signal.status, detail: signal.detail } : undefined;
}

describe("module health batched per-source graceful degradation", () => {
  test("a failing registry scan degrades only db_registry_synced, for every module, without throwing", async () => {
    const tx = fakeTx((sql) => sql.includes("FROM awcms_micro_modules"));

    const reports = await fetchModuleHealthReports(tx, "tenant-x", ALL_KEYS);

    expect(reports.size).toBe(ALL_KEYS.length);
    for (const key of ALL_KEYS) {
      expect(detailOf(reports, key, "db_registry_synced")).toEqual({
        status: "fail",
        detail: "Could not query the module registry."
      });
      // The other DB-backed signals must NOT inherit the registry failure.
      expect(
        detailOf(reports, key, "permission_catalog_synced")?.detail
      ).not.toBe("Could not check the permission catalog.");
      expect(detailOf(reports, key, "settings_valid")?.detail).not.toBe(
        "Could not resolve effective module settings."
      );
    }
  });

  test("a failing permission catalog read degrades only permission_catalog_synced, for every module, without throwing", async () => {
    const tx = fakeTx((sql) => sql.includes("FROM awcms_micro_permissions"));

    const reports = await fetchModuleHealthReports(tx, "tenant-x", ALL_KEYS);

    expect(reports.size).toBe(ALL_KEYS.length);
    for (const key of ALL_KEYS) {
      expect(detailOf(reports, key, "permission_catalog_synced")).toEqual({
        status: "fail",
        detail: "Could not check the permission catalog."
      });
      expect(detailOf(reports, key, "db_registry_synced")?.detail).not.toBe(
        "Could not query the module registry."
      );
    }
  });

  test("a failing settings read degrades only settings_valid, for every module, without throwing", async () => {
    const tx = fakeTx((sql) =>
      sql.includes("FROM awcms_micro_module_settings")
    );

    const reports = await fetchModuleHealthReports(tx, "tenant-x", ALL_KEYS);

    expect(reports.size).toBe(ALL_KEYS.length);
    for (const key of ALL_KEYS) {
      expect(detailOf(reports, key, "settings_valid")).toEqual({
        status: "fail",
        detail: "Could not resolve effective module settings."
      });
      expect(detailOf(reports, key, "db_registry_synced")?.detail).not.toBe(
        "Could not query the module registry."
      );
    }
  });
});

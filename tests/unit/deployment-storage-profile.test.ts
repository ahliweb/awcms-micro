/**
 * Profile-matrix + durable-storage severity tests for
 * `src/lib/deployment/storage-profile.ts` (Issue #262, ADR-0027). Covers the
 * five scenarios the issue's testing section requires: development, durable
 * local volume, valid object storage, missing credentials, and
 * ephemeral-storage misconfiguration — plus the profile classifier.
 */
import { describe, expect, test } from "bun:test";

import {
  classifyDeploymentProfile,
  evaluateDurableStorageReadiness,
  isOnlineAppEnv,
  type DurableStorageInput
} from "../../src/lib/deployment/storage-profile";

function input(
  overrides: Partial<DurableStorageInput> = {}
): DurableStorageInput {
  return {
    appEnv: "development",
    r2Enabled: false,
    r2CredentialsComplete: false,
    newsMediaR2Enabled: false,
    newsMediaR2CredentialsComplete: false,
    ...overrides
  };
}

describe("isOnlineAppEnv", () => {
  test("staging and production are online; development/unset/unknown are not", () => {
    expect(isOnlineAppEnv("production")).toBe(true);
    expect(isOnlineAppEnv("staging")).toBe(true);
    expect(isOnlineAppEnv("development")).toBe(false);
    expect(isOnlineAppEnv(undefined)).toBe(false);
    expect(isOnlineAppEnv("prod")).toBe(false);
  });
});

describe("classifyDeploymentProfile", () => {
  test("non-online APP_ENV → development regardless of storage", () => {
    expect(classifyDeploymentProfile(input({ appEnv: "development" }))).toBe(
      "development"
    );
    expect(
      classifyDeploymentProfile(
        input({
          appEnv: undefined,
          r2Enabled: true,
          r2CredentialsComplete: true
        })
      )
    ).toBe("development");
  });

  test("online + object storage → full_online_production", () => {
    expect(
      classifyDeploymentProfile(
        input({
          appEnv: "production",
          newsMediaR2Enabled: true,
          newsMediaR2CredentialsComplete: true
        })
      )
    ).toBe("full_online_production");
  });

  test("online + no object storage → full_online_single_host", () => {
    expect(classifyDeploymentProfile(input({ appEnv: "staging" }))).toBe(
      "full_online_single_host"
    );
    expect(classifyDeploymentProfile(input({ appEnv: "production" }))).toBe(
      "full_online_single_host"
    );
  });
});

describe("evaluateDurableStorageReadiness — severity matrix", () => {
  test("development: local storage is acceptable (pass/info)", () => {
    const finding = evaluateDurableStorageReadiness(
      input({ appEnv: "development" })
    );
    expect(finding.profile).toBe("development");
    expect(finding.status).toBe("pass");
    expect(finding.severity).toBe("info");
    expect(finding.reason).toBe("development_local_ok");
  });

  test("valid object storage in production (pass/info)", () => {
    const finding = evaluateDurableStorageReadiness(
      input({
        appEnv: "production",
        newsMediaR2Enabled: true,
        newsMediaR2CredentialsComplete: true
      })
    );
    expect(finding.profile).toBe("full_online_production");
    expect(finding.objectStorageEnabled).toBe(true);
    expect(finding.status).toBe("pass");
    expect(finding.severity).toBe("info");
    expect(finding.reason).toBe("object_storage_configured");
  });

  test("sync-storage R2 alone also satisfies durable object storage", () => {
    const finding = evaluateDurableStorageReadiness(
      input({
        appEnv: "production",
        r2Enabled: true,
        r2CredentialsComplete: true
      })
    );
    expect(finding.status).toBe("pass");
    expect(finding.reason).toBe("object_storage_configured");
  });

  test("missing credentials with object storage enabled (fail/critical)", () => {
    const finding = evaluateDurableStorageReadiness(
      input({
        appEnv: "production",
        newsMediaR2Enabled: true,
        newsMediaR2CredentialsComplete: false
      })
    );
    expect(finding.status).toBe("fail");
    expect(finding.severity).toBe("critical");
    expect(finding.reason).toBe("object_storage_credentials_incomplete");
    expect(finding.evidence).toContain("NEWS_MEDIA_R2_*");
  });

  test("sync R2 credentials incomplete also fails critical", () => {
    const finding = evaluateDurableStorageReadiness(
      input({
        appEnv: "production",
        r2Enabled: true,
        r2CredentialsComplete: false
      })
    );
    expect(finding.status).toBe("fail");
    expect(finding.severity).toBe("critical");
    expect(finding.reason).toBe("object_storage_credentials_incomplete");
  });

  test("ephemeral-storage misconfiguration: production, no object storage (fail/critical)", () => {
    const finding = evaluateDurableStorageReadiness(
      input({ appEnv: "production" })
    );
    expect(finding.profile).toBe("full_online_single_host");
    expect(finding.objectStorageEnabled).toBe(false);
    expect(finding.status).toBe("fail");
    expect(finding.severity).toBe("critical");
    expect(finding.reason).toBe("production_ephemeral_storage");
  });

  test("durable local volume: staging single-host, no object storage (pass/warning)", () => {
    const finding = evaluateDurableStorageReadiness(
      input({ appEnv: "staging" })
    );
    expect(finding.profile).toBe("full_online_single_host");
    expect(finding.status).toBe("pass");
    expect(finding.severity).toBe("warning");
    expect(finding.reason).toBe("single_host_local_volume_unverified");
  });
});

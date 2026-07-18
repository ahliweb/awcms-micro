/**
 * storage-profile.ts — canonical full-online deployment/storage profiles and
 * the durable managed-media invariant they share.
 *
 * This is the machine-readable home for the profile terminology ADR-0027
 * (`docs/adr/0027-full-online-deployment-and-durable-storage-profiles.md`)
 * defines. Downstream issues (#263 documentation-scope cleanup, #264
 * media-library reconciliation, #265 SEO admission) reference these exact
 * profile names — keep this file and ADR-0027 in sync.
 *
 * ## Why no `DEPLOYMENT_PROFILE` env var
 *
 * The profile is a DEPLOYMENT/topology concept an operator chooses, not a
 * runtime switch. This repository deliberately has NO global
 * `DEPLOYMENT_PROFILE`/`FILE_STORAGE_DRIVER`/`LOCAL_MEDIA_STORAGE_ENABLED`
 * env var (see `scripts/config-docs-check.ts`'s `DOC18_NON_VARIABLE_TOKENS`
 * and doc 18's "sengaja TIDAK ditambahkan" explanations). Instead, the
 * profile is DERIVED here from signals the repo already has:
 *
 *   - `APP_ENV` — the actual online/offline-of-internet gate every other
 *     production-only security check already keys on (`src/middleware.ts`
 *     cookie-secure gating, `scripts/production-preflight.ts` db:pool:health
 *     blocking-skip, the `checkNewsMediaR2*ProductionSafe` checks).
 *   - `R2_ENABLED` — the real sync-storage object-queue upload switch
 *     (`src/modules/sync-storage/infrastructure/object-storage-uploader.ts`).
 *   - `NEWS_MEDIA_R2_ENABLED` — the media-library / news-portal public
 *     object-storage switch (`src/modules/media-library/domain/media-r2-config.ts`).
 *
 * Pure — no `process.env` reads here; callers pass in a normalized input
 * (same split as `media-r2-config.ts` / `visitor-analytics-config.ts`). The
 * `scripts/security-readiness.ts` `checkDurableMediaStorageReady` wrapper is
 * the one place that reads `process.env` and maps the finding onto the
 * security-readiness severity gate.
 */

/**
 * The three supported operating profiles (ADR-0027 §Profil). `staging` is a
 * production mirror and classifies as `full_online_single_host` here — it is
 * not a fourth profile.
 *
 * `offline-lan` is intentionally NOT a member: it exists only as a
 * DERIVED-APPLICATION capability label in the extension/module compatibility
 * contract (`ModuleDeploymentProfile`/`ExtensionManifestDeploymentProfile`),
 * for a derived app that adds its own offline modules — never as an operating
 * mode of this full-online website base (ADR-0025 §2, ADR-0027 §Hubungan
 * dengan label `offline-lan`).
 */
export type FullOnlineDeploymentProfile =
  "development" | "full_online_single_host" | "full_online_production";

export type DurableStorageSeverity = "critical" | "warning" | "info";
export type DurableStorageStatus = "pass" | "fail";

/**
 * Machine-readable reason code for the durable-storage finding — stable
 * identifiers the readiness check and its tests assert on (never the
 * human-facing `evidence` string).
 */
export type DurableStorageReason =
  | "development_local_ok"
  | "object_storage_configured"
  | "object_storage_credentials_incomplete"
  | "single_host_local_volume_unverified"
  | "production_ephemeral_storage";

export type DurableStorageInput = {
  /** Raw `APP_ENV` (`development`/`staging`/`production`/unset). */
  appEnv: string | undefined;
  /** `R2_ENABLED === "true"` — sync-storage object queue uploads to R2. */
  r2Enabled: boolean;
  /** `R2_*` credentials all present when `r2Enabled` (see `scripts/validate-env.ts` `checkR2Config`). */
  r2CredentialsComplete: boolean;
  /** `NEWS_MEDIA_R2_ENABLED === "true"` — media-library/news-portal public object storage. */
  newsMediaR2Enabled: boolean;
  /** `NEWS_MEDIA_R2_*` credentials all present when `newsMediaR2Enabled` (see `findMissingNewsMediaR2Vars`). */
  newsMediaR2CredentialsComplete: boolean;
};

export type DurableStorageFinding = {
  profile: FullOnlineDeploymentProfile;
  /** Whether any provider-neutral object storage adapter is enabled. */
  objectStorageEnabled: boolean;
  status: DurableStorageStatus;
  severity: DurableStorageSeverity;
  reason: DurableStorageReason;
  /** Human-facing explanation for `security:readiness` output. */
  evidence: string;
};

const ONLINE_APP_ENVS = new Set(["staging", "production"]);

/** `true` for `APP_ENV` values that represent an internet-facing deployment. */
export function isOnlineAppEnv(appEnv: string | undefined): boolean {
  return typeof appEnv === "string" && ONLINE_APP_ENVS.has(appEnv);
}

/**
 * Classifies the effective operating profile from an already-normalized
 * input. `development` when `APP_ENV` is not an online value; otherwise
 * `full_online_production` when durable object storage is enabled, else
 * `full_online_single_host` (an online deployment relying on host-local
 * storage for managed media — durable only if a mounted volume backs it).
 */
export function classifyDeploymentProfile(
  input: DurableStorageInput
): FullOnlineDeploymentProfile {
  if (!isOnlineAppEnv(input.appEnv)) {
    return "development";
  }

  const objectStorageEnabled = input.r2Enabled || input.newsMediaR2Enabled;
  return objectStorageEnabled
    ? "full_online_production"
    : "full_online_single_host";
}

/**
 * The single durable managed-media invariant every online profile shares
 * (ADR-0027 §Aturan durable storage): production must not rely on the
 * container's ephemeral filesystem as the durable store for managed media.
 *
 * Severity matrix (ADR-0027 §Matriks severity readiness):
 *
 * | Profile / signals                                             | status | severity |
 * | ------------------------------------------------------------- | ------ | -------- |
 * | development (APP_ENV not online)                              | pass   | info     |
 * | online + object storage enabled + credentials complete       | pass   | info     |
 * | online + object storage enabled + credentials INCOMPLETE     | fail   | critical |
 * | APP_ENV=staging + no object storage (single-host volume)     | pass   | warning  |
 * | APP_ENV=production + no object storage (ephemeral FS)         | fail   | critical |
 */
export function evaluateDurableStorageReadiness(
  input: DurableStorageInput
): DurableStorageFinding {
  const profile = classifyDeploymentProfile(input);
  const objectStorageEnabled = input.r2Enabled || input.newsMediaR2Enabled;

  if (profile === "development") {
    return {
      profile,
      objectStorageEnabled,
      status: "pass",
      severity: "info",
      reason: "development_local_ok",
      evidence:
        "development profile (APP_ENV is not staging/production): local/ephemeral media storage is acceptable and MUST NOT be treated as a production durable store."
    };
  }

  if (objectStorageEnabled) {
    const credentialsComplete =
      (!input.r2Enabled || input.r2CredentialsComplete) &&
      (!input.newsMediaR2Enabled || input.newsMediaR2CredentialsComplete);

    if (!credentialsComplete) {
      const missing: string[] = [];
      if (input.r2Enabled && !input.r2CredentialsComplete) {
        missing.push("R2_* (sync-storage object queue)");
      }
      if (input.newsMediaR2Enabled && !input.newsMediaR2CredentialsComplete) {
        missing.push("NEWS_MEDIA_R2_* (media-library/news-portal)");
      }

      return {
        profile,
        objectStorageEnabled,
        status: "fail",
        severity: "critical",
        reason: "object_storage_credentials_incomplete",
        evidence: `Object storage is enabled but its credentials are incomplete (${missing.join(
          "; "
        )}). A full_online_production deployment cannot persist managed media without complete provider credentials — supply them via environment/secrets manager (never committed), see ADR-0027 §Kegagalan object storage.`
      };
    }

    return {
      profile,
      objectStorageEnabled,
      status: "pass",
      severity: "info",
      reason: "object_storage_configured",
      evidence:
        "Provider-neutral object storage is enabled (R2_ENABLED and/or NEWS_MEDIA_R2_ENABLED) with complete credentials — managed media persists off the container filesystem (ADR-0027 §Aturan durable storage)."
    };
  }

  // Online, but no object storage adapter enabled → relies on host-local storage.
  if (input.appEnv === "production") {
    return {
      profile,
      objectStorageEnabled,
      status: "fail",
      severity: "critical",
      reason: "production_ephemeral_storage",
      evidence:
        "APP_ENV=production but neither R2_ENABLED nor NEWS_MEDIA_R2_ENABLED is true. A full_online_production deployment must not rely on the container's ephemeral filesystem as durable media storage. Enable provider-neutral object storage (Cloudflare R2 is the recommended first adapter, not mandatory — ADR-0027), or run this as full_online_single_host (APP_ENV=staging) on an explicitly durable mounted volume with a backup + reconciliation policy."
    };
  }

  // APP_ENV=staging → full_online_single_host: a mounted durable volume is
  // legitimate here, but this check cannot verify a volume is actually
  // durable — warn so the operator attests it, never silently pass.
  return {
    profile,
    objectStorageEnabled,
    status: "pass",
    severity: "warning",
    reason: "single_host_local_volume_unverified",
    evidence:
      "full_online_single_host (APP_ENV=staging) with no object storage enabled: managed media is served from host-local storage. This is only durable if it is a mounted volume that survives container/host replacement AND is covered by the backup + reconciliation policy (ADR-0027 §Backup/restore). This check cannot verify a volume is durable — confirm it operationally before go-live, or enable object storage."
  };
}

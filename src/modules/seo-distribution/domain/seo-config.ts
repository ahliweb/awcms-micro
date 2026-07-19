/**
 * Tenant SEO defaults — the shape `awcms_micro_seo_tenant_settings` (sql/080)
 * carries and the validation the admin API applies before writing it (Issue
 * #266, ADR-0028 §4). Pure: no I/O. The renderer applies these defaults
 * UNDERNEATH resource-level `SeoResourceFacts` (a resource's own value always
 * wins — see `seo-document.ts`).
 */

/** Resolved, render-ready tenant SEO defaults (every field already validated). */
export type SeoTenantSettings = {
  /** Overrides the tenant display name for `og:site_name` / JSON-LD; `null` → fall back to tenant name. */
  siteName: string | null;
  defaultMetaDescription: string | null;
  /** Media object id (resolved via `MediaLibraryPort` at render time), or `null`. */
  defaultSocialMediaId: string | null;
  /** e.g. `"@example"` — rendered as `twitter:site`. */
  twitterSiteHandle: string | null;
  organizationName: string | null;
  organizationLogoMediaId: string | null;
  /** Tenant-wide "this whole site is noindex" switch. */
  defaultRobotsNoindex: boolean;
};

/** The neutral default when a tenant has no config row yet — everything absent, site indexable. */
export const EMPTY_SEO_TENANT_SETTINGS: SeoTenantSettings = {
  siteName: null,
  defaultMetaDescription: null,
  defaultSocialMediaId: null,
  twitterSiteHandle: null,
  organizationName: null,
  organizationLogoMediaId: null,
  defaultRobotsNoindex: false
};

/** Field length caps — mirror the CHECK constraints in sql/080 (defense in depth: validate here first with a clean error, the DB is the floor). */
export const SEO_SETTINGS_LIMITS = {
  siteName: 200,
  defaultMetaDescription: 500,
  twitterSiteHandle: 80,
  organizationName: 200
} as const;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SeoSettingsValidationError = {
  field: string;
  message: string;
};

export type SeoSettingsValidationResult =
  | { ok: true; value: SeoTenantSettings }
  | { ok: false; errors: SeoSettingsValidationError[] };

function normalizeOptionalText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Validate + normalize an untrusted request body into `SeoTenantSettings`.
 * Unknown keys are ignored (not an error — forward-compatible), every string is
 * trimmed and empty-collapsed to `null`, lengths are bounded, and the two media
 * id fields must be a UUID or `null` (a non-UUID string is rejected here rather
 * than stored and silently dropped at render time). `defaultRobotsNoindex`
 * accepts only a real boolean; a missing value defaults to `false` (indexable).
 */
export function validateSeoTenantSettings(
  body: unknown
): SeoSettingsValidationResult {
  const errors: SeoSettingsValidationError[] = [];

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return {
      ok: false,
      errors: [
        { field: "body", message: "Request body must be a JSON object." }
      ]
    };
  }

  const input = body as Record<string, unknown>;

  const boundedText = (
    field: keyof typeof SEO_SETTINGS_LIMITS
  ): string | null => {
    const normalized = normalizeOptionalText(input[field]);
    if (normalized !== null && normalized.length > SEO_SETTINGS_LIMITS[field]) {
      errors.push({
        field,
        message: `Must be at most ${SEO_SETTINGS_LIMITS[field]} characters.`
      });
      return null;
    }
    return normalized;
  };

  const mediaId = (field: string): string | null => {
    const normalized = normalizeOptionalText(input[field]);
    if (normalized !== null && !UUID_PATTERN.test(normalized)) {
      errors.push({ field, message: "Must be a media object UUID or null." });
      return null;
    }
    return normalized;
  };

  const siteName = boundedText("siteName");
  const defaultMetaDescription = boundedText("defaultMetaDescription");
  const twitterSiteHandle = boundedText("twitterSiteHandle");
  const organizationName = boundedText("organizationName");
  const defaultSocialMediaId = mediaId("defaultSocialMediaId");
  const organizationLogoMediaId = mediaId("organizationLogoMediaId");

  let defaultRobotsNoindex = false;
  if (input.defaultRobotsNoindex !== undefined) {
    if (typeof input.defaultRobotsNoindex !== "boolean") {
      errors.push({
        field: "defaultRobotsNoindex",
        message: "Must be a boolean."
      });
    } else {
      defaultRobotsNoindex = input.defaultRobotsNoindex;
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      siteName,
      defaultMetaDescription,
      defaultSocialMediaId,
      twitterSiteHandle,
      organizationName,
      organizationLogoMediaId,
      defaultRobotsNoindex
    }
  };
}

/**
 * Per-tenant `comments` configuration (Issue #271, ADR-0032 §6) — the pure shape
 * + defaults + validation for `awcms_micro_comments_settings`. Bounds mirror the
 * DB CHECK constraints in sql/089 as an application-layer floor.
 */
import type { CommentPolicyMode } from "./comment-policy";
import { HARD_MAX_DEPTH } from "./comment-thread";

export type CommentSettings = {
  defaultPolicyMode: CommentPolicyMode;
  requireModeration: boolean;
  allowAnonymous: boolean;
  editWindowSeconds: number;
  maxDepth: number;
  maxLength: number;
  maxLinksPerComment: number;
  minSubmitSeconds: number;
  rateLimitPerHour: number;
  blockedTerms: string[];
  turnstileEnabled: boolean;
  notifyOnReply: boolean;
};

export const POLICY_MODES: readonly CommentPolicyMode[] = [
  "disabled",
  "authenticated-only",
  "moderated-anonymous",
  "moderated-registered"
];

export const EDIT_WINDOW_MIN = 0;
export const EDIT_WINDOW_MAX = 86400;
export const MAX_DEPTH_MIN = 0;
export const MAX_DEPTH_MAX = HARD_MAX_DEPTH * 2; // DB CHECK allows 0..8
export const MAX_LENGTH_MIN = 100;
export const MAX_LENGTH_MAX = 4000;
export const MAX_LINKS_MIN = 0;
export const MAX_LINKS_MAX = 20;
export const MIN_SUBMIT_MIN = 0;
export const MIN_SUBMIT_MAX = 600;
export const RATE_LIMIT_MIN = 1;
export const RATE_LIMIT_MAX = 1000;
export const MAX_BLOCKED_TERMS = 200;
export const MAX_BLOCKED_TERM_LENGTH = 100;

export const DEFAULT_COMMENT_SETTINGS: CommentSettings = {
  defaultPolicyMode: "moderated-anonymous",
  requireModeration: true,
  allowAnonymous: true,
  editWindowSeconds: 300,
  maxDepth: 3,
  maxLength: 4000,
  maxLinksPerComment: 2,
  minSubmitSeconds: 3,
  rateLimitPerHour: 10,
  blockedTerms: [],
  turnstileEnabled: false,
  notifyOnReply: false
};

export type CommentSettingsValidation =
  { ok: true; value: CommentSettings } | { ok: false; errors: string[] };

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validate an untrusted settings payload (the PUT body). Every field is optional
 * — omitted fields fall back to `base` (the current stored settings, or
 * `DEFAULT_COMMENT_SETTINGS`), so a partial update is a merge.
 */
export function validateCommentSettings(
  input: unknown,
  base: CommentSettings = DEFAULT_COMMENT_SETTINGS
): CommentSettingsValidation {
  if (!isPlainRecord(input)) {
    return { ok: false, errors: ["Body must be a JSON object."] };
  }

  const errors: string[] = [];
  const next: CommentSettings = {
    ...base,
    blockedTerms: [...base.blockedTerms]
  };

  if ("defaultPolicyMode" in input) {
    const raw = input.defaultPolicyMode;
    if (
      typeof raw !== "string" ||
      !POLICY_MODES.includes(raw as CommentPolicyMode)
    ) {
      errors.push(
        `defaultPolicyMode must be one of ${POLICY_MODES.join(", ")}.`
      );
    } else {
      next.defaultPolicyMode = raw as CommentPolicyMode;
    }
  }

  for (const field of [
    "requireModeration",
    "allowAnonymous",
    "turnstileEnabled",
    "notifyOnReply"
  ] as const) {
    if (field in input) {
      if (typeof input[field] !== "boolean") {
        errors.push(`${field} must be a boolean.`);
      } else {
        next[field] = input[field] as boolean;
      }
    }
  }

  next.editWindowSeconds = boundedInt(
    input,
    "editWindowSeconds",
    base.editWindowSeconds,
    EDIT_WINDOW_MIN,
    EDIT_WINDOW_MAX,
    errors
  );
  next.maxDepth = boundedInt(
    input,
    "maxDepth",
    base.maxDepth,
    MAX_DEPTH_MIN,
    MAX_DEPTH_MAX,
    errors
  );
  next.maxLength = boundedInt(
    input,
    "maxLength",
    base.maxLength,
    MAX_LENGTH_MIN,
    MAX_LENGTH_MAX,
    errors
  );
  next.maxLinksPerComment = boundedInt(
    input,
    "maxLinksPerComment",
    base.maxLinksPerComment,
    MAX_LINKS_MIN,
    MAX_LINKS_MAX,
    errors
  );
  next.minSubmitSeconds = boundedInt(
    input,
    "minSubmitSeconds",
    base.minSubmitSeconds,
    MIN_SUBMIT_MIN,
    MIN_SUBMIT_MAX,
    errors
  );
  next.rateLimitPerHour = boundedInt(
    input,
    "rateLimitPerHour",
    base.rateLimitPerHour,
    RATE_LIMIT_MIN,
    RATE_LIMIT_MAX,
    errors
  );

  if ("blockedTerms" in input) {
    const raw = input.blockedTerms;
    if (!Array.isArray(raw)) {
      errors.push("blockedTerms must be an array of strings.");
    } else if (raw.length > MAX_BLOCKED_TERMS) {
      errors.push(
        `blockedTerms must have at most ${MAX_BLOCKED_TERMS} entries.`
      );
    } else {
      const cleaned: string[] = [];
      for (const entry of raw) {
        if (typeof entry !== "string" || entry.trim().length === 0) {
          errors.push("blockedTerms entries must be non-empty strings.");
          break;
        }
        if (entry.length > MAX_BLOCKED_TERM_LENGTH) {
          errors.push(
            `blockedTerms entries must be <= ${MAX_BLOCKED_TERM_LENGTH} chars.`
          );
          break;
        }
        const normalized = entry.trim();
        if (!cleaned.includes(normalized)) cleaned.push(normalized);
      }
      if (errors.length === 0) next.blockedTerms = cleaned;
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: next };
}

function boundedInt(
  input: Record<string, unknown>,
  field: string,
  fallback: number,
  min: number,
  max: number,
  errors: string[]
): number {
  if (!(field in input)) return fallback;
  const raw = input[field];
  if (typeof raw !== "number" || !Number.isInteger(raw)) {
    errors.push(`${field} must be an integer.`);
    return fallback;
  }
  if (raw < min || raw > max) {
    errors.push(`${field} must be between ${min} and ${max}.`);
    return fallback;
  }
  return raw;
}

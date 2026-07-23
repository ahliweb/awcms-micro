/**
 * Pure validation for the public self-registration endpoint
 * (`POST /api/v1/auth/register`). No I/O — existence/anti-enumeration handling
 * happens in the application layer against the DB. Same shape/style as
 * `password-reset-validation.ts` and `user-management.ts`.
 *
 * Deliberately does NOT accept `roleIds` (or any privilege field): a public
 * caller must never be able to choose its own permissions. Self-registered
 * requests are created with zero roles and remain pending until an admin
 * approves them (and optionally assigns a role at that point). See
 * `application/self-registration.ts`.
 */
import { MIN_PASSWORD_LENGTH } from "./user-management";

export type ValidationError = {
  field: string;
  message: string;
};

export type RegistrationInput = {
  displayName: string;
  loginIdentifier: string;
  password: string;
};

type Result<T> =
  { valid: true; value: T } | { valid: false; errors: ValidationError[] };

const MAX_DISPLAY_NAME_LENGTH = 120;
const MAX_IDENTIFIER_LENGTH = 320;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateRegistrationInput(
  body: unknown
): Result<RegistrationInput> {
  const errors: ValidationError[] = [];
  const record = (body ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(record.displayName)) {
    errors.push({ field: "displayName", message: "displayName is required." });
  } else if (record.displayName.trim().length > MAX_DISPLAY_NAME_LENGTH) {
    errors.push({
      field: "displayName",
      message: `displayName must be at most ${MAX_DISPLAY_NAME_LENGTH} characters.`
    });
  }

  if (!isNonEmptyString(record.loginIdentifier)) {
    errors.push({
      field: "loginIdentifier",
      message: "loginIdentifier is required."
    });
  } else if (record.loginIdentifier.trim().length > MAX_IDENTIFIER_LENGTH) {
    errors.push({
      field: "loginIdentifier",
      message: `loginIdentifier must be at most ${MAX_IDENTIFIER_LENGTH} characters.`
    });
  }

  if (
    typeof record.password !== "string" ||
    record.password.length < MIN_PASSWORD_LENGTH
  ) {
    errors.push({
      field: "password",
      message: `password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    value: {
      displayName: (record.displayName as string).trim(),
      loginIdentifier: (record.loginIdentifier as string).trim(),
      password: record.password as string
    }
  };
}

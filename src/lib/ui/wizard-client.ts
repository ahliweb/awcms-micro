export type WizardStepDefinition = {
  key: string;
  title: string;
  description?: string;
  fields: readonly string[];
};

export type WizardFieldError = {
  field: string;
  message: string;
};

export type WizardValidationResult = {
  valid: boolean;
  errors: WizardFieldError[];
};

export type WizardValidator<TPayload extends Record<string, unknown>> = (
  step: WizardStepDefinition,
  payload: Readonly<TPayload>
) => WizardFieldError[];

export type WizardState = {
  steps: readonly WizardStepDefinition[];
  activeStepIndex: number;
  completedStepKeys: readonly string[];
  fieldErrors: Readonly<Record<string, readonly string[]>>;
};

export type WizardAdvanceResult =
  | { advanced: true; state: WizardState }
  | { advanced: false; state: WizardState; errors: WizardFieldError[] };

export function createWizardState(
  steps: readonly WizardStepDefinition[],
  activeStepKey?: string
): WizardState {
  const normalizedSteps = normalizeWizardSteps(steps);
  const activeStepIndex = activeStepKey
    ? normalizedSteps.findIndex((step) => step.key === activeStepKey)
    : 0;

  if (activeStepIndex < 0) {
    throw new Error(`Unknown wizard step: ${activeStepKey}`);
  }

  return {
    steps: normalizedSteps,
    activeStepIndex,
    completedStepKeys: [],
    fieldErrors: {}
  };
}

export function normalizeWizardSteps(
  steps: readonly WizardStepDefinition[]
): readonly WizardStepDefinition[] {
  if (steps.length === 0) {
    throw new Error("Wizard must define at least one step.");
  }

  const seen = new Set<string>();

  for (const step of steps) {
    const key = step.key.trim();

    if (key.length === 0) {
      throw new Error("Wizard step key is required.");
    }

    if (seen.has(key)) {
      throw new Error(`Duplicate wizard step key: ${key}`);
    }

    seen.add(key);
  }

  return steps.map((step) => ({
    ...step,
    key: step.key.trim(),
    title: step.title.trim()
  }));
}

export function getActiveWizardStep(state: WizardState): WizardStepDefinition {
  const step = state.steps[state.activeStepIndex];

  if (!step) {
    throw new Error("Wizard active step index is out of range.");
  }

  return step;
}

export function getWizardProgress(state: WizardState): {
  current: number;
  total: number;
  percent: number;
  activeStep: WizardStepDefinition;
} {
  const total = state.steps.length;
  const current = state.activeStepIndex + 1;

  return {
    current,
    total,
    percent: Math.round((current / total) * 100),
    activeStep: getActiveWizardStep(state)
  };
}

export function canGoBack(state: WizardState): boolean {
  return state.activeStepIndex > 0;
}

export function canGoForward(state: WizardState): boolean {
  return state.activeStepIndex < state.steps.length - 1;
}

export function validateCurrentWizardStep<
  TPayload extends Record<string, unknown>
>(
  state: WizardState,
  payload: Readonly<TPayload>,
  validator: WizardValidator<TPayload>
): WizardValidationResult {
  const activeStep = getActiveWizardStep(state);
  const errors = validator(activeStep, payload);

  return {
    valid: errors.length === 0,
    errors
  };
}

export function advanceWizard<TPayload extends Record<string, unknown>>(
  state: WizardState,
  payload: Readonly<TPayload>,
  validator: WizardValidator<TPayload>
): WizardAdvanceResult {
  const activeStep = getActiveWizardStep(state);
  const validation = validateCurrentWizardStep(state, payload, validator);

  if (!validation.valid) {
    return {
      advanced: false,
      state: {
        ...state,
        fieldErrors: toFieldErrorMap(validation.errors)
      },
      errors: validation.errors
    };
  }

  const completedStepKeys = uniqueStrings([
    ...state.completedStepKeys,
    activeStep.key
  ]);

  return {
    advanced: true,
    state: {
      ...state,
      activeStepIndex: canGoForward(state)
        ? state.activeStepIndex + 1
        : state.activeStepIndex,
      completedStepKeys,
      fieldErrors: {}
    }
  };
}

export function rewindWizard(state: WizardState): WizardState {
  if (!canGoBack(state)) {
    return state;
  }

  return {
    ...state,
    activeStepIndex: state.activeStepIndex - 1,
    fieldErrors: {}
  };
}

export function jumpToWizardStep(
  state: WizardState,
  stepKey: string
): WizardState {
  const targetIndex = state.steps.findIndex((step) => step.key === stepKey);

  if (targetIndex < 0) {
    throw new Error(`Unknown wizard step: ${stepKey}`);
  }

  const targetStep = state.steps[targetIndex]!;
  const isCurrent = targetIndex === state.activeStepIndex;
  const isCompleted = state.completedStepKeys.includes(targetStep.key);
  const isImmediateNext = targetIndex === state.activeStepIndex + 1;

  if (!isCurrent && !isCompleted && !isImmediateNext) {
    return state;
  }

  return {
    ...state,
    activeStepIndex: targetIndex,
    fieldErrors: {}
  };
}

export function toFieldErrorMap(
  errors: readonly WizardFieldError[]
): Readonly<Record<string, readonly string[]>> {
  const map: Record<string, string[]> = {};

  for (const error of errors) {
    const field = error.field.trim();

    if (field.length === 0) continue;

    map[field] = [...(map[field] ?? []), error.message];
  }

  return map;
}

export function mapValidationDetailsToFieldErrors(
  details: unknown
): WizardFieldError[] {
  if (!Array.isArray(details)) {
    return [];
  }

  const errors: WizardFieldError[] = [];

  for (const detail of details) {
    if (!isRecord(detail)) continue;

    const field = detail.field;
    const message = detail.message;

    if (typeof field !== "string" || typeof message !== "string") continue;
    if (field.trim().length === 0 || message.trim().length === 0) continue;

    errors.push({ field: field.trim(), message: message.trim() });
  }

  return errors;
}

export function getFieldErrors(
  state: WizardState,
  field: string
): readonly string[] {
  return state.fieldErrors[field] ?? [];
}

export function hasFieldError(state: WizardState, field: string): boolean {
  return getFieldErrors(state, field).length > 0;
}

export function createWizardIdempotencyKey(prefix = "wizard-submit"): string {
  const safePrefix = prefix.trim().replace(/[^a-zA-Z0-9:_-]/g, "-");
  const keyPrefix = safePrefix.length > 0 ? safePrefix : "wizard-submit";

  return `${keyPrefix}:${crypto.randomUUID()}`;
}

/**
 * DOM helper (opt-in) — toggle a wizard's `WizardPanel.astro` sections so only
 * `activePanelId` is visible, and play the token-driven slide-up entrance on
 * the newly-activated panel.
 *
 * `WizardPanel.astro` hides inactive steps with the `hidden` attribute (a real
 * `display:none`), a change CSS cannot transition — so this clears `hidden` on
 * the active panel and (re-)adds the `.awcms-animate-slide-up` keyframe class
 * on each activation (removing it and forcing a reflow first, so it replays on
 * every step swap, not just the first). Reduced-motion-safe via the global
 * guard in `tokens.css`.
 *
 * Purely presentational: it mirrors `data-active` for CSS selectors but
 * deliberately does NOT touch `aria-current`, focus, or step validation —
 * those stay owned by the page's own stepper sync, preserving this module's
 * separation between wizard *state* (the pure functions above) and a page's
 * DOM wiring. `doc` defaults to the ambient `document` (injectable for tests).
 *
 * Unlike the pure state helpers above, this touches the DOM — call it only
 * from a browser `<script>`, never from server/render code.
 */
export function activateWizardPanel(
  panelIds: readonly string[],
  activePanelId: string,
  doc: Document = document
): void {
  for (const panelId of panelIds) {
    const panel = doc.getElementById(panelId);
    if (!panel) continue;

    const isActive = panelId === activePanelId;
    panel.hidden = !isActive;
    panel.setAttribute("data-active", isActive ? "true" : "false");
    panel.classList.remove("awcms-animate-slide-up");

    if (isActive) {
      // Force reflow so re-adding the class restarts the entrance animation.
      void panel.offsetWidth;
      panel.classList.add("awcms-animate-slide-up");
    }
  }
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values));
}

/** `value === null` checked before `typeof` narrowing — avoids a CodeQL `js/comparison-between-incompatible-types` false positive on the more common `typeof value === "object" && value !== null` ordering (see `email/domain/email-template-validation.ts`'s `isPlainObject` for the full explanation). Same runtime behavior. */
function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null) {
    return false;
  }

  return typeof value === "object";
}

/**
 * media-library-consistency-check.ts — `bun run media-library:consistency:check`.
 *
 * A read-only consistency gate (Issue #264, epic #261) that fails `bun run
 * check` on the specific class of drift ADR-0026 keeps re-introducing: a
 * declarative artifact still describing `media_library` as it was BEFORE the
 * media-registry extraction completed.
 *
 * The existing gates (`repo:inventory:check`,
 * `modules:composition:inventory:check`) already prove the GENERATED
 * inventories match the live descriptors — but they cannot catch a stale
 * SOURCE COMMENT or a preset that silently disables media for a website
 * tenant, because both are internally consistent with the descriptors they
 * derive from. This gate asserts the cross-cutting FACTS instead:
 *
 *   1. `media_library` is `active`, `type: "system"`, and provides the
 *      `media_library` capability (never the placeholder step-1 registered).
 *   2. The capability-version registry lists `media_library` and no longer
 *      lists the superseded `news_media` key.
 *   3. No active module still declares consuming the retired `news_media`
 *      capability.
 *   4. Every website preset that enables a media CONSUMER (`blog_content` /
 *      `news_portal`) also enables `media_library` — managed media must be
 *      available without requiring a news portal (ADR-0026's product goal).
 *      `media_library` is a non-protected System Foundation module, so a
 *      preset omitting it would DISABLE the registry for that tenant.
 *   5. The media-registry reconciliation job (`news-media:reconcile`) is
 *      declared by `media_library` (which owns the registry it reconciles)
 *      and not by its former owner `news_portal`.
 *   6. The base registry / media descriptor source files contain no live
 *      comment describing `media_library` as experimental / code-less.
 *
 * The helper functions are pure and unit-tested with synthetic good/bad
 * inputs (`tests/unit/media-library-consistency-check.test.ts`); the runner
 * wires them to the real live registry, presets, capability versions, and
 * source files.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ModuleDescriptor } from "../src/modules/_shared/module-contract";
import type { ModulePresetDefinition } from "../src/modules/module-management/domain/module-presets";

/** The capability key `media_library` provides. */
const MEDIA_CAPABILITY = "media_library";
/** The superseded capability key `news_portal` used to provide (ADR-0026). */
const RETIRED_CAPABILITY = "news_media";
/** Media consumers whose presence in a preset requires `media_library` too. */
const MEDIA_CONSUMER_KEYS = ["blog_content", "news_portal"] as const;
/** The reconciliation job command — kept named `news-media:*` (ADR-0026 §3). */
const RECONCILE_JOB_COMMAND = "bun run news-media:reconcile";

/** Source files a live "experimental / code-less" claim would contradict. */
export const MEDIA_DESCRIPTOR_SOURCE_FILES = [
  "src/modules/index.ts",
  "src/modules/media-library/module.ts"
] as const;

/**
 * Phrases that, present in a descriptor source file, describe `media_library`
 * as a placeholder — the exact stale-comment class Issue #264 removes. Matched
 * case-insensitively. Kept deliberately narrow so a legitimate future
 * `experimental` module descriptor elsewhere is not caught by this media gate.
 */
export const FORBIDDEN_PLACEHOLDER_PHRASES = [
  "experimental",
  "owns no code",
  "no code yet",
  "placeholder"
] as const;

export function checkMediaLibraryStatusFacts(
  descriptors: readonly ModuleDescriptor[]
): string[] {
  const media = descriptors.find((d) => d.key === MEDIA_CAPABILITY);
  if (!media) {
    return [
      `media_library is not registered in the module registry — Issue #264 assumes ADR-0026 landed it as an active base module.`
    ];
  }

  const problems: string[] = [];
  if (media.status !== "active") {
    problems.push(
      `media_library.status is "${media.status}", expected "active" (ADR-0026 completed the extraction; it is no longer the step-1 experimental placeholder).`
    );
  }
  if (media.type !== "system") {
    problems.push(
      `media_library.type is "${media.type}", expected "system" (System Foundation module — ADR-0013 #2).`
    );
  }
  const provides = media.capabilities?.provides ?? [];
  if (!provides.includes(MEDIA_CAPABILITY)) {
    problems.push(
      `media_library does not provide the "${MEDIA_CAPABILITY}" capability (provides: ${JSON.stringify(
        provides
      )}) — it owns the media registry every website module consumes.`
    );
  }
  return problems;
}

export function checkCapabilityRegistry(
  versions: Readonly<Record<string, string>>
): string[] {
  const problems: string[] = [];
  if (!(MEDIA_CAPABILITY in versions)) {
    problems.push(
      `CAPABILITY_CONTRACT_VERSIONS is missing the "${MEDIA_CAPABILITY}" key — every base capability a module provides must be versioned here.`
    );
  }
  if (RETIRED_CAPABILITY in versions) {
    problems.push(
      `CAPABILITY_CONTRACT_VERSIONS still lists the superseded "${RETIRED_CAPABILITY}" key — ADR-0026 replaced it with "${MEDIA_CAPABILITY}" (a new key, not a bump), so a derived repo pinned to it must fail to resolve.`
    );
  }
  return problems;
}

export function checkNoConsumerConsumesRetiredCapability(
  descriptors: readonly ModuleDescriptor[]
): string[] {
  const problems: string[] = [];
  for (const descriptor of descriptors) {
    for (const consumed of descriptor.capabilities?.consumes ?? []) {
      if (consumed.capability === RETIRED_CAPABILITY) {
        problems.push(
          `${descriptor.key} still declares consuming the retired "${RETIRED_CAPABILITY}" capability — re-point it to "${MEDIA_CAPABILITY}" (providedBy media_library), ADR-0026 steps 3-4.`
        );
      }
    }
  }
  return problems;
}

export function checkPresetMediaInvariant(
  presets: readonly ModulePresetDefinition[]
): string[] {
  const problems: string[] = [];
  for (const preset of presets) {
    const enablesConsumer = MEDIA_CONSUMER_KEYS.some((key) =>
      preset.enabledModuleKeys.includes(key)
    );
    if (
      enablesConsumer &&
      !preset.enabledModuleKeys.includes(MEDIA_CAPABILITY)
    ) {
      const consumer = MEDIA_CONSUMER_KEYS.filter((key) =>
        preset.enabledModuleKeys.includes(key)
      ).join("/");
      problems.push(
        `preset "${preset.name}" enables ${consumer} but not media_library — applying it would DISABLE managed media for the tenant (media_library is a non-protected System Foundation module). ADR-0026 / Issue #264: managed media must be available without requiring news_portal.`
      );
    }
  }
  return problems;
}

export function checkReconcileJobOwnership(
  descriptors: readonly ModuleDescriptor[]
): string[] {
  const problems: string[] = [];
  const declaresReconcile = (key: string): boolean =>
    (descriptors.find((d) => d.key === key)?.jobs ?? []).some(
      (job) => job.command === RECONCILE_JOB_COMMAND
    );

  if (!declaresReconcile(MEDIA_CAPABILITY)) {
    problems.push(
      `media_library does not declare the "${RECONCILE_JOB_COMMAND}" job — it owns awcms_micro_news_media_objects and the reconciliation code, so the job declaration belongs here (ADR-0026 / Issue #264).`
    );
  }
  if (declaresReconcile("news_portal")) {
    problems.push(
      `news_portal still declares the "${RECONCILE_JOB_COMMAND}" job — it was moved to media_library along with the registry it reconciles (ADR-0026 / Issue #264).`
    );
  }
  return problems;
}

export function checkSourceCommentsNoPlaceholder(
  files: readonly { path: string; content: string }[]
): string[] {
  const problems: string[] = [];
  for (const file of files) {
    const lower = file.content.toLowerCase();
    for (const phrase of FORBIDDEN_PLACEHOLDER_PHRASES) {
      if (lower.includes(phrase)) {
        problems.push(
          `${file.path} contains the phrase "${phrase}" — a descriptor source file must not describe media_library as experimental / code-less (ADR-0026 completed; Issue #264).`
        );
      }
    }
  }
  return problems;
}

export async function runMediaLibraryConsistencyCheck(
  rootDir = process.cwd()
): Promise<string[]> {
  const { listModules } = await import("../src/modules/index");
  const { MODULE_PRESETS } =
    await import("../src/modules/module-management/domain/module-presets");
  const { CAPABILITY_CONTRACT_VERSIONS } =
    await import("../src/modules/_shared/capability-contract-versions");

  const descriptors = listModules();

  const sourceFiles = await Promise.all(
    MEDIA_DESCRIPTOR_SOURCE_FILES.map(async (relPath) => ({
      path: relPath,
      content: await readFile(path.join(rootDir, relPath), "utf8")
    }))
  );

  return [
    ...checkMediaLibraryStatusFacts(descriptors),
    ...checkCapabilityRegistry(CAPABILITY_CONTRACT_VERSIONS),
    ...checkNoConsumerConsumesRetiredCapability(descriptors),
    ...checkPresetMediaInvariant(MODULE_PRESETS),
    ...checkReconcileJobOwnership(descriptors),
    ...checkSourceCommentsNoPlaceholder(sourceFiles)
  ];
}

if (import.meta.main) {
  const problems = await runMediaLibraryConsistencyCheck();

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(problem);
    }
    console.error(
      `\nmedia-library:consistency:check GAGAL — ${problems.length} temuan.`
    );
    process.exitCode = 1;
  } else {
    console.log(
      "media-library:consistency:check OK — media_library status/capability/preset/job facts are consistent."
    );
  }
}

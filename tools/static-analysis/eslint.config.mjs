/**
 * ESLint flat config — correctness gate for the `.astro` layer and the
 * TypeScript sources (Issue #369).
 *
 * WHY THIS FILE LIVES IN `tools/static-analysis/` AND NOT AT THE REPO ROOT
 * ---------------------------------------------------------------------
 * `typescript-eslint` needs TypeScript's *programmatic* API for type-aware
 * rules, and `typescript@7` (the native Go compiler the repository root uses)
 * no longer ships it — its `exports["."]` is `./lib/version.cjs`. Downgrading
 * the root compiler for the sake of tooling would weaken the gate that checks
 * 100% of the `.ts` tree, so the TS-6-bound toolchain is quarantined in this
 * package's own `node_modules` instead. See `scripts/static-analysis.ts` and
 * doc 07 §Gerbang analisis statis.
 *
 * CONSEQUENCE: this config is always run with **cwd = repository root** and
 * `--no-config-lookup`, so every `files`/`ignores` pattern below is relative to
 * the repo root, NOT to this directory. Do NOT add a `basePath` — a config that
 * sets `basePath` while ESLint runs from the isolated directory lints ZERO
 * files and exits 0 with no output at all (a dead-but-green gate; the wrapper
 * script asserts "scanned > 0" precisely because of this).
 *
 * Four further constraints are baked into the shape below; changing them
 * silently breaks the gate rather than failing loudly:
 *
 * 1. `eslint-plugin-astro` decides whether to use the TypeScript parser for
 *    `.astro` by resolving `@typescript-eslint/parser` **from `process.cwd()`**
 *    — which is the repo root, where it deliberately is NOT installed. So the
 *    plugin's own defaults would silently fall back to the plain-JS parser and
 *    every TypeScript frontmatter would fail to parse. This config therefore
 *    sets `parserOptions.parser` and `processor` for `**\/*.astro` EXPLICITLY.
 * 2. Any config object matching `**\/*.astro` that sets
 *    `languageOptions.parser` — including `extends: [tseslint.configs.base]`,
 *    which sets it as a side effect — replaces `astro-eslint-parser`, after
 *    which every `.astro` file fails with "Parsing error: Expression
 *    expected". Register the plugin only.
 * 3. The `<script>` blocks the processor extracts become virtual files
 *    (`page.astro/1_1.ts`) that exist in NO tsconfig program. They must keep
 *    `project: null`; pointing `parserOptions.project` at `tsconfig.json`
 *    makes every block throw "ESLint was configured to run on ..." — and
 *    ESLint SWALLOWS errors thrown inside processor blocks and still exits 0,
 *    so the whole script layer goes silently unchecked. Type-aware rules
 *    therefore cannot run inside `<script>`; `astro check` covers that ground.
 * 4. `@typescript-eslint/no-misused-promises` CRASHES on `.astro` frontmatter
 *    ("Non-null Assertion Failed: Expected node to have a parent", from
 *    `checkReturnStatement` against the synthetic Astro AST). It is enabled
 *    for `.ts` and deliberately NOT for `.astro`.
 */
import path from "node:path";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

/** Repository root — this package sits at `<root>/tools/static-analysis`. */
const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..");

/**
 * Visible, SHRINKING debt list — files exempted from a rule they currently
 * violate. Never widen a rule or add `@ts-ignore`/`any` to get green; add the
 * file here with a reason, and delete the entry when the code is fixed.
 * Mirrored in `docs/awcms-micro/07_sprint_testing_production_readiness.md`
 * §Gerbang analisis statis.
 */
const NO_MISUSED_PROMISES_EXEMPT = [
  // `form.addEventListener("submit", async (event) => ...)` — an async
  // listener where a void return is expected; a rejection inside it becomes an
  // unhandled rejection instead of user-visible feedback. Left as debt because
  // the comments module was being edited in parallel when #369 landed.
  "src/lib/comments/comments-client.ts"
];

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      "coverage/**",
      "graphify-out/**",
      "tools/static-analysis/node_modules/**"
    ]
  },

  // The plugin's own rules. Its parser/processor defaults are re-stated
  // explicitly below (see constraint 1).
  ...astro.configs["flat/recommended"],

  // TypeScript sources: type-aware correctness rules.
  {
    files: ["src/**/*.ts", "scripts/**/*.ts", "tests/**/*.ts"],
    // `src/**/*.ts` also matches the processor's synthetic virtual paths
    // (`src/pages/x.astro/1_1.ts`) — a glob cannot tell them from a real
    // directory. Excluding them here keeps type-aware rules off files that
    // exist in no tsconfig program (see constraint 3).
    ignores: ["**/*.astro/*"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: REPO_ROOT
      }
    },
    rules: {
      // Deliberately a SMALL set, not `js.configs.recommended`: enabling the
      // full recommended set on the existing `.ts` tree reports 20 further
      // problems (measured on v1.1.0 — `no-useless-assignment` ×5,
      // `@typescript-eslint/no-unused-vars` ×7, `preserve-caught-error`,
      // `no-irregular-whitespace`, `no-useless-escape`). Those are real but
      // belong to their own cleanup PR; see doc 07 §Gerbang analisis statis.
      //
      // `no-control-regex` IS enabled because the codebase already carried
      // `// eslint-disable-next-line no-control-regex` directives written for
      // a linter that did not exist yet — the rule makes those honest.
      "no-control-regex": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error"
    }
  },
  {
    files: NO_MISUSED_PROMISES_EXEMPT,
    rules: { "@typescript-eslint/no-misused-promises": "off" }
  },

  // `.astro` frontmatter: type-aware, minus the rule that crashes (see 4).
  // Parser + processor are set explicitly (see 1) — the plugin cannot detect
  // them from the repo root, where the TS-bound toolchain is absent by design.
  {
    files: ["**/*.astro"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    processor: "astro/client-side-ts",
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"]
      }
    },
    rules: {}
  },

  // Inline `<script>` blocks: syntax-level rules only (see 3). Core
  // `no-undef`/`no-unused-vars` do not understand TypeScript syntax — they
  // report type-only identifiers such as `FormDataEntryValue` as undefined —
  // so the typescript-eslint replacement is used instead.
  {
    files: ["**/*.astro/*.ts", "**/*.astro/*.js"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      // BOTH keys are required. `src/**/*.ts` above also matches the virtual
      // path `src/pages/x.astro/1_1.ts` (the glob cannot tell a real directory
      // from the processor's synthetic one), and flat-config `parserOptions`
      // merge shallowly — so `project: null` alone leaves `projectService:
      // true` in place and every block throws "was not found by the project
      // service", which ESLint then swallows while exiting 0.
      parserOptions: { projectService: false, project: null }
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  }
];

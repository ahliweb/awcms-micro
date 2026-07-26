/**
 * ESLint flat config — correctness gate for the `.astro` layer and the
 * TypeScript sources (Issue #369).
 *
 * Before this file the repo had NO ESLint at all: `bun run lint` was
 * `prettier --check` (formatting, not correctness) and `tsc --noEmit` cannot
 * parse `.astro` at all. The two gates added by #369 divide the work like
 * this, and the split is not interchangeable:
 *
 * - `bun run typecheck:astro` (`astro check`) is the ONLY tool that type-checks
 *   `.astro` frontmatter AND the ~19k lines of inline `<script>` browser code.
 * - This config adds type-AWARE rules on `.ts` + `.astro` frontmatter, and
 *   syntax-level rules inside the extracted `<script>` blocks.
 *
 * Three constraints are baked into the shape below; changing them silently
 * breaks the gate rather than failing loudly:
 *
 * 1. `eslint-plugin-astro`'s config supplies the `astro-eslint-parser` and the
 *    `astro/client-side-ts` processor for `**\/*.astro`. Any LATER config
 *    object that sets `languageOptions.parser` for the same files — including
 *    `extends: [tseslint.configs.base]`, which sets it as a side effect —
 *    replaces that parser and every `.astro` file then fails with
 *    "Parsing error: Expression expected". Register the plugin only
 *    (`plugins: { "@typescript-eslint": tseslint.plugin }`) instead.
 * 2. The `<script>` blocks the processor extracts become virtual files
 *    (`page.astro/1_1.ts`) that exist in NO tsconfig program. They must keep
 *    the plugin's `project: null`; pointing `parserOptions.project` at
 *    `tsconfig.json` makes every block throw "ESLint was configured to run
 *    on ..." — and ESLint SWALLOWS errors thrown inside processor blocks and
 *    still exits 0, so the whole script layer goes silently unchecked.
 *    Type-aware rules therefore cannot run inside `<script>`; `astro check`
 *    covers that ground instead.
 * 3. `@typescript-eslint/no-misused-promises` CRASHES on `.astro` frontmatter
 *    ("Non-null Assertion Failed: Expected node to have a parent", from
 *    `checkReturnStatement` against the synthetic Astro AST). It is enabled
 *    for `.ts` and deliberately NOT for `.astro`.
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

/**
 * Visible, SHRINKING debt list — files exempted from a rule they currently
 * violate. Never widen a rule or add `@ts-ignore`/`any` to get green; add the
 * file here with a reason, and delete the entry when the code is fixed.
 * Mirrored in `docs/awcms-micro/07_testing_qa.md` §Gerbang analisis statis.
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
      "graphify-out/**"
    ]
  },

  // Parser + `astro/client-side-ts` processor + the plugin's own rules.
  ...astro.configs["flat/recommended"],

  // TypeScript sources: type-aware correctness rules.
  {
    files: ["src/**/*.ts", "scripts/**/*.ts", "tests/**/*.ts"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
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

  // `.astro` frontmatter: type-aware, minus the rule that crashes (see 3).
  {
    files: ["**/*.astro"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".astro"]
      }
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error"
    }
  },

  // Inline `<script>` blocks: syntax-level rules only (see 2). Core
  // `no-undef`/`no-unused-vars` do not understand TypeScript syntax — they
  // report type-only identifiers such as `FormDataEntryValue` as undefined —
  // so the typescript-eslint replacement is used instead.
  {
    files: ["**/*.astro/*.ts", "**/*.astro/*.js"],
    plugins: { "@typescript-eslint": tseslint.plugin },
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

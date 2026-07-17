---
"awcms-micro": patch
---

Remove the stale `reference-data:contributions:check` step from `ci.yml` (the script was dropped with the unported `reference_data` module), and add `tests/unit/workflow-script-parity.test.ts` asserting every `bun run <script>` a workflow invokes resolves to a real `package.json` script.

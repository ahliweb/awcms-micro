#!/usr/bin/env node

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const workflows = resolve(root, ".github", "workflows");

const checkout = "de0fac2e4500dabe0009e67214ff5f5447ce83dd";
const pnpmSetup = "0e279bb959325dab635dd2c09392533439d90093";
const setupNode = "48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e";
const inputsRef = "${{ inputs.ref }}";
const inputsRunId = "${{ inputs.run_id }}";
const inputsPublishOnly = "${{ inputs.publish-only }}";
const githubToken = "${{ github.token }}";
const workflowConcurrency = "${{ github.workflow }}-${{ github.ref }}";

mkdirSync(workflows, { recursive: true });

writeFileSync(
	resolve(workflows, "auto-extract.yml"),
	`name: Locale Extract (Manual)

on:
  workflow_dispatch:
    inputs:
      ref:
        description: Git ref to check out
        required: false
        default: main

permissions: {}

concurrency:
  group: locale-extract-manual
  cancel-in-progress: false

jobs:
  extract:
    name: Extract
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@${checkout} # v6.0.2
        with:
          ref: ${inputsRef}
          persist-credentials: false

      - uses: pnpm/action-setup@${pnpmSetup} # v6.0.8

      - uses: actions/setup-node@${setupNode} # v6.4.0
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm locale:extract

      - name: Show diff
        run: git diff -- packages/admin/src/locales
`,
);

writeFileSync(
	resolve(workflows, "auto-format.yml"),
	`name: Format (Manual)

on:
  workflow_dispatch:
    inputs:
      ref:
        description: Git ref to check out
        required: false
        default: main

permissions: {}

concurrency:
  group: format-manual
  cancel-in-progress: false

jobs:
  format:
    name: Format
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@${checkout} # v6.0.2
        with:
          ref: ${inputsRef}
          persist-credentials: false

      - uses: pnpm/action-setup@${pnpmSetup} # v6.0.8

      - uses: actions/setup-node@${setupNode} # v6.4.0
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Run formatter
        run: pnpm format

      - name: Show diff
        run: git diff -- .
`,
);

writeFileSync(
	resolve(workflows, "format-command.yml"),
	`name: Format Command (Manual)

on:
  workflow_dispatch:
    inputs:
      ref:
        description: Git ref to check out
        required: false
        default: main

permissions: {}

jobs:
  format:
    name: Format
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@${checkout} # v6.0.2
        with:
          ref: ${inputsRef}
          persist-credentials: false

      - uses: pnpm/action-setup@${pnpmSetup} # v6.0.8

      - uses: actions/setup-node@${setupNode} # v6.4.0
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Run formatter
        run: pnpm format

      - name: Show diff
        run: git diff -- .
`,
);

writeFileSync(
	resolve(workflows, "query-counts-apply.yml"),
	`name: Query Counts Apply (Manual)

on:
  workflow_dispatch:
    inputs:
      run_id:
        description: Workflow run ID for Query Counts artifact download
        required: true

permissions:
  actions: read
  contents: read

jobs:
  apply:
    name: Apply
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Download snapshot artifact
        id: download
        uses: actions/github-script@3a2844b7e9c422d3c10d287c895573f7108da1b3 # v9.0.0
        with:
          github-token: ${githubToken}
          script: |
            const fs = require('node:fs');
            const path = require('node:path');
            const runId = Number(process.env.RUN_ID);
            if (!Number.isInteger(runId) || runId <= 0) {
              core.setFailed('Invalid run_id input');
              return;
            }
            const { data } = await github.rest.actions.listWorkflowRunArtifacts({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: runId,
            });
            const artifact = data.artifacts.find((a) => a.name === 'query-counts-snapshots');
            if (!artifact) {
              core.setFailed('query-counts-snapshots artifact not found for run ' + runId);
              return;
            }
            const download = await github.rest.actions.downloadArtifact({
              owner: context.repo.owner,
              repo: context.repo.repo,
              artifact_id: artifact.id,
              archive_format: 'zip',
            });
            const outDir = path.join(process.env.RUNNER_TEMP, 'qc-artifact');
            fs.mkdirSync(outDir, { recursive: true });
            fs.writeFileSync(path.join(outDir, 'artifact.zip'), Buffer.from(download.data));
            core.setOutput('dir', outDir);
        env:
          RUN_ID: ${inputsRunId}

      - name: Unpack artifact
        run: |
          cd "$RUNNER_TEMP/qc-artifact"
          unzip -o artifact.zip

      - uses: actions/checkout@${checkout} # v6.0.2
        with:
          persist-credentials: false

      - name: Apply snapshots locally
        run: |
          cp "$RUNNER_TEMP/qc-artifact/query-counts.snapshot.sqlite.json" scripts/
          cp "$RUNNER_TEMP/qc-artifact/query-counts.snapshot.d1.json" scripts/

      - name: Show diff
        run: git diff -- scripts/query-counts.snapshot.sqlite.json scripts/query-counts.snapshot.d1.json
`,
);

writeFileSync(
	resolve(workflows, "release.yml"),
	`name: Release (Manual)

on:
  workflow_dispatch:
    inputs:
      publish-only:
        description: Skip versioning, just publish current versions
        type: boolean
        default: false

permissions: {}

concurrency: ${workflowConcurrency}

jobs:
  release:
    name: Release Prep
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@${checkout} # v6.0.2
        with:
          fetch-depth: 0
          persist-credentials: false

      - uses: pnpm/action-setup@${pnpmSetup} # v6.0.8

      - uses: actions/setup-node@${setupNode} # v6.4.0
        with:
          node-version: 24
          cache: pnpm
          registry-url: https://registry.npmjs.org

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build

      - name: Block 1.x releases (we are in 0.x)
        run: node .github/scripts/check-no-major.mjs

      - name: Release instructions
        run: |
          if [ "${inputsPublishOnly}" = "true" ]; then
            echo "Publish the current versions manually from a trusted local environment."
          else
            echo "Create the release PR manually after running pnpm changeset version locally."
          fi
`,
);

writeFileSync(
	resolve(workflows, "sync-templates.yml"),
	`name: Sync Templates (Manual)

on:
  workflow_dispatch:

jobs:
  sync:
    name: Sync templates preview
    runs-on: ubuntu-latest
    permissions: {}
    steps:
      - uses: actions/checkout@${checkout} # v6.0.2
        with:
          persist-credentials: false

      - uses: pnpm/action-setup@${pnpmSetup} # v6.0.8

      - uses: actions/setup-node@${setupNode} # v6.4.0
        with:
          node-version: 22

      - run: pnpm install --frozen-lockfile

      - name: Preview template sync
        run: node scripts/sync-templates-repo.mjs --dry-run
`,
);

rmSync(resolve(workflows, "dependabot-approve.yml"), { force: true });

---
name: read-write-install
description: Use when the user asks to inspect files, modify code, create files, or install dependencies/packages directly as part of implementation work. Prefer acting end-to-end instead of stopping at analysis.
---

# Read, Write, and Install

Use this skill when the task requires actual implementation work in the local workspace, especially when it includes one or more of these actions:

- read the relevant files before making decisions
- edit or create files to complete the task
- install missing dependencies or tools needed for the implementation

## Operating Rules

1. Read the relevant files first.
2. Make the smallest correct change.
3. If a dependency is clearly required, install it directly instead of stopping to ask for permission.
4. Prefer completing the implementation end-to-end in one pass.
5. Keep edits scoped to the task.

## Reading

- Read the actual target files before changing them.
- Read surrounding configuration when the task touches build, package management, or runtime integration.
- If behavior depends on sibling implementations, inspect at least one nearby example first.
- If official local or repository documentation does not cover the required library or framework behavior, use Context7 to look up the current documentation before guessing.

## Writing

- Use the repo's normal editing flow and preserve existing structure.
- Prefer minimal patches over broad rewrites.
- Add new files only when they materially improve the implementation or documentation.

## Installing

When installation is needed:

- Use the package manager already used by the target project.
- Install only what the implementation actually needs.
- Prefer local project dependencies over global installs.
- If working in a workspace, install from the correct workspace root unless the target package specifically needs isolated installation.

Examples:

- `pnpm install`
- `pnpm add <pkg>`
- `pnpm add -D <pkg>`
- `npm install`

## Verification Mindset

- After changes, check the closest available validation path for the touched area.
- If full verification is not possible, state the limitation clearly and still leave the files in a coherent state.
- If implementation depends on undocumented external API details, verify those details from official docs first and fall back to Context7 when official docs are not locally available or are insufficient.

## Do Not

- Do not install unrelated packages.
- Do not make speculative refactors outside the requested scope.
- Do not stop at a plan if the task is ready for implementation.

# Implementation Instructions

## Mandate

Analyze `https://github.com/emdash-cms/emdash`, then update `https://github.com/ahliweb/awcms-micro` so the repository stays fully synchronized with EmDash.

## Repository Identity

`awcms-micro` is an independent repository. It must not act as a host for other repositories. It should serve as an example repository that fully adopts EmDash 100% and includes only example plugins that follow the AWCMS-Micro standard, without modifying any part of EmDash core.

## Practical Interpretation In This Parent Workspace

- Use `emdash-latest/` as the latest upstream reference source.
- Use `awcmsmicro-dev/` as the actual AWCMS-Micro working tree.
- Keep the root repository focused on synchronization, documentation, and maintenance workflow.

## Execution Strategy

- Proceed step by step using an atomic strategy.
- Prefer small, reviewable changes.
- Separate upstream refresh work from AWCMS-Micro adaptation work whenever practical.
- Keep documentation synchronized with the actual repository state.

## Task Splitting Guidance

If a task is too large for one pass, create smaller tracked follow-ups. If useful, create GitHub issues so work can later be implemented by a smaller or lower-cost AI model.

## Decision Rule

When choosing where a change belongs:

- if it represents upstream EmDash, it belongs in `emdash-latest/`
- if it represents AWCMS-Micro example implementation work, it belongs in `awcmsmicro-dev/`
- if it changes repository governance or operator workflow, it belongs in the root docs or `scripts/`

## Language Rule

- Use English (US) for root-level documentation, instructions, scripts, and governance text.
- Preserve upstream wording in `emdash-latest/`, including non-US spelling.
- Accept inherited upstream wording in `awcmsmicro-dev/` when it comes from synchronization rather than AWCMS-Micro-specific authorship.

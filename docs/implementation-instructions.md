# Implementation Instructions

## Mandate

Analyze the `https://github.com/emdash-cms/emdash` repository, then update the current repository, `https://github.com/ahliweb/awcms-micro`, so that it is fully synchronized with the EmDash repository.

## Repository Identity

The `awcms-micro` repository is an independent repository. It must not act as a host for other repositories. Instead, it should serve as an example repository that fully adopts EmDash 100% and includes only example plugins that follow the AWCMS-Micro standard, without modifying any part of EmDash.

## Execution Strategy

Proceed step by step using an atomic strategy.

## Task Splitting Guidance

If necessary, create GitHub issues so the work can be implemented later by a smaller or lower-cost AI model.

## Practical Interpretation In This Parent Workspace

- Use `emdash-latest/` as the latest reference source
- Use `awcmsmicro-dev/` as the actual AWCMS-Micro working tree
- Keep root docs aligned with the current process and folder layout

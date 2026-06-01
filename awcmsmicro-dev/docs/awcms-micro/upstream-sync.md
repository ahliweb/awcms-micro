# AWCMS-Micro Upstream Sync Checks

This document records SIKESRA-specific checks that must run after EmDash update or AWCMS-Micro rebuild work.

## SIKESRA Compatibility Questions

Every sync pass must answer:

- Did the EmDash plugin API change?
- Did admin route or page registration change?
- Did plugin route handling change?
- Did auth or user context change?
- Did storage, D1, or migration integration change?
- Did Cloudflare adapter behavior change?
- Did i18n behavior change?
- Did any SIKESRA route or page fail after rebuild?
- Were SIKESRA D1 migrations preserved?
- Was the divergence log updated when behavior changed?

## Required Local Commands

Run from `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra`:

```bash
pnpm awcms:sikesra:validate-after-emdash-sync
```

Run template validation when template or Cloudflare behavior changed:

```bash
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default typecheck
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default build
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare validate:cloudflare-env
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare typecheck
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare build
```

## Data Safety

Before high-risk rebuild or migration work, record the output of:

```bash
pnpm --dir awcmsmicro-dev/packages/plugins/awcms-micro-sikesra awcms:sikesra:backup-inventory
```

Production row counts and R2 object inventories require environment-specific D1/R2 export tooling and must not rely on source checks alone.

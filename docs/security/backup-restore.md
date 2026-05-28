# Backup and Restore

## Baseline

- define D1 backup cadence
- define R2 object protection and recovery expectations
- test restore procedures before production launch
- record who can trigger backup and restore operations
- keep mirror/recovery config in encrypted backup files and overlay local `.env` values only through `scripts/backup/load-config.sh`
- prefer the current PAT-based GitLab mirror flow for backup and recovery automation

## Minimum Evidence

- documented backup schedule
- restore test notes
- rollback decision owner

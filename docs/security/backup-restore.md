# Backup and Restore

## Baseline

- D1 backups run daily at 2 AM UTC via `.github/workflows/backup-automated.yml`
- Additional backups trigger automatically on push with database migration changes via `.github/workflows/backup-on-db-changes.yml`
- R2 objects in `awcms-micro-media` are protected; backup copies stored in `awcms-micro-backups`
- Backups encrypted with AES-256-CBC (passphrase stored in GitHub Secrets `BACKUP_PASSPHRASE`)
- Backup retention: 7 most recent backups kept in R2
- Mirror/recovery config in encrypted backup files; local `.env` overlay via `scripts/backup/load-config.sh`
- PAT-based GitLab mirror flow for code backup and recovery

## Backup Schedule

| Type | Schedule | Trigger | Retention |
|------|----------|---------|-----------|
| D1 Database | Daily 2 AM UTC | Cron | 7 backups |
| D1 Database | On push to main with migration changes | Path trigger | 7 backups |
| Code | Every push to main | GitLab mirror | Permanent |
| R2 Media | Manual (as needed) | - | - |

## Backup Storage

| Resource | Location | Notes |
|----------|----------|-------|
| D1 Backups | `awcms-micro-backups/backups/db/backup-YYYYMMDD-HHMMSS.sql.enc` | Encrypted SQL dump |
| Code Mirror | `gitlab.com:ahliweb/awcms-micro.git` | Full repository mirror |
| R2 Media | `awcms-micro-media` | Original files |

## Restore Procedures

### Restore D1 Database from Backup

1. **Identify backup**: List available backups in R2:
   ```bash
   wrangler r2 object list awcms-micro-backups --prefix "backups/db/" --remote
   ```

2. **Download backup**:
   ```bash
   wrangler r2 object get awcms-micro-backups/backups/db/backup-YYYYMMDD-HHMMSS.sql.enc --remote --file /tmp/backup.sql.enc
   ```

3. **Decrypt backup**:
   ```bash
   openssl enc -aes-256-cbc -d -salt -pbkdf2 \
     -in /tmp/backup.sql.enc \
     -out /tmp/backup.sql \
     -pass pass:"$BACKUP_PASSPHRASE"
   ```

4. **Restore to D1**:
   ```bash
   wrangler d1 execute awcms-micro-d1 --remote --file /tmp/backup.sql
   ```

5. **Rebuild FTS5 indexes** (if applicable):
   ```sql
   INSERT INTO _emdash_fts_news(_emdash_fts_news) VALUES('rebuild');
   ```

6. **Verify restore**: Check table counts and sample data.

### Restore from GitLab Mirror

1. **Clone from GitLab**:
   ```bash
   git clone git@gitlab.com:ahliweb/awcms-micro.git
   cd awcms-micro
   ```

2. **Restore secrets**:
   ```bash
   bash scripts/backup/decrypt-config.sh
   bash scripts/backup/load-config.sh
   ```

3. **Deploy**:
   ```bash
   cd awcmsmicro-dev
   pnpm install
   pnpm build
   pnpm --filter @awcms-micro/template-default-cloudflare exec wrangler deploy
   ```

## Testing Restore Procedures

- Test restore quarterly or after major schema changes
- Document restore test results in this file
- Verify admin page accessibility after restore
- Verify content integrity (sample records, media links)

## Roles and Permissions

| Role | Backup | Restore | Notes |
|------|--------|---------|-------|
| Repository Admin | ✅ | ✅ | Full access to Cloudflare and GitHub |
| Developer | ✅ (via workflow) | ❌ | Can trigger workflow_dispatch |
| Viewer | ❌ | ❌ | Read-only access |

## Minimum Evidence

- [x] Documented backup schedule (above)
- [x] GitHub workflows configured and tested
- [ ] Restore test notes (run quarterly)
- [x] Rollback decision owner: Repository Admin

## Troubleshooting

### D1 Export Fails with FTS5 Error

The `wrangler d1 export` command fails when FTS5 virtual tables are present. Workaround:
```bash
# Export only non-FTS tables
TABLES=$(wrangler d1 execute awcms-micro-d1 --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_emdash_fts_%' ORDER BY name;" | jq -r '.[0].results[].name' | tr '\n' ' ')
wrangler d1 export awcms-micro-d1 --remote --output backup.sql $(echo $TABLES | sed 's/ / --table /g' | sed 's/^/--table /') -y
```

### R2 Upload Fails

Ensure `--remote` flag is used:
```bash
wrangler r2 object put bucket/key --file file.ext --remote -y
```

### Backup Passphrase Lost

Contact repository admin. Passphrase stored in:
- GitHub Secrets: `BACKUP_PASSPHRASE`
- Encrypted config: `scripts/backup/.backup-config.age`
- Local `.env` (if available)

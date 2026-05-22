# R2 Storage

## Intended Example Resource

- Public media domain: `awcms-micro-s3.ahlikoding.com`

## Purpose

- store uploaded media and exported assets
- provide a public object delivery endpoint through Cloudflare-managed custom domains

## Guidance

- bind the bucket in `wrangler` as `MEDIA`
- prefer signed URLs for non-public or sensitive files
- separate tenant-aware prefixes when multi-tenant storage is introduced
- validate upload MIME type, file size, and path rules before write operations

# Workers and Pages

## Runtime Decision

Use Cloudflare Workers for EmDash-compatible server output when D1 and R2 bindings are required at runtime.

## Example Domain

- `awcms-micro.ahlikoding.com`

## Notes

- align route patterns with the chosen Worker name
- keep environment variables and secrets separate from committed configuration
- prepare rollback steps before replacing production routes or bindings

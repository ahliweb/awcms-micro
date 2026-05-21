# Deployment Checklist

## Before Deployment

- confirm Worker or Pages target is correct
- confirm D1 binding is present
- confirm R2 binding is present
- confirm environment variables are set
- confirm secrets are set outside git
- confirm custom domains are attached
- confirm SSL/TLS is active
- confirm WAF or basic hardening rules are enabled

## During Deployment

- run build validation
- verify route and domain bindings
- verify database connectivity
- verify media upload and retrieval

## After Deployment

- verify login and admin access
- verify public page rendering
- verify content create and update flows
- verify rollback instructions are available if deployment needs to be reverted

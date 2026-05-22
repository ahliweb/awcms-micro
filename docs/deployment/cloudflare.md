# Cloudflare Deployment Overview

This document describes the Cloudflare deployment model for AWCMS-Micro example environments.

## Example Production Shape

- Base domain: `awcms-micro.ahlikoding.com`
- Storage domain: `awcms-micro-s3.ahlikoding.com`
- D1 database name: `awcms-micro-d1`

## Required Cloudflare Resources

- Workers or Pages runtime for the public application
- D1 database for application data
- R2 bucket for media and file storage
- KV only when a specific feature requires it
- environment variables and secrets for deployment-time configuration
- custom domains for the app and public storage edge
- SSL/TLS for all public endpoints
- WAF and baseline hardening rules

## Security Rule

Never commit live Cloudflare tokens, account IDs, zone IDs, database IDs, or private credentials to repository documentation. Use placeholders in committed examples.

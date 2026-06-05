# AWCMS-Micro Docs Plugin

This package provides the example documentation plugin for AWCMS-Micro.

It exposes:

- a native EmDash plugin descriptor
- an admin page at `/_emdash/admin/plugins/awcms-micro-docs/`
- shared docs copy for the public `/docs` route

The package is intentionally small and stays inside the approved AWCMS-Micro plugin boundary.

```mermaid
flowchart LR
  Plugin[Docs plugin] --> Descriptor[EmDash descriptor]
  Plugin --> Admin[Admin page]
  Plugin --> Copy[Shared docs copy]
  Copy --> PublicDocs[Template /docs route]
```

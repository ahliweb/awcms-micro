# Upload Security

## Controls

- validate MIME type and file extension
- validate file size and upload path
- separate public and restricted assets when required
- prefer signed URLs for restricted access
- review image processing and metadata handling before production use

```mermaid
flowchart LR
  Upload[Upload request] --> Type[Validate MIME and extension]
  Type --> Size[Validate size and path]
  Size --> Classify{Public or restricted?}
  Classify -->|Public| PublicStore[Public R2 object]
  Classify -->|Restricted| RestrictedStore[Restricted object]
  RestrictedStore --> Signed[Signed URL or app-mediated access]
```

## R2 Notes

Public R2 delivery should be limited to files intended for public access. Sensitive or controlled assets should use signed URLs or application-mediated delivery.

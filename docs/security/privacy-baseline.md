# Privacy Baseline

## Principles

- collect only the personal data needed for the documented service purpose
- document legal basis, notice, and consent expectations where relevant
- support correction, export, and deletion workflows for personal data
- define retention periods before production usage

```mermaid
flowchart TD
  Purpose[Documented service purpose] --> Minimize[Data minimization]
  Minimize --> Notice[Notice and consent expectations]
  Notice --> Rights[Correction, export, deletion workflows]
  Rights --> Retention[Defined retention period]
  Retention --> Audit[Privacy-relevant audit trail]
```

## Operational Expectations

- separate public content data from operator or user personal data
- keep audit trails for privacy-relevant changes
- review data-sharing and processor dependencies during deployment planning

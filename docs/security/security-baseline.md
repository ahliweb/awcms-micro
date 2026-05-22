# Security Baseline

## Baseline Controls

- role-based access control for current operational roles
- ABAC-readiness for future tenant and contextual policy checks
- least-privilege defaults for operators and integrations
- secure secret management outside source control
- input validation and output escaping at all trust boundaries
- audit logging for sensitive actions
- soft delete and recovery-aware data handling where applicable

## Implementation Approach

AWCMS-Micro should inherit EmDash security mechanisms where available and document additional operational controls at the parent-repository level.

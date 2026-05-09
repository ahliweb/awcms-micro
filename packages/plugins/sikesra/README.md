# SIKESRA Plugin Shell

This package is the initial EmDash-native plugin shell for SIKESRA.

Current scope is intentionally minimal:

1. Descriptor factory (`sikesraPlugin`) for host registration.
2. Runtime plugin factory (`createPlugin`) using `definePlugin`.
3. API utility scaffolding for request IDs and response envelopes.

No business workflows, API contracts, data model, ABAC, audit, or UI implementation are included yet.

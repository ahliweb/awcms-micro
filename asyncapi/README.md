# AsyncAPI Contracts

Baseline AsyncAPI tersedia di [`awcms-micro-domain-events.asyncapi.yaml`](awcms-micro-domain-events.asyncapi.yaml).

Setiap event yang dideklarasikan modul pada `ModuleDescriptor.events.publishes` wajib didaftarkan pada AsyncAPI dan lulus:

```bash
bun run api:spec:check
```

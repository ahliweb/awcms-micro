---
"awcms-micro": patch
---

CI: bump `docker/build-push-action` from 6.19.2 to 7.3.0 (SHA-pinned) in `.github/workflows/release.yml`. No application code, contract, schema, or runtime-behavior change — this only affects the release image-build job (v7 requires Buildx, which the workflow already provides). Exercised by the next release run's Docker build.

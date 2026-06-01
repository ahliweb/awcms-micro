import type { SikesraD1Database, SikesraRepositoryScope } from "../connection.js";
import { createAbacRepository } from "./abac-repository.js";
import { createAccessRepository } from "./access-repository.js";
import { createAuditRepository } from "./audit-repository.js";
import { createDocumentsRepository } from "./documents-repository.js";
import { createImportRepository } from "./import-repository.js";
import { createRegionsRepository } from "./regions-repository.js";
import { createRegistryRepository } from "./registry-repository.js";
import { createSettingsRepository } from "./settings-repository.js";
import { createVerificationRepository } from "./verification-repository.js";

export function createSikesraRepositories(db: SikesraD1Database, scope: SikesraRepositoryScope) {
	return {
		settings: createSettingsRepository(db, scope),
		regions: createRegionsRepository(db, scope),
		registry: createRegistryRepository(db, scope),
		verification: createVerificationRepository(db, scope),
		documents: createDocumentsRepository(db, scope),
		imports: createImportRepository(db, scope),
		access: createAccessRepository(db, scope),
		abac: createAbacRepository(db, scope),
		audit: createAuditRepository(db, scope),
	};
}

import {
	sikesraOk,
	type SikesraApiSuccess,
	type SikesraRegistryListItemDto,
} from "../contracts/index.js";
import type { SikesraScopedRepository } from "../db/index.js";
import type { SikesraRegistryEntityRow } from "../db/repositories/registry-repository.js";
import { serializeRegistryListItem } from "../serializers/index.js";

export interface SikesraRegistryService {
	listRegistry(): Promise<SikesraApiSuccess<{ items: SikesraRegistryListItemDto[] }>>;
}

export function createRegistryService(
	repository: SikesraScopedRepository<SikesraRegistryEntityRow>,
): SikesraRegistryService {
	return {
		async listRegistry() {
			const rows = await repository.listActive();
			return sikesraOk({ items: rows.map(serializeRegistryListItem) });
		},
	};
}

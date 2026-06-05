import type { SikesraImportPromotionRequest } from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

export interface SikesraImportPromotionDto {
	batchId: string;
	status: "ready_for_promotion";
	rowIds: string[];
	rowCount: number;
	mode: "selected_rows" | "all_valid_rows";
}

export interface SikesraImportService {
	promote(input: SikesraImportPromotionRequest): Promise<SikesraServiceResult<SikesraImportPromotionDto>>;
}

function normalizeRowIds(rowIds: string[] | undefined) {
	return [...new Set((rowIds ?? []).map((rowId) => rowId.trim()).filter(Boolean))];
}

export function createImportService(): SikesraImportService {
	return {
		async promote(input) {
			const batchId = input.batchId?.trim() ?? "";
			if (!batchId) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Import promotion requires a staged batch ID.",
					fieldErrors: { batchId: ["Import promotion requires a staged batch ID."] },
				});
			}
			if (input.rows && input.rows.length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Import promotion must use staged rows from an existing batch.",
					fieldErrors: { rows: ["Inline rows are not accepted during promotion."] },
				});
			}
			const rowIds = normalizeRowIds(input.rowIds);
			return serviceOk({
				batchId,
				status: "ready_for_promotion",
				rowIds,
				rowCount: rowIds.length,
				mode: rowIds.length > 0 ? "selected_rows" : "all_valid_rows",
			});
		},
	};
}

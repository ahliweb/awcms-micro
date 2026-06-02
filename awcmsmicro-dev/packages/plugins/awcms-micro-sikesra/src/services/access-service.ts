import type {
	SikesraAccessPreviewRequest,
	SikesraRoleAssignmentRequest,
} from "../contracts/index.js";
import { serviceNotImplemented, type SikesraServiceResult } from "./service-result.js";

export interface SikesraAccessService {
	assignRoles(input: SikesraRoleAssignmentRequest): Promise<SikesraServiceResult<unknown>>;
	preview(input: SikesraAccessPreviewRequest): Promise<SikesraServiceResult<unknown>>;
}

export function createAccessService(): SikesraAccessService {
	return {
		async assignRoles() {
			return serviceNotImplemented("Access role assignment");
		},
		async preview() {
			return serviceNotImplemented("Access preview");
		},
	};
}

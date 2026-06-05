import type {
	SikesraAccessPreviewDto,
	SikesraAccessPreviewRequest,
	SikesraRoleAssignmentRequest,
} from "../contracts/index.js";
import { SIKESRA_ERROR_CODES, sikesraError } from "../contracts/index.js";
import { serviceOk, type SikesraServiceResult } from "./service-result.js";

export interface SikesraRoleAssignmentDto {
	id: string;
	emdashUserId: string;
	roles: string[];
	regionScopeType?: string;
	regionScopeCode?: string;
	organizationScopeType?: string;
	organizationScopeCode?: string;
	status: "pending_persistence";
}

export interface SikesraAccessService {
	assignRoles(input: SikesraRoleAssignmentRequest): Promise<SikesraServiceResult<SikesraRoleAssignmentDto>>;
	preview(input: SikesraAccessPreviewRequest): Promise<SikesraServiceResult<SikesraAccessPreviewDto>>;
}

export interface SikesraAccessServiceRoleAssignment {
	userId: string;
	roles: string[];
	isActive?: boolean;
}

export interface SikesraAccessServiceRolePermissionAssignment {
	roleSlug: string;
	permissions: string[];
}

export interface SikesraAccessServiceOptions {
	userRoleAssignments?: SikesraAccessServiceRoleAssignment[];
	rolePermissionAssignments?: SikesraAccessServiceRolePermissionAssignment[];
}

function validateAccessPreview(input: SikesraAccessPreviewRequest) {
	const fieldErrors: Record<string, string[]> = {};
	if (!input.userId.trim()) fieldErrors.userId = ["User ID is required."];
	if (!input.permissionSlug.trim()) fieldErrors.permissionSlug = ["Permission slug is required."];
	return fieldErrors;
}

function validateRoleAssignment(input: SikesraRoleAssignmentRequest) {
	const fieldErrors: Record<string, string[]> = {};
	if (!input.emdashUserId.trim()) fieldErrors.emdashUserId = ["EmDash user ID is required."];
	if (uniqueSorted(input.roles).length === 0) {
		fieldErrors.roles = ["At least one SIKESRA role is required."];
	}
	return fieldErrors;
}

function uniqueSorted(values: string[]) {
	return [...new Set(values.map((value) => value.trim()).filter(Boolean))].toSorted((a, b) =>
		a.localeCompare(b),
	);
}

export function createAccessService(options: SikesraAccessServiceOptions = {}): SikesraAccessService {
	return {
		async assignRoles(input) {
			const fieldErrors = validateRoleAssignment(input);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Role assignment failed validation.",
					fieldErrors,
				});
			}

			const emdashUserId = input.emdashUserId.trim();
			return serviceOk({
				id: `role-assignment:${emdashUserId}`,
				emdashUserId,
				roles: uniqueSorted(input.roles),
				regionScopeType: input.regionScopeType?.trim() || undefined,
				regionScopeCode: input.regionScopeCode?.trim() || undefined,
				organizationScopeType: input.organizationScopeType?.trim() || undefined,
				organizationScopeCode: input.organizationScopeCode?.trim() || undefined,
				status: "pending_persistence",
			});
		},
		async preview(input) {
			const fieldErrors = validateAccessPreview(input);
			if (Object.keys(fieldErrors).length > 0) {
				return sikesraError({
					code: SIKESRA_ERROR_CODES.validation,
					message: "Access preview failed validation.",
					fieldErrors,
				});
			}

			const userId = input.userId.trim();
			const permissionSlug = input.permissionSlug.trim();
			const userAssignment = options.userRoleAssignments?.find(
				(assignment) => assignment.userId.trim() === userId,
			);

			if (!userAssignment || userAssignment.isActive === false) {
				return serviceOk({
					userId,
					permissionSlug,
					allowed: false,
					matchedRoles: [],
					deniedReasons: [`No active role assignment found for ${userId}.`],
				});
			}

			const rolePermissionAssignments = options.rolePermissionAssignments ?? [];
			const userRoles = uniqueSorted(userAssignment.roles);
			const matchedRoles = uniqueSorted(
				rolePermissionAssignments
					.filter(
						(assignment) =>
							userRoles.includes(assignment.roleSlug.trim()) &&
							assignment.permissions.map((permission) => permission.trim()).includes(permissionSlug),
					)
					.map((assignment) => assignment.roleSlug),
			);
			const deniedReasons =
				matchedRoles.length > 0
					? []
					: [`Permission ${permissionSlug} is not granted by the active role assignments.`];

			return serviceOk({
				userId,
				permissionSlug,
				allowed: matchedRoles.length > 0,
				matchedRoles,
				deniedReasons,
			});
		},
	};
}

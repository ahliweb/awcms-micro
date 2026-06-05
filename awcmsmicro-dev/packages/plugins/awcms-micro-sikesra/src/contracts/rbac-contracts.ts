export interface SikesraRoleAssignmentRequest {
	emdashUserId: string;
	roles: string[];
	isActive?: boolean;
	regionScopeType?: string;
	regionScopeCode?: string;
	organizationScopeType?: string;
	organizationScopeCode?: string;
}

export interface SikesraAccessPreviewRequest {
	userId: string;
	permissionSlug: string;
}

export interface SikesraAccessPreviewDto {
	userId: string;
	permissionSlug: string;
	allowed: boolean;
	matchedRoles: string[];
	deniedReasons: string[];
}

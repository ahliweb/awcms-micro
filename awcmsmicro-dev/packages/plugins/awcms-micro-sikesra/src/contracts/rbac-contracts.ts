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

export interface SikesraUserProfileRequest {
	userId?: string;
	emdashUserId?: string;
	auditLimit?: number;
}

export interface SikesraUserProfileEmdashReferenceDto {
	id: string;
	email: string;
	name: string | null;
	role: number;
	createdAt: string;
}

export interface SikesraUserProfileScopeDto {
	regionScopeType: string;
	regionScopeCode: string;
	organizationScopeType: string;
	organizationScopeCode: string;
	isActive: boolean;
	validFrom: string;
	validUntil: string;
	updatedAt: string;
}

export interface SikesraUserProfileAuditEntryDto {
	id: string;
	timestamp: string;
	kind: string;
	scope: string;
	summary: string;
}

export interface SikesraUserProfileDto {
	userId: string;
	emdashUser: SikesraUserProfileEmdashReferenceDto | null;
	orphaned: boolean;
	hasSikesraProfile: boolean;
	roles: string[];
	roleActive: boolean;
	roleSource: "d1" | "storage" | "default" | "none";
	scopes: SikesraUserProfileScopeDto[];
	abacAttributes: Record<string, string>;
	effectivePermissions: string[];
	recentAudit: SikesraUserProfileAuditEntryDto[];
}

import type { StorageCollection } from "emdash";

import type {
	MailketingAuditEventDoc,
	MailketingPermissionDoc,
	MailketingRoleDoc,
	MailketingRolePermissionDoc,
	MailketingSendLogDoc,
	MailketingUserProfileDoc,
	MailketingUserRoleDoc,
} from "./schema.js";
import { MAILKETING_STORAGE_COLLECTIONS } from "./schema.js";

// ── Plugin storage accessor ───────────────────────────────────────────────────

export interface MailketingStorageContext {
	storage: Record<string, StorageCollection>;
	kv: {
		get<T>(key: string): Promise<T | null>;
		set(key: string, value: unknown): Promise<void>;
		delete(key: string): Promise<boolean>;
		list(prefix?: string): Promise<Array<{ key: string; value: unknown }>>;
	};
}

export function getSendLogCollection(
	ctx: MailketingStorageContext,
): StorageCollection<MailketingSendLogDoc> {
	return ctx.storage[MAILKETING_STORAGE_COLLECTIONS.sendLog] as StorageCollection<MailketingSendLogDoc>;
}

export function getPermissionCollection(
	ctx: MailketingStorageContext,
): StorageCollection<MailketingPermissionDoc> {
	return ctx.storage[
		MAILKETING_STORAGE_COLLECTIONS.permissionCatalog
	] as StorageCollection<MailketingPermissionDoc>;
}

export function getRoleCollection(
	ctx: MailketingStorageContext,
): StorageCollection<MailketingRoleDoc> {
	return ctx.storage[MAILKETING_STORAGE_COLLECTIONS.roleCatalog] as StorageCollection<MailketingRoleDoc>;
}

export function getRolePermissionsCollection(
	ctx: MailketingStorageContext,
): StorageCollection<MailketingRolePermissionDoc> {
	return ctx.storage[
		MAILKETING_STORAGE_COLLECTIONS.rolePermissions
	] as StorageCollection<MailketingRolePermissionDoc>;
}

export function getUserRolesCollection(
	ctx: MailketingStorageContext,
): StorageCollection<MailketingUserRoleDoc> {
	return ctx.storage[
		MAILKETING_STORAGE_COLLECTIONS.userRoles
	] as StorageCollection<MailketingUserRoleDoc>;
}

export function getUserProfileCollection(
	ctx: MailketingStorageContext,
): StorageCollection<MailketingUserProfileDoc> {
	return ctx.storage[
		MAILKETING_STORAGE_COLLECTIONS.userProfile
	] as StorageCollection<MailketingUserProfileDoc>;
}

export function getAuditCollection(
	ctx: MailketingStorageContext,
): StorageCollection<MailketingAuditEventDoc> {
	return ctx.storage[
		MAILKETING_STORAGE_COLLECTIONS.auditEvents
	] as StorageCollection<MailketingAuditEventDoc>;
}

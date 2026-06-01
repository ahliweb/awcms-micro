export interface SikesraCrudMutationMeta {
	reason?: string;
	confirmation?: string;
	requestId?: string;
}

export interface SikesraSoftDeleteRequest extends SikesraCrudMutationMeta {
	id: string;
}

export interface SikesraRestoreRequest extends SikesraCrudMutationMeta {
	id: string;
}

export interface SikesraPermanentDeleteRequest extends SikesraCrudMutationMeta {
	id?: string;
	targetTable: string;
	targetRecordId: string;
	targetType: string;
	targetSikesraId20?: string;
}

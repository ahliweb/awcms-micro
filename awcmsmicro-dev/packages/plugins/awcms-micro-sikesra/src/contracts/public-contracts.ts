export interface SikesraPublicAggregateCategoryDto {
	key: string;
	label: string;
	count: number | null;
	suppressed: boolean;
	suppressionReason?: string;
}

export interface SikesraPublicAggregateDto {
	statusLabel: string;
	categories: SikesraPublicAggregateCategoryDto[];
	updatedAt?: string;
}

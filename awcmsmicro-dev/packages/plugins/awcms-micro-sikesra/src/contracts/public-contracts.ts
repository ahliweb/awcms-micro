export interface SikesraPublicAggregateCategoryDto {
	code: string;
	label: string;
	total: number;
	verified: number;
	suppressed: boolean;
	suppressionReason?: string | null;
}

export interface SikesraPublicAggregateDto {
	categories: SikesraPublicAggregateCategoryDto[];
	caveat: string;
}

export interface SikesraPublicStatusDto {
	plugin: {
		id: "awcms-micro-sikesra";
		visibility: "public-safe";
	};
	status: string;
	governanceMode: string;
	publicAggregate: SikesraPublicAggregateDto;
}

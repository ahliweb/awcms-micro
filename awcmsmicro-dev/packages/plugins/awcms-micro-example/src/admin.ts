export interface ExampleAdminPage {
	path: string;
	label: string;
	icon: string;
	description: string;
}

export const adminPages: ExampleAdminPage[] = [
	{
		path: "/overview",
		label: "Overview",
		icon: "stack",
		description: "Shows a minimal AWCMS-Micro example admin page descriptor.",
	},
];

export default {
	pages: adminPages,
};

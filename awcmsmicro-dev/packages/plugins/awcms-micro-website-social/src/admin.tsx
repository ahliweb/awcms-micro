import { LinkButton } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react";
import type { PluginAdminExports } from "emdash";
import * as React from "react";

import { getWebsiteSocialAdminCopy } from "./admin-copy.js";

function WebsiteSocialAdminPage() {
	const { i18n } = useLingui();
	const copy = getWebsiteSocialAdminCopy(i18n.locale);
	const tips = [copy("websiteSocial.tipPhone"), copy("websiteSocial.tipSafety"), copy("websiteSocial.tipLocale")];

	return (
		<div className="space-y-8">
			<section className="space-y-4">
				<p className="text-sm font-medium uppercase tracking-[0.2em] text-kumo-subtle">
					{copy("websiteSocial.eyebrow")}
				</p>
				<h1 className="text-3xl font-semibold text-kumo-foreground">{copy("websiteSocial.title")}</h1>
				<p className="max-w-3xl text-sm leading-6 text-kumo-subtle">
					{copy("websiteSocial.description")}
				</p>
				<div className="flex flex-wrap gap-3">
					<LinkButton href="/_emdash/admin/content/website_social" external>
						{copy("websiteSocial.manage")}
					</LinkButton>
					<LinkButton href="/" external>
						{copy("websiteSocial.viewPublic")}
					</LinkButton>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{tips.map((item) => (
					<article className="rounded-lg border border-kumo-border bg-kumo-background p-4 text-sm text-kumo-subtle" key={item}>
						{item}
					</article>
				))}
			</section>
		</div>
	);
}

const pluginAdminExports: PluginAdminExports = {
	pages: {
		"/": <WebsiteSocialAdminPage />,
	},
};

export default pluginAdminExports;

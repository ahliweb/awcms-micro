import { describe, expect, it } from "vitest";

import {
	AWCMS_WEBSITE_SOCIAL_COLLECTION,
	AWCMS_WEBSITE_SOCIAL_PLUGIN_ID,
	awcmsMicroWebsiteSocialPlugin,
} from "../src/index.js";
import { AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES } from "../src/locales/messages.js";

describe("AWCMS-Micro Website Social plugin", () => {
	it("declares the canonical plugin identity and collection", () => {
		const descriptor = awcmsMicroWebsiteSocialPlugin();

		expect(AWCMS_WEBSITE_SOCIAL_PLUGIN_ID).toBe("awcms-micro-website-social");
		expect(AWCMS_WEBSITE_SOCIAL_COLLECTION).toBe("website_social");
		expect(descriptor.id).toBe(AWCMS_WEBSITE_SOCIAL_PLUGIN_ID);
		expect(descriptor.adminPages?.[0]?.path).toBe("/");
	});

	it("keeps admin guidance copy localized for contextual CTA labels", () => {
		expect(AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES.en["websiteSocial.tipLabels"]).toContain("hero");
		expect(AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES.id["websiteSocial.tipLabels"]).toContain("label");
	});
});

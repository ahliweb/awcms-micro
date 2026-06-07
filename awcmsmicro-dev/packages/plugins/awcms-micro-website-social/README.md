# AWCMS-Micro Website Social Plugin

EmDash-compatible AWCMS-Micro plugin for managing public website social contact configuration.

The first supported surface is WhatsApp CTA configuration for public templates. The public templates read the `website_social` collection, while this plugin provides the admin entry point and stable plugin identity.

## Collection

Templates seed and read the `website_social` collection with these fields:

- `title`
- `whatsapp_number`
- `default_message`
- `hero_message`
- `section_message`
- `contact_message`
- `sticky_label`
- `enabled`

Keep operational social/contact data in this collection rather than hard-coding phone numbers in public pages.

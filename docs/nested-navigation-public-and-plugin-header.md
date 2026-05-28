# Nested Navigation for Public Pages and Plugin Headers

## Status

Draft implementation guidance for AWCMS-Micro.

## Purpose

This document explains how AWCMS-Micro should implement nested menus without modifying EmDash core or the built-in EmDash admin sidebar.

It covers two separate navigation surfaces:

1. **Public site navigation** — nested public menus and dropdowns rendered by the public Astro template.
2. **Plugin header navigation** — nested menu groups rendered inside a plugin admin page header, so plugin-specific sections can be organized without changing the EmDash sidebar.

## Decision Summary

AWCMS-Micro must use EmDash-native capabilities first.

- Public nested menus must use EmDash `menus`, `getMenu()`, and `MenuItem.children`.
- Plugin-specific nested navigation must be rendered inside the plugin page header or plugin content area.
- The EmDash admin sidebar must not be modified for AWCMS-Micro-specific plugin grouping unless an upstream-compatible proposal is approved separately.
- Plugin admin sidebar entries should remain flat and minimal through EmDash `admin.pages` / `adminPages`.

## Non-Goals

This document does not introduce:

- a replacement for the EmDash public menu system;
- a fork of the EmDash admin sidebar;
- custom nested sidebar behavior in `packages/admin/src/components/Sidebar.tsx`;
- a new EmDash plugin manifest schema;
- plugin admin `children`, `group`, or `sortOrder` metadata unless it is first accepted upstream.

## Source References

Primary upstream references:

- EmDash repository: `https://github.com/emdash-cms/emdash`
- EmDash docs: `https://docs.emdashcms.com/`
- EmDash menu guide: `https://docs.emdashcms.com/guides/menus/`
- EmDash seed file guide: `https://docs.emdashcms.com/themes/seed-files/`

Repository-local governance references:

- `README.md`
- `docs/awcms-micro-implementation-boundaries.md`
- `scripts/awcmsmicro-dev-protected-paths.txt`

## Implementation Boundaries

Recommended AWCMS-Micro locations:

```txt
awcmsmicro-dev/templates/awcms-micro-default/
awcmsmicro-dev/templates/awcms-micro-default-cloudflare/
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/
awcmsmicro-dev/docs/awcms-micro/
```

Do not edit these upstream-owned areas for this feature:

```txt
emdash-latest/
awcmsmicro-dev/packages/core/
awcmsmicro-dev/packages/admin/
awcmsmicro-dev/templates/starter/
awcmsmicro-dev/templates/blog/
awcmsmicro-dev/templates/marketing/
awcmsmicro-dev/templates/portfolio/
```

## Part 1 — Public Nested Menu

### Concept

Public menus are content-managed navigation menus displayed in public Astro layouts. EmDash already supports nested public menu items through `children`.

AWCMS-Micro should render the public menu recursively so the template supports more than one nesting level while staying compatible with EmDash.

### Data Source

Use:

```ts
import { getMenu } from "emdash";

const primaryMenu = await getMenu("primary");
```

A public menu item has this relevant shape:

```ts
interface MenuItem {
  id: string;
  label: string;
  url: string;
  target?: string;
  titleAttr?: string;
  cssClasses?: string;
  children: MenuItem[];
}
```

### Seed Example

Use a seed file inside the AWCMS-Micro template to provide a useful default `primary` menu.

Example:

```json
{
  "menus": [
    {
      "name": "primary",
      "label": "Primary Navigation",
      "items": [
        {
          "type": "custom",
          "label": "Home",
          "url": "/"
        },
        {
          "type": "custom",
          "label": "About",
          "url": "/about",
          "children": [
            {
              "type": "custom",
              "label": "Company Profile",
              "url": "/about/company-profile"
            },
            {
              "type": "custom",
              "label": "Vision and Mission",
              "url": "/about/vision-and-mission"
            },
            {
              "type": "custom",
              "label": "Team",
              "url": "/about/team"
            }
          ]
        },
        {
          "type": "custom",
          "label": "Services",
          "url": "/services",
          "children": [
            {
              "type": "custom",
              "label": "Website Development",
              "url": "/services/website-development"
            },
            {
              "type": "custom",
              "label": "Application Development",
              "url": "/services/application-development"
            },
            {
              "type": "custom",
              "label": "IT Consulting",
              "url": "/services/it-consulting"
            }
          ]
        },
        {
          "type": "custom",
          "label": "Blog",
          "url": "/posts"
        },
        {
          "type": "custom",
          "label": "Contact",
          "url": "/contact"
        }
      ]
    }
  ]
}
```

### Component Contract

Create a template-owned component:

```txt
awcmsmicro-dev/templates/awcms-micro-default/src/components/PublicNavigation.astro
awcmsmicro-dev/templates/awcms-micro-default-cloudflare/src/components/PublicNavigation.astro
```

Recommended implementation:

```astro
---
import { getMenu } from "emdash";
import type { MenuItem } from "emdash";

interface Props {
  name?: string;
}

const { name = "primary" } = Astro.props;
const menu = await getMenu(name);

function isCurrent(url: string) {
  return Astro.url.pathname === url || Astro.url.pathname.startsWith(`${url}/`);
}
---

{menu && (
  <nav class="awcms-public-nav" aria-label="Main navigation">
    <ul class="awcms-public-nav__list">
      {menu.items.map((item) => (
        <Fragment set:html={renderMenuItem(item, 0)} />
      ))}
    </ul>
  </nav>
)}

{/**
  Astro does not allow declaring framework-free recursive JSX functions
  exactly like React in every context. For production implementation,
  prefer extracting the recursive item to a separate Astro component:

  - PublicNavigation.astro
  - PublicNavigationItem.astro
*/}
```

Preferred maintainable split:

```txt
src/components/PublicNavigation.astro
src/components/PublicNavigationItem.astro
```

`PublicNavigation.astro`:

```astro
---
import { getMenu } from "emdash";
import PublicNavigationItem from "./PublicNavigationItem.astro";

interface Props {
  name?: string;
}

const { name = "primary" } = Astro.props;
const menu = await getMenu(name);
---

{menu && (
  <nav class="awcms-public-nav" aria-label="Main navigation">
    <ul class="awcms-public-nav__list">
      {menu.items.map((item) => (
        <PublicNavigationItem item={item} currentPath={Astro.url.pathname} level={0} />
      ))}
    </ul>
  </nav>
)}
```

`PublicNavigationItem.astro`:

```astro
---
import type { MenuItem } from "emdash";

interface Props {
  item: MenuItem;
  currentPath: string;
  level: number;
}

const { item, currentPath, level } = Astro.props;
const hasChildren = item.children.length > 0;
const isActive = currentPath === item.url || currentPath.startsWith(`${item.url}/`);
const submenuId = `public-submenu-${item.id}`;
---

<li class:list={["awcms-public-nav__item", `level-${level}`, item.cssClasses, { "has-children": hasChildren }]}>
  <a
    class="awcms-public-nav__link"
    href={item.url}
    target={item.target}
    title={item.titleAttr}
    aria-current={isActive ? "page" : undefined}
    aria-haspopup={hasChildren ? "true" : undefined}
    aria-expanded={hasChildren ? "false" : undefined}
    aria-controls={hasChildren ? submenuId : undefined}
  >
    <span>{item.label}</span>
    {hasChildren && <span class="awcms-public-nav__chevron" aria-hidden="true">⌄</span>}
  </a>

  {hasChildren && (
    <ul id={submenuId} class="awcms-public-nav__submenu" data-level={level + 1}>
      {item.children.map((child) => (
        <Astro.self item={child} currentPath={currentPath} level={level + 1} />
      ))}
    </ul>
  )}
</li>
```

### Styling Requirements

Minimum behavior:

- dropdown opens on hover and keyboard focus;
- active page uses `aria-current="page"`;
- submenu remains readable in light and dark mode;
- mobile layout must not depend on hover only;
- dropdown must not overflow the viewport on normal desktop widths.

Example CSS:

```css
.awcms-public-nav__list,
.awcms-public-nav__submenu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.awcms-public-nav__list {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.awcms-public-nav__item {
  position: relative;
}

.awcms-public-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 0.625rem;
  border-radius: 0.625rem;
  color: inherit;
  text-decoration: none;
}

.awcms-public-nav__link:hover,
.awcms-public-nav__link:focus-visible,
.awcms-public-nav__link[aria-current="page"] {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.awcms-public-nav__submenu {
  display: none;
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  min-width: 14rem;
  padding: 0.5rem;
  border: 1px solid var(--awcms-border-color, #e5e7eb);
  border-radius: 0.875rem;
  background: var(--awcms-surface-color, #ffffff);
  color: var(--awcms-text-color, #111827);
  box-shadow: 0 18px 45px rgb(15 23 42 / 14%);
  z-index: 50;
}

.awcms-public-nav__item:hover > .awcms-public-nav__submenu,
.awcms-public-nav__item:focus-within > .awcms-public-nav__submenu {
  display: block;
}

.awcms-public-nav__submenu .awcms-public-nav__submenu {
  inset-block-start: 0;
  inset-inline-start: 100%;
}

.awcms-public-nav__submenu .awcms-public-nav__link {
  display: flex;
  justify-content: space-between;
  width: 100%;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .awcms-public-nav__list {
    display: grid;
    gap: 0.25rem;
  }

  .awcms-public-nav__submenu,
  .awcms-public-nav__submenu .awcms-public-nav__submenu {
    position: static;
    display: block;
    min-width: 0;
    margin-inline-start: 1rem;
    box-shadow: none;
    border: 0;
    padding-block: 0.25rem;
  }
}
```

### Public Acceptance Criteria

- `getMenu("primary")` renders top-level menu items.
- Nested `children` render as dropdown or nested list.
- At least two levels of nesting work.
- The active page receives `aria-current="page"`.
- Keyboard users can tab through all menu items.
- Mobile users can access child menu items without hover.
- Dark mode text and background contrast remain readable.
- No EmDash core or built-in admin files are changed.

## Part 2 — Plugin Header Nested Menu

### Concept

Plugin-specific navigation can become large. For example, a SIKESRA plugin may need:

```txt
Dashboard
Input Data
  Worship Places
  Religious Institutions
  Religious Education
  Social Welfare Institutions
  Religion Teachers
  Orphans
  Disabilities
  Abandoned Elderly
Verification
Reports
Settings
```

This should not be forced into the EmDash admin sidebar. Instead, AWCMS-Micro plugins should render a **plugin header menu** inside the plugin page.

This keeps the EmDash sidebar stable:

```txt
Plugins
  SIKESRA
```

And puts plugin-specific nested navigation inside the plugin surface:

```txt
[SIKESRA Header]
Dashboard | Input Data ▼ | Verification | Reports | Settings
```

### Admin Sidebar Rule

Use the EmDash sidebar only for a small number of plugin entry points.

Recommended plugin manifest shape:

```json
{
  "admin": {
    "pages": [
      {
        "path": "/",
        "label": "SIKESRA",
        "icon": "Database"
      }
    ]
  }
}
```

Alternative for larger plugins:

```json
{
  "admin": {
    "pages": [
      {
        "path": "/",
        "label": "SIKESRA",
        "icon": "Database"
      },
      {
        "path": "/settings",
        "label": "SIKESRA Settings",
        "icon": "Settings"
      }
    ]
  }
}
```

Do not add custom nested plugin sidebar behavior in EmDash admin unless it is implemented as an upstream-compatible enhancement.

### Plugin Header Menu Model

Define a plugin-owned menu node model inside the plugin package.

Example:

```ts
export type PluginHeaderMenuItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  description?: string;
  permission?: string;
  abacAction?: string;
  badge?: string | number;
  children?: PluginHeaderMenuItem[];
};
```

Example SIKESRA-style configuration:

```ts
export const sikesraHeaderMenu: PluginHeaderMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/_emdash/admin/plugins/sikesra/"
  },
  {
    id: "input-data",
    label: "Input Data",
    href: "/_emdash/admin/plugins/sikesra/entities/new",
    permission: "awcms:sikesra:entity:create",
    children: [
      {
        id: "worship-places",
        label: "Worship Places",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=rumah-ibadah",
        permission: "awcms:sikesra:entity:create"
      },
      {
        id: "religious-institutions",
        label: "Religious Institutions",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=lembaga-keagamaan",
        permission: "awcms:sikesra:entity:create"
      },
      {
        id: "religious-education",
        label: "Religious Education",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=pendidikan-keagamaan",
        permission: "awcms:sikesra:entity:create"
      },
      {
        id: "social-welfare-institutions",
        label: "Social Welfare Institutions",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=lks",
        permission: "awcms:sikesra:entity:create"
      },
      {
        id: "religion-teachers",
        label: "Religion Teachers",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=guru-agama",
        permission: "awcms:sikesra:entity:create"
      },
      {
        id: "orphans",
        label: "Orphans",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=anak-yatim",
        permission: "awcms:sikesra:entity:create"
      },
      {
        id: "disabilities",
        label: "Disabilities",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=disabilitas",
        permission: "awcms:sikesra:entity:create"
      },
      {
        id: "abandoned-elderly",
        label: "Abandoned Elderly",
        href: "/_emdash/admin/plugins/sikesra/entities/new?type=lansia-terlantar",
        permission: "awcms:sikesra:entity:create"
      }
    ]
  },
  {
    id: "verification",
    label: "Verification",
    href: "/_emdash/admin/plugins/sikesra/verification",
    permission: "awcms:sikesra:verification:verify"
  },
  {
    id: "reports",
    label: "Reports",
    href: "/_emdash/admin/plugins/sikesra/reports",
    permission: "awcms:sikesra:report:read"
  },
  {
    id: "settings",
    label: "Settings",
    href: "/_emdash/admin/plugins/sikesra/settings",
    permission: "awcms:sikesra:settings:update"
  }
];
```

### Permission Filtering

Filter menu items server-side before rendering.

Example:

```ts
export function filterPluginHeaderMenu(
  items: PluginHeaderMenuItem[],
  can: (permission?: string) => boolean
): PluginHeaderMenuItem[] {
  return items
    .filter((item) => can(item.permission))
    .map((item) => ({
      ...item,
      children: item.children ? filterPluginHeaderMenu(item.children, can) : undefined
    }))
    .filter((item) => !item.children || item.children.length > 0 || !item.permission || can(item.permission));
}
```

For ABAC-sensitive items, do not rely on client-side hiding. Client-side menu filtering is only a usability improvement. All API routes and actions must still enforce permission and ABAC checks on the server.

### React Plugin Header Component

For trusted React admin pages, use a plugin-owned component.

```tsx
import * as React from "react";
import type { PluginHeaderMenuItem } from "./plugin-header-menu";

export function PluginHeaderMenu({
  items,
  currentPath
}: {
  items: PluginHeaderMenuItem[];
  currentPath: string;
}) {
  return (
    <nav className="awcms-plugin-header-menu" aria-label="Plugin navigation">
      <ul className="awcms-plugin-header-menu__list">
        {items.map((item) => (
          <PluginHeaderMenuNode key={item.id} item={item} currentPath={currentPath} level={0} />
        ))}
      </ul>
    </nav>
  );
}

function PluginHeaderMenuNode({
  item,
  currentPath,
  level
}: {
  item: PluginHeaderMenuItem;
  currentPath: string;
  level: number;
}) {
  const hasChildren = Boolean(item.children?.length);
  const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);

  return (
    <li className={`awcms-plugin-header-menu__item level-${level} ${hasChildren ? "has-children" : ""}`}>
      <a
        className="awcms-plugin-header-menu__link"
        href={item.href}
        aria-current={active ? "page" : undefined}
        aria-haspopup={hasChildren ? "true" : undefined}
      >
        <span>{item.label}</span>
        {item.badge != null && <span className="awcms-plugin-header-menu__badge">{item.badge}</span>}
        {hasChildren && <span aria-hidden="true">⌄</span>}
      </a>

      {hasChildren && (
        <ul className="awcms-plugin-header-menu__submenu">
          {item.children!.map((child) => (
            <PluginHeaderMenuNode key={child.id} item={child} currentPath={currentPath} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
```

### Blocks Mode Strategy

For `adminMode: "blocks"`, keep the same conceptual menu, but render it as a plugin header block, card grid, tabs, or link group returned by the plugin admin route.

Recommended blocks layout:

```txt
Plugin Header
  Title: SIKESRA
  Description: Data collection and verification module
  Navigation:
    Dashboard
    Input Data
      Worship Places
      Religious Institutions
      Religious Education
      Social Welfare Institutions
      Religion Teachers
      Orphans
      Disabilities
      Abandoned Elderly
    Verification
    Reports
    Settings
```

If the current block kit does not support interactive dropdowns, use one of these safe fallbacks:

1. top-level horizontal tabs plus child link grid below the active section;
2. grouped cards for child sections;
3. select/dropdown field for mobile navigation;
4. breadcrumb plus page-level action links.

Do not patch EmDash sidebar to solve a plugin content navigation problem.

### Plugin Header Styling Requirements

- It must visually belong to the plugin page, not the EmDash global sidebar.
- It must work in light and dark mode.
- It must not hide unauthorized actions as the only security control.
- It must support responsive layout.
- It must avoid layout shift when badges appear.
- It must provide keyboard access to all links.

Example CSS:

```css
.awcms-plugin-header-menu {
  border: 1px solid var(--awcms-plugin-border, #e5e7eb);
  border-radius: 1rem;
  background: var(--awcms-plugin-surface, #ffffff);
  color: var(--awcms-plugin-text, #111827);
  padding: 0.5rem;
}

.awcms-plugin-header-menu__list,
.awcms-plugin-header-menu__submenu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.awcms-plugin-header-menu__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.awcms-plugin-header-menu__item {
  position: relative;
}

.awcms-plugin-header-menu__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  color: inherit;
  text-decoration: none;
}

.awcms-plugin-header-menu__link:hover,
.awcms-plugin-header-menu__link:focus-visible,
.awcms-plugin-header-menu__link[aria-current="page"] {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.awcms-plugin-header-menu__submenu {
  display: none;
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  min-width: 16rem;
  padding: 0.5rem;
  border: 1px solid var(--awcms-plugin-border, #e5e7eb);
  border-radius: 0.875rem;
  background: var(--awcms-plugin-surface, #ffffff);
  box-shadow: 0 18px 45px rgb(15 23 42 / 14%);
  z-index: 40;
}

.awcms-plugin-header-menu__item:hover > .awcms-plugin-header-menu__submenu,
.awcms-plugin-header-menu__item:focus-within > .awcms-plugin-header-menu__submenu {
  display: block;
}

.awcms-plugin-header-menu__badge {
  min-width: 1.25rem;
  border-radius: 999px;
  padding: 0.125rem 0.375rem;
  background: color-mix(in srgb, currentColor 14%, transparent);
  font-size: 0.75rem;
  text-align: center;
}

@media (max-width: 768px) {
  .awcms-plugin-header-menu__list {
    display: grid;
  }

  .awcms-plugin-header-menu__submenu {
    position: static;
    display: block;
    min-width: 0;
    margin-inline-start: 1rem;
    box-shadow: none;
    border: 0;
  }
}
```

### Plugin Header Acceptance Criteria

- The EmDash sidebar remains unchanged.
- Plugin sidebar entries stay flat and minimal.
- Nested plugin navigation appears inside the plugin page header.
- Unauthorized plugin menu items are filtered before rendering.
- Server-side API authorization still enforces RBAC/ABAC.
- The header menu supports at least two nesting levels.
- The menu works in desktop and mobile layouts.
- The menu remains readable in light and dark mode.
- Existing EmDash admin groups remain intact.

## Recommended AWCMS-Micro Implementation Plan

### Phase 1 — Documentation and Boundaries

- Add this document to root `docs/`.
- Add a shorter implementation copy under `awcmsmicro-dev/docs/awcms-micro/` if needed.
- Do not change upstream EmDash files.

### Phase 2 — Public Template Implementation

- Add `PublicNavigation.astro` and `PublicNavigationItem.astro` to both AWCMS-Micro templates.
- Add default nested `primary` menu seed.
- Add light/dark safe CSS.
- Add a public layout example using `<PublicNavigation name="primary" />`.

### Phase 3 — Plugin Header Implementation

- Add a plugin-owned menu model to `packages/plugins/awcms-micro-sikesra/`.
- Add a plugin header menu component or blocks-mode equivalent.
- Keep plugin admin `pages` minimal.
- Add a SIKESRA-style example configuration as documentation or optional example data.

### Phase 4 — Tests

Minimum test scenarios:

1. public primary menu renders top-level items;
2. public nested child menu items render;
3. active public route sets `aria-current="page"`;
4. plugin header top-level items render;
5. plugin header child items render;
6. plugin header filters unauthorized items;
7. EmDash sidebar does not receive custom nested plugin entries;
8. dark mode text remains readable.

Suggested validation commands:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm --dir awcmsmicro-dev test:e2e
```

## Security and Compliance Notes

### RBAC / ABAC

Plugin header menus are not security boundaries. They are navigation aids. Every protected plugin route and API action must enforce:

- authentication;
- RBAC permission;
- ABAC object/action policy;
- tenant/site scope;
- region scope when applicable;
- audit logging for sensitive actions.

### Privacy

Do not expose sensitive counters, restricted labels, hidden workflow states, or region-specific restricted routes through a public or unauthorized plugin header menu.

### ISO Alignment

This design supports:

- ISO/IEC 27001 — least privilege, access control, change control;
- ISO/IEC 27002 — access management and secure configuration;
- ISO/IEC 27005 — risk treatment by avoiding sidebar core customization;
- ISO/IEC 27017 — cloud application security responsibility separation;
- ISO/IEC 27018 and ISO/IEC 27701 — privacy-safe navigation and data exposure minimization;
- ISO/IEC 27034 — application security through controlled extension boundaries;
- ISO/IEC 20000-1 — maintainable service management through stable navigation contracts;
- ISO 22301 — reduced operational risk during upstream sync and recovery;
- ISO/IEC 15408 — clear security target thinking for navigation, authorization, and plugin boundaries.

### Indonesia Compliance

For systems such as SIKESRA, navigation must not reveal restricted personal data or sensitive welfare categories to unauthorized users. This supports privacy governance expectations under:

- UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi;
- PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik;
- internal government data access policies, retention rules, and audit requirements.

## Rollback Strategy

Public menu rollback:

1. restore the previous template navigation component;
2. remove or simplify nested seed menu entries;
3. keep EmDash `menus` data intact unless the seed must be reset.

Plugin header rollback:

1. disable the plugin header menu component;
2. keep the single plugin admin page entry in EmDash sidebar;
3. replace nested plugin navigation with simple action cards;
4. no EmDash sidebar rollback should be needed because the sidebar was not modified.

## Final Rule

AWCMS-Micro can implement rich nested navigation, but the implementation must remain layered:

```txt
Public nested menu        -> EmDash public menu + AWCMS-Micro template components
Plugin nested menu        -> plugin-owned header/menu component inside plugin page
EmDash admin sidebar      -> keep native, flat, and upstream-compatible
EmDash core/admin package -> do not modify for AWCMS-Micro-specific navigation
```

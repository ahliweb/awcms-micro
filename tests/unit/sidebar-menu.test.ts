import { describe, expect, test } from "bun:test";

import type { ModuleDescriptor } from "../../src/modules/_shared/module-contract";
import {
  buildDefaultSidebarModel,
  composeSidebarArrangement,
  validateSidebarMenuInput,
  CORE_MODULE_KEY,
  CORE_NAV_ENTRIES,
  type SidebarDefaultEntry,
  type SidebarItemOverride,
  type SidebarTypeOverride
} from "../../src/modules/module-management/domain/sidebar-menu";

function moduleDescriptor(
  overrides: Partial<ModuleDescriptor> = {}
): ModuleDescriptor {
  return {
    key: "blog_content",
    name: "Blog Content",
    version: "1.0.0",
    status: "active",
    description: "test",
    dependencies: [],
    navigation: [
      { labelKey: "admin.layout.nav_blog", path: "/admin/blog", order: 0 }
    ],
    ...overrides
  } as ModuleDescriptor;
}

const NO_OPTIONS = {
  grantedPermissionKeys: new Set<string>(),
  tenantDisabledModuleKeys: new Set<string>()
};

/** Grant everything so nothing is permission-filtered in the default cases. */
function allGranted(entries: readonly SidebarDefaultEntry[]) {
  const keys = new Set<string>();
  for (const e of entries) {
    if (e.requiredPermission) keys.add(e.requiredPermission);
    if (e.requiredPermissionPrefix) keys.add(e.requiredPermissionPrefix + "x");
  }
  return keys;
}

describe("buildDefaultSidebarModel", () => {
  test("includes core entries first, keyed by path, under system type", () => {
    const model = buildDefaultSidebarModel([]);
    const core = model.filter((e) => e.moduleKey === CORE_MODULE_KEY);
    expect(core.length).toBe(CORE_NAV_ENTRIES.length);
    expect(core.every((e) => e.typeKey === "system")).toBe(true);
    expect(model[0]!.entryKey).toBe("/admin");
    // Access & Users carries the prefix gate, not an exact permission.
    const access = core.find((e) => e.path === "/admin/access-users");
    expect(access?.requiredPermissionPrefix).toBe("identity_access.");
  });

  test("maps module nav entries to their default type", () => {
    const model = buildDefaultSidebarModel([
      moduleDescriptor({ key: "blog_content", name: "Blog" }),
      moduleDescriptor({
        key: "comments",
        name: "Comments",
        navigation: [
          { labelKey: "admin.comments.nav_label", path: "/admin/comments" }
        ]
      })
    ]);
    expect(model.find((e) => e.path === "/admin/blog")?.typeKey).toBe(
      "content"
    );
    expect(model.find((e) => e.path === "/admin/comments")?.typeKey).toBe(
      "engagement"
    );
  });

  test("falls back to the nav entry group, then general, for unmapped modules", () => {
    const model = buildDefaultSidebarModel([
      moduleDescriptor({
        key: "unknown_mod_a",
        navigation: [{ labelKey: "x", path: "/admin/a", group: "operations" }]
      }),
      moduleDescriptor({
        key: "unknown_mod_b",
        navigation: [{ labelKey: "y", path: "/admin/b" }]
      })
    ]);
    expect(model.find((e) => e.path === "/admin/a")?.typeKey).toBe(
      "operations"
    );
    expect(model.find((e) => e.path === "/admin/b")?.typeKey).toBe("general");
  });

  test("drops nav of a globally-disabled module entirely", () => {
    const model = buildDefaultSidebarModel([
      moduleDescriptor({ key: "blog_content", status: "disabled" })
    ]);
    expect(model.some((e) => e.path === "/admin/blog")).toBe(false);
  });
});

describe("composeSidebarArrangement — default grouping", () => {
  test("groups type -> module -> items in the default order", () => {
    const model = buildDefaultSidebarModel([
      moduleDescriptor({
        key: "blog_content",
        name: "Blog",
        navigation: [
          { labelKey: "b2", path: "/admin/blog/2", order: 2 },
          { labelKey: "b1", path: "/admin/blog/1", order: 1 }
        ]
      })
    ]);
    const composed = composeSidebarArrangement(model, [], [], {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });

    // system (core) comes before content by default type index.
    expect(composed.types[0]!.typeKey).toBe("system");
    const content = composed.types.find((t) => t.typeKey === "content")!;
    const blog = content.items.find((m) => m.moduleKey === "blog_content")!;
    // Items ordered by defaultOrder within the module.
    expect(blog.entries.map((e) => e.path)).toEqual([
      "/admin/blog/1",
      "/admin/blog/2"
    ]);
  });
});

describe("composeSidebarArrangement — item overrides", () => {
  const model = buildDefaultSidebarModel([
    moduleDescriptor({ key: "blog_content", name: "Blog" })
  ]);

  test("hides an item", () => {
    const overrides: SidebarItemOverride[] = [
      {
        entryKey: "/admin/blog",
        typeKey: null,
        position: 0,
        labelOverride: null,
        hidden: true
      }
    ];
    const composed = composeSidebarArrangement(model, [], overrides, {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });
    expect(
      composed.types.some((t) =>
        t.items.some((m) => m.moduleKey === "blog_content")
      )
    ).toBe(false);
  });

  test("relabels an item (labelOverride exposed)", () => {
    const overrides: SidebarItemOverride[] = [
      {
        entryKey: "/admin/blog",
        typeKey: null,
        position: 0,
        labelOverride: "My Blog",
        hidden: false
      }
    ];
    const composed = composeSidebarArrangement(model, [], overrides, {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });
    const entry = composed.types
      .flatMap((t) => t.items)
      .flatMap((m) => m.entries)
      .find((e) => e.entryKey === "/admin/blog");
    expect(entry?.labelOverride).toBe("My Blog");
  });

  test("moves an item to a different type", () => {
    const overrides: SidebarItemOverride[] = [
      {
        entryKey: "/admin/blog",
        typeKey: "operations",
        position: 0,
        labelOverride: null,
        hidden: false
      }
    ];
    const composed = composeSidebarArrangement(model, [], overrides, {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });
    expect(composed.types.some((t) => t.typeKey === "content")).toBe(false);
    const ops = composed.types.find((t) => t.typeKey === "operations")!;
    expect(ops.items.some((m) => m.moduleKey === "blog_content")).toBe(true);
  });

  test("reorders items within a module by override position", () => {
    const twoModel = buildDefaultSidebarModel([
      moduleDescriptor({
        key: "blog_content",
        name: "Blog",
        navigation: [
          { labelKey: "b1", path: "/admin/blog/1", order: 1 },
          { labelKey: "b2", path: "/admin/blog/2", order: 2 }
        ]
      })
    ]);
    const overrides: SidebarItemOverride[] = [
      {
        entryKey: "/admin/blog/2",
        typeKey: null,
        position: 0,
        labelOverride: null,
        hidden: false
      },
      {
        entryKey: "/admin/blog/1",
        typeKey: null,
        position: 1,
        labelOverride: null,
        hidden: false
      }
    ];
    const composed = composeSidebarArrangement(twoModel, [], overrides, {
      grantedPermissionKeys: allGranted(twoModel),
      tenantDisabledModuleKeys: new Set()
    });
    const blog = composed.types
      .find((t) => t.typeKey === "content")!
      .items.find((m) => m.moduleKey === "blog_content")!;
    expect(blog.entries.map((e) => e.path)).toEqual([
      "/admin/blog/2",
      "/admin/blog/1"
    ]);
  });
});

describe("composeSidebarArrangement — type overrides", () => {
  const model = buildDefaultSidebarModel([
    moduleDescriptor({ key: "blog_content", name: "Blog" })
  ]);

  test("reorders a type before system via override position", () => {
    const typeOverrides: SidebarTypeOverride[] = [
      { typeKey: "content", labelOverride: null, position: -1, hidden: false }
    ];
    const composed = composeSidebarArrangement(model, typeOverrides, [], {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });
    expect(composed.types[0]!.typeKey).toBe("content");
  });

  test("hides a whole type (and its items)", () => {
    const typeOverrides: SidebarTypeOverride[] = [
      { typeKey: "content", labelOverride: null, position: 1, hidden: true }
    ];
    const composed = composeSidebarArrangement(model, typeOverrides, [], {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });
    expect(composed.types.some((t) => t.typeKey === "content")).toBe(false);
  });

  test("relabels a type", () => {
    const typeOverrides: SidebarTypeOverride[] = [
      {
        typeKey: "content",
        labelOverride: "Publishing",
        position: 1,
        hidden: false
      }
    ];
    const composed = composeSidebarArrangement(model, typeOverrides, [], {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });
    expect(
      composed.types.find((t) => t.typeKey === "content")?.labelOverride
    ).toBe("Publishing");
  });

  test("places a custom type by its override position", () => {
    const custom = buildDefaultSidebarModel([
      moduleDescriptor({ key: "blog_content", name: "Blog" })
    ]);
    const typeOverrides: SidebarTypeOverride[] = [
      {
        typeKey: "featured",
        labelOverride: "Featured",
        position: 0,
        hidden: false
      }
    ];
    const itemOverrides: SidebarItemOverride[] = [
      {
        entryKey: "/admin/blog",
        typeKey: "featured",
        position: 0,
        labelOverride: null,
        hidden: false
      }
    ];
    const composed = composeSidebarArrangement(
      custom,
      typeOverrides,
      itemOverrides,
      {
        grantedPermissionKeys: allGranted(custom),
        tenantDisabledModuleKeys: new Set()
      }
    );
    expect(composed.types[0]!.typeKey).toBe("featured");
    expect(composed.types[0]!.labelOverride).toBe("Featured");
  });
});

describe("composeSidebarArrangement — filtering", () => {
  test("filters an item whose exact permission is not granted", () => {
    const model = buildDefaultSidebarModel([
      moduleDescriptor({
        key: "blog_content",
        name: "Blog",
        navigation: [
          {
            labelKey: "b",
            path: "/admin/blog",
            requiredPermission: "blog_content.posts.read"
          }
        ]
      })
    ]);
    const composed = composeSidebarArrangement(model, [], [], NO_OPTIONS);
    expect(
      composed.types.some((t) =>
        t.items.some((m) => m.moduleKey === "blog_content")
      )
    ).toBe(false);
  });

  test("core prefix gate: Access & Users hidden without an identity_access.* grant", () => {
    const model = buildDefaultSidebarModel([]);
    const composed = composeSidebarArrangement(model, [], [], NO_OPTIONS);
    const entries = composed.types
      .flatMap((t) => t.items)
      .flatMap((m) => m.entries);
    expect(entries.some((e) => e.path === "/admin/access-users")).toBe(false);
    // Dashboard (ungated) survives.
    expect(entries.some((e) => e.path === "/admin")).toBe(true);
  });

  test("core prefix gate: Access & Users shown WITH an identity_access.* grant", () => {
    const model = buildDefaultSidebarModel([]);
    const composed = composeSidebarArrangement(model, [], [], {
      grantedPermissionKeys: new Set(["identity_access.roles.read"]),
      tenantDisabledModuleKeys: new Set()
    });
    const entries = composed.types
      .flatMap((t) => t.items)
      .flatMap((m) => m.entries);
    expect(entries.some((e) => e.path === "/admin/access-users")).toBe(true);
  });

  test("filters items of a tenant-disabled module", () => {
    const model = buildDefaultSidebarModel([
      moduleDescriptor({ key: "blog_content", name: "Blog" })
    ]);
    const composed = composeSidebarArrangement(model, [], [], {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set(["blog_content"])
    });
    expect(
      composed.types.some((t) =>
        t.items.some((m) => m.moduleKey === "blog_content")
      )
    ).toBe(false);
  });

  test("empty overrides = pure code default (reset semantics)", () => {
    const model = buildDefaultSidebarModel([
      moduleDescriptor({ key: "blog_content", name: "Blog" })
    ]);
    const withOverride = composeSidebarArrangement(
      model,
      [{ typeKey: "content", labelOverride: "X", position: 0, hidden: false }],
      [],
      {
        grantedPermissionKeys: allGranted(model),
        tenantDisabledModuleKeys: new Set()
      }
    );
    const reset = composeSidebarArrangement(model, [], [], {
      grantedPermissionKeys: allGranted(model),
      tenantDisabledModuleKeys: new Set()
    });
    expect(
      withOverride.types.find((t) => t.typeKey === "content")?.labelOverride
    ).toBe("X");
    expect(
      reset.types.find((t) => t.typeKey === "content")?.labelOverride
    ).toBeUndefined();
  });
});

describe("validateSidebarMenuInput", () => {
  const model = buildDefaultSidebarModel([
    moduleDescriptor({ key: "blog_content", name: "Blog" })
  ]);

  test("accepts a valid payload with a custom type", () => {
    const result = validateSidebarMenuInput(
      {
        types: [
          {
            typeKey: "content",
            labelOverride: "Publishing",
            position: 0,
            hidden: false
          },
          {
            typeKey: "featured",
            labelOverride: "Featured",
            position: 1,
            hidden: false
          }
        ],
        items: [
          {
            entryKey: "/admin/blog",
            typeKey: "featured",
            position: 0,
            labelOverride: null,
            hidden: false
          }
        ]
      },
      model
    );
    expect(result.ok).toBe(true);
  });

  test("rejects an unknown entry key", () => {
    const result = validateSidebarMenuInput(
      {
        types: [],
        items: [
          {
            entryKey: "/admin/does-not-exist",
            typeKey: null,
            position: 0,
            labelOverride: null,
            hidden: false
          }
        ]
      },
      model
    );
    expect(result.ok).toBe(false);
  });

  test("rejects a malformed custom type key", () => {
    const result = validateSidebarMenuInput(
      {
        types: [
          {
            typeKey: "Bad Key!",
            labelOverride: null,
            position: 0,
            hidden: false
          }
        ],
        items: []
      },
      model
    );
    expect(result.ok).toBe(false);
  });

  test("rejects an oversized label override", () => {
    const result = validateSidebarMenuInput(
      {
        types: [],
        items: [
          {
            entryKey: "/admin/blog",
            typeKey: null,
            position: 0,
            labelOverride: "x".repeat(200),
            hidden: false
          }
        ]
      },
      model
    );
    expect(result.ok).toBe(false);
  });

  test("rejects an item type referencing an unknown type", () => {
    const result = validateSidebarMenuInput(
      {
        types: [],
        items: [
          {
            entryKey: "/admin/blog",
            typeKey: "nonexistent",
            position: 0,
            labelOverride: null,
            hidden: false
          }
        ]
      },
      model
    );
    expect(result.ok).toBe(false);
  });

  test("rejects duplicate entry keys", () => {
    const result = validateSidebarMenuInput(
      {
        types: [],
        items: [
          {
            entryKey: "/admin/blog",
            typeKey: null,
            position: 0,
            labelOverride: null,
            hidden: false
          },
          {
            entryKey: "/admin/blog",
            typeKey: null,
            position: 1,
            labelOverride: null,
            hidden: false
          }
        ]
      },
      model
    );
    expect(result.ok).toBe(false);
  });
});

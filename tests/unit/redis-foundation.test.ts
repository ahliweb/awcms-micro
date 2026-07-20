import { describe, expect, test } from "bun:test";

import {
  deleteRedisCache,
  getRedisJson,
  redisCacheAside,
  setRedisJson,
  type RedisCacheClient
} from "../../src/lib/redis/cache";
import {
  buildRedisKey,
  loadRedisConfig,
  redactRedisUrl,
  validateRedisConfig,
  type RedisConfig
} from "../../src/lib/redis/config";

function enabledConfig(overrides: Partial<RedisConfig> = {}): RedisConfig {
  return {
    enabled: true,
    url: "redis://awcms_app:secret@localhost:6379/0",
    keyPrefix: "awcms-micro",
    connectionTimeoutMs: 2_000,
    commandTimeoutMs: 1_000,
    maxRetries: 3,
    cacheDefaultTtlSec: 300,
    ...overrides
  };
}

class FakeRedisClient {
  readonly values = new Map<string, string>();
  readonly commands: Array<{ command: string; args: string[] }> = [];
  failReads = false;
  failWrites = false;

  async get(key: string): Promise<string | null> {
    if (this.failReads) throw new Error("simulated Redis read outage");
    return this.values.get(key) ?? null;
  }

  async send(command: string, args: string[]): Promise<unknown> {
    const normalized = command.toUpperCase();
    this.commands.push({ command: normalized, args });
    if (this.failWrites) throw new Error("simulated Redis write outage");

    if (normalized === "SET") {
      this.values.set(args[0]!, args[1]!);
      return "OK";
    }

    if (normalized === "DEL") {
      return this.values.delete(args[0]!) ? 1 : 0;
    }

    return null;
  }

  asClient(): RedisCacheClient {
    return this as unknown as RedisCacheClient;
  }
}

describe("Redis configuration", () => {
  test("is disabled by default and requires URL only when enabled", () => {
    const disabled = loadRedisConfig({});
    expect(disabled.enabled).toBe(false);
    expect(disabled.url).toBeNull();
    expect(validateRedisConfig(disabled, {})).toEqual([]);

    const env = { REDIS_ENABLED: "true" };
    expect(
      validateRedisConfig(loadRedisConfig(env), env).some(
        (finding) => finding.code === "redis_url_required"
      )
    ).toBe(true);
  });

  test("rejects unsupported scheme and malformed literals", () => {
    const env = {
      REDIS_ENABLED: "yes",
      REDIS_URL: "http://localhost:6379",
      REDIS_CONNECTION_TIMEOUT_MS: "bad",
      REDIS_COMMAND_TIMEOUT_MS: "0",
      REDIS_MAX_RETRIES: "999",
      REDIS_CACHE_DEFAULT_TTL_SEC: "-1"
    };
    const findings = validateRedisConfig(loadRedisConfig(env), env);

    expect(findings.some((item) => item.code === "redis_boolean_invalid")).toBe(
      true
    );
    expect(
      findings.filter((item) => item.code === "redis_integer_out_of_range")
        .length
    ).toBe(4);
  });

  test("warns for unauthenticated public Redis in production", () => {
    const env = {
      APP_ENV: "production",
      REDIS_ENABLED: "true",
      REDIS_URL: "redis://cache.example.com:6379/0"
    };
    const findings = validateRedisConfig(loadRedisConfig(env), env);

    expect(findings.some((item) => item.code === "redis_tls_recommended")).toBe(
      true
    );
    expect(
      findings.some((item) => item.code === "redis_auth_recommended")
    ).toBe(true);
  });

  test("redacts credentials and uses bounded numeric defaults", () => {
    const redacted = redactRedisUrl(
      "redis://awcms_app:very-secret@redis.internal:6379/0"
    );
    expect(redacted).not.toContain("very-secret");
    expect(redacted).toContain("***");

    const config = loadRedisConfig({
      REDIS_CONNECTION_TIMEOUT_MS: "bad",
      REDIS_COMMAND_TIMEOUT_MS: "0",
      REDIS_MAX_RETRIES: "999",
      REDIS_CACHE_DEFAULT_TTL_SEC: "-1"
    });
    expect(config.connectionTimeoutMs).toBe(2_000);
    expect(config.commandTimeoutMs).toBe(1_000);
    expect(config.maxRetries).toBe(3);
    expect(config.cacheDefaultTtlSec).toBe(300);
  });
});

describe("Redis key namespacing", () => {
  test("separates tenant/global scope and encodes delimiters", () => {
    const tenantA = buildRedisKey(
      { namespace: "reports", tenantId: "tenant-a", key: "summary" },
      { keyPrefix: "awcms-micro" }
    );
    const tenantB = buildRedisKey(
      { namespace: "reports", tenantId: "tenant-b", key: "summary" },
      { keyPrefix: "awcms-micro" }
    );
    const global = buildRedisKey(
      { namespace: "reports", key: "summary" },
      { keyPrefix: "awcms-micro" }
    );
    const encoded = buildRedisKey(
      { namespace: "report:admin", tenantId: "tenant:1", key: "a:b" },
      { keyPrefix: "awcms-micro" }
    );

    expect(tenantA).toBe("awcms-micro:v1:reports:tenant:tenant-a:summary");
    expect(tenantB).not.toBe(tenantA);
    expect(global).toBe("awcms-micro:v1:reports:global:summary");
    expect(encoded).toBe(
      "awcms-micro:v1:report%3Aadmin:tenant:tenant%3A1:a%3Ab"
    );
  });

  test("rejects empty and excessively long segments", () => {
    expect(() =>
      buildRedisKey(
        { namespace: " ", tenantId: "tenant-a", key: "summary" },
        { keyPrefix: "awcms-micro" }
      )
    ).toThrow();
    expect(() =>
      buildRedisKey(
        { namespace: "reports", tenantId: "tenant-a", key: "x".repeat(257) },
        { keyPrefix: "awcms-micro" }
      )
    ).toThrow();
  });
});

describe("Redis cache-aside helpers", () => {
  test("reads/writes JSON with TTL and rejects invalid TTL", async () => {
    const fake = new FakeRedisClient();
    const config = enabledConfig();

    expect(
      await setRedisJson(
        "awcms-micro:v1:test:global:item",
        { value: 42 },
        { client: fake.asClient(), config, ttlSec: 60 }
      )
    ).toBe(true);
    expect(fake.commands[0]).toEqual({
      command: "SET",
      args: ["awcms-micro:v1:test:global:item", '{"value":42}', "EX", "60"]
    });
    expect(
      await getRedisJson<{ value: number }>("awcms-micro:v1:test:global:item", {
        client: fake.asClient(),
        config
      })
    ).toEqual({ value: 42 });

    await expect(
      setRedisJson(
        "invalid-ttl",
        { value: 1 },
        {
          client: fake.asClient(),
          config,
          ttlSec: 0
        }
      )
    ).rejects.toThrow();
  });

  test("malformed JSON is removed and treated as a miss", async () => {
    const fake = new FakeRedisClient();
    const key = "awcms-micro:v1:test:global:bad-json";
    fake.values.set(key, "{not-json");

    expect(
      await getRedisJson(key, {
        client: fake.asClient(),
        config: enabledConfig()
      })
    ).toBeNull();
    expect(fake.values.has(key)).toBe(false);
  });

  test("fails open during Redis outage", async () => {
    const fake = new FakeRedisClient();
    fake.failReads = true;
    fake.failWrites = true;
    const options = { client: fake.asClient(), config: enabledConfig() };

    expect(await getRedisJson("item", options)).toBeNull();
    expect(await setRedisJson("item", { value: 42 }, options)).toBe(false);
    expect(await deleteRedisCache("item", options)).toBe(false);
  });

  test("uses cache hit and authoritative loader on miss", async () => {
    const fake = new FakeRedisClient();
    const key = "awcms-micro:v1:test:global:item";
    fake.values.set(key, '{"source":"cache"}');
    let loaderCalls = 0;

    expect(
      await redisCacheAside(
        key,
        async () => {
          loaderCalls += 1;
          return { source: "database" };
        },
        { client: fake.asClient(), config: enabledConfig() }
      )
    ).toEqual({ source: "cache" });
    expect(loaderCalls).toBe(0);

    fake.values.clear();
    expect(
      await redisCacheAside(key, async () => ({ source: "database" }), {
        client: fake.asClient(),
        config: enabledConfig(),
        ttlSec: 30
      })
    ).toEqual({ source: "database" });
    expect(JSON.parse(fake.values.get(key)!)).toEqual({ source: "database" });
  });
});

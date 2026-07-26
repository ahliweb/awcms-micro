/**
 * A real Varnish, started from this repo's own shipped VCL (Issue #359/#361
 * follow-up).
 *
 * Shared by every test that has to observe the cache's ACTUAL behaviour
 * rather than a stub of it. That distinction is the whole point: the
 * invalidation transport was dead for two releases precisely because every
 * gate mocked the layer that was broken, so a fixture that mocked anything
 * here would reproduce the blind spot instead of closing it.
 *
 * `deploy/varnish/default.vcl` is used verbatim except for the backend
 * address — the same single substitution the staging repoint script makes.
 * The rules under test live in that file, so testing a copy of it would
 * prove nothing about what ships.
 */
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const VARNISH_IMAGE = "varnish:7.7.3";

async function commandSucceeds(command: string[]): Promise<boolean> {
  try {
    const spawned = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });

    return (await spawned.exited) === 0;
  } catch {
    return false;
  }
}

export const dockerAvailable = await commandSucceeds(["docker", "info"]);

/**
 * `EDGE_CACHE_VARNISH_TEST=1` (set by CI) turns "this environment cannot run
 * the suite" from a silent skip into a hard failure. A suite that guards a
 * transport must never pass by not running — that is the same shape of
 * blindness it exists to close.
 */
export const varnishSuiteRequired = process.env.EDGE_CACHE_VARNISH_TEST === "1";

/**
 * A free TCP port, obtained by binding and immediately releasing one.
 *
 * Racy in principle; acceptable because the container claims it milliseconds
 * later and a collision surfaces as an obvious startup failure rather than a
 * wrong assertion.
 */
function reserveEphemeralPort(): number {
  const probe = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch: () => new Response("")
  });
  const port = probe.port ?? 0;

  // Deliberately fire-and-forget: this helper is synchronous (it returns a
  // port number), so it cannot await the close. `void` marks the discard as
  // intentional for `@typescript-eslint/no-floating-promises`.
  void probe.stop(true);

  if (port === 0) {
    throw new Error("could not reserve a TCP port for the cache container");
  }

  return port;
}

export type CacheProbe = {
  status: number;
  /** `HIT` / `MISS` as the cache itself classified the request. */
  cache: string | null;
  body: string;
  headers: Headers;
};

export type VarnishFixture = {
  varnishPort: number;
  backendPort: number;
  purgeToken: string;
  purgeUrl: string;
  /** Requests that actually reached the origin — a cache HIT must not move this. */
  originHits: () => number;
  fetchThroughCache: (
    host: string,
    path?: string,
    init?: RequestInit
  ) => Promise<CacheProbe>;
  stop: () => Promise<void>;
};

export type VarnishFixtureOptions = {
  /**
   * Origin behaviour. The default speaks the same contract the middleware
   * does (`Surrogate-Control` for the shared cache, `Vary: Cookie`), which is
   * all the VCL consumes.
   */
  backend?: (request: Request, hits: number) => Response;
  purgeToken?: string;
};

function defaultBackend(request: Request, hits: number): Response {
  const url = new URL(request.url);
  const body = `origin-response ${url.pathname} #${hits}`;

  if (url.pathname === "/uncacheable") {
    return new Response(body, {
      headers: {
        "Content-Type": "text/html",
        "Surrogate-Control": "no-store"
      }
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/html",
      "Surrogate-Control": "max-age=60, stale-if-error=600",
      "Cache-Control": "public, max-age=0, must-revalidate",
      Vary: "Cookie"
    }
  });
}

export async function startVarnish(
  options: VarnishFixtureOptions = {}
): Promise<VarnishFixture> {
  const purgeToken = options.purgeToken ?? "integration-edge-cache-purge-token";
  const handler = options.backend ?? defaultBackend;

  let hits = 0;

  const backend = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(request) {
      hits += 1;

      return handler(request, hits);
    }
  });

  const backendPort = backend.port ?? 0;
  const varnishPort = reserveEphemeralPort();
  const workDirectory = await mkdtemp(join(tmpdir(), "awcms-micro-varnish-"));
  const vclPath = join(workDirectory, "default.vcl");

  const shippedVcl = await Bun.file("deploy/varnish/default.vcl").text();
  const vcl = shippedVcl
    .replace('.host = "app";', '.host = "127.0.0.1";')
    .replace('.port = "4321";', `.port = "${backendPort}";`);

  if (!vcl.includes(`.port = "${backendPort}";`)) {
    throw new Error(
      "deploy/varnish/default.vcl no longer has the expected backend block — update this fixture's substitution"
    );
  }

  await writeFile(vclPath, vcl, "utf8");

  // `--network host` so the containerized cache can reach the in-process
  // backend on 127.0.0.1 without publishing a port.
  const run = Bun.spawn(
    [
      "docker",
      "run",
      "--rm",
      "--detach",
      "--network",
      "host",
      "--env",
      `EDGE_CACHE_PURGE_TOKEN=${purgeToken}`,
      "--volume",
      `${vclPath}:/etc/varnish/default.vcl:ro`,
      VARNISH_IMAGE,
      "varnishd",
      "-F",
      "-f",
      "/etc/varnish/default.vcl",
      "-a",
      `:${varnishPort}`,
      "-s",
      "malloc,64M"
    ],
    { stdout: "pipe", stderr: "pipe" }
  );

  const stdout = await new Response(run.stdout).text();
  const stderr = await new Response(run.stderr).text();

  if ((await run.exited) !== 0) {
    await backend.stop(true);
    await rm(workDirectory, { recursive: true, force: true });

    throw new Error(`docker run ${VARNISH_IMAGE} failed: ${stderr || stdout}`);
  }

  const containerId = stdout.trim();

  async function fetchThroughCache(
    host: string,
    path = "/",
    init: RequestInit = {}
  ): Promise<CacheProbe> {
    const response = await fetch(`http://127.0.0.1:${varnishPort}${path}`, {
      ...init,
      headers: { Host: host, ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(5_000)
    });

    return {
      status: response.status,
      cache: response.headers.get("x-cache"),
      body: await response.text(),
      headers: response.headers
    };
  }

  const deadline = Date.now() + 40_000;
  let ready = false;

  while (Date.now() < deadline && !ready) {
    try {
      ready =
        (await fetchThroughCache("readiness.invalid", "/readiness-probe"))
          .status === 200;
    } catch {
      // Not listening yet.
    }

    if (!ready) {
      await Bun.sleep(400);
    }
  }

  if (!ready) {
    Bun.spawnSync(["docker", "rm", "--force", containerId], {
      stdout: "ignore",
      stderr: "ignore"
    });
    await backend.stop(true);
    await rm(workDirectory, { recursive: true, force: true });

    throw new Error(`${VARNISH_IMAGE} did not become reachable within 40s`);
  }

  return {
    varnishPort,
    backendPort,
    purgeToken,
    purgeUrl: `http://127.0.0.1:${varnishPort}`,
    originHits: () => hits,
    fetchThroughCache,
    async stop() {
      Bun.spawnSync(["docker", "rm", "--force", containerId], {
        stdout: "ignore",
        stderr: "ignore"
      });
      await backend.stop(true);
      await rm(workDirectory, { recursive: true, force: true });
    }
  };
}

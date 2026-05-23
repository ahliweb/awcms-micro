#!/usr/bin/env node

import { execFile, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "../..");
const HOST = "127.0.0.1";
const LOCAL_PORT = 4544;
const CLOUDFARE_PORT = 4545;

const templates = [
	{
		name: "awcms-micro-default",
		port: LOCAL_PORT,
		dir: resolve(ROOT, "templates/awcms-micro-default"),
		routes: ["/", "/aggregate", "/posts", "/news", "/_emdash/api/plugins/awcms-micro-example/public/status"],
	},
	{
		name: "awcms-micro-default-cloudflare",
		port: CLOUDFARE_PORT,
		dir: resolve(ROOT, "templates/awcms-micro-default-cloudflare"),
		routes: ["/", "/aggregate", "/posts", "/news", "/_emdash/api/plugins/awcms-micro-example/public/status"],
	},
];

async function buildTemplate(dir) {
	process.stdout.write(`building ${dir}\n`);
	await execAsync("pnpm", ["build"], { cwd: dir, timeout: 1_200_000 });
}

function waitForServer(url, timeoutMs = 120_000) {
	const started = Date.now();
	return new Promise((resolveReady, rejectReady) => {
		const tick = async () => {
			try {
				const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
				if (res.ok || res.status === 404) {
					resolveReady();
					return;
				}
			} catch {
				// keep waiting
			}
			if (Date.now() - started > timeoutMs) {
				rejectReady(new Error(`Server at ${url} did not start within ${timeoutMs}ms`));
				return;
			}
			setTimeout(tick, 500);
		};
		void tick();
	});
}

function startPreview(dir, port) {
	const child = spawn("pnpm", ["exec", "astro", "preview", "--host", HOST, "--port", String(port)], {
		cwd: dir,
		env: { ...process.env, HOST, PORT: String(port) },
		stdio: ["ignore", "pipe", "pipe"],
	});

	child.stdout.on("data", (data) => process.stdout.write(data));
	child.stderr.on("data", (data) => process.stderr.write(data));

	const exited = new Promise((resolveExit) => child.once("exit", resolveExit));

	return {
		child,
		ready: waitForServer(`http://${HOST}:${port}`),
		async stop() {
			child.kill("SIGTERM");
			await Promise.race([exited, new Promise((resolveTimer) => setTimeout(resolveTimer, 5000)).then(() => child.kill("SIGKILL"))]);
		},
	};
}

async function fetchRoute(baseUrl, path) {
	const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
	const body = await response.text();
	if (!response.ok) {
		throw new Error(`GET ${path} failed (${response.status})`);
	}
	return body;
}

async function validateTemplate(template) {
	await buildTemplate(template.dir);
	const preview = startPreview(template.dir, template.port);
	const baseUrl = `http://${HOST}:${template.port}`;

	try {
		await preview.ready;
		for (const path of template.routes) {
			const body = await fetchRoute(baseUrl, path);
			if (path === "/_emdash/api/plugins/awcms-micro-example/public/status") {
				const json = JSON.parse(body);
				const payload = json?.data ?? json;
				if (payload?.plugin?.visibility !== "public-safe") {
					throw new Error(`${template.name}: plugin visibility was not public-safe`);
				}
				continue;
			}
			if (path === "/" && !body.includes("AWCMS-Micro")) {
				throw new Error(`${template.name}: home page missing expected brand text`);
			}
			if (path === "/aggregate" && !body.includes("Public aggregate")) {
				throw new Error(`${template.name}: aggregate page missing expected heading`);
			}
		}
		process.stdout.write(`validated ${template.name}\n`);
	} finally {
		await preview.stop();
	}
}

async function main() {
	for (const template of templates) {
		await validateTemplate(template);
	}
	process.stdout.write("AWCMS-Micro smoke validation complete\n");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

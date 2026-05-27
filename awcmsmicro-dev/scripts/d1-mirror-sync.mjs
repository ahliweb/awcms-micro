import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DEFAULT_DATABASE = "awcms-micro-d1";
const DEFAULT_MIRROR_DIR = path.join(".local", "d1-mirror");
const DEFAULT_INTERVAL_MS = 15000;
const newlineRe = /\r?\n/;
const exportPrefixRe = /^export\s+/;
const quotedValueRe = /^(".*"|'.*')$/;

const command = process.argv[2] ?? "status";
const database = getFlagValue("--database") ?? DEFAULT_DATABASE;
const mirrorDir = path.resolve(getFlagValue("--mirror-dir") ?? DEFAULT_MIRROR_DIR);
const intervalMs = Number(getFlagValue("--interval") ?? String(DEFAULT_INTERVAL_MS));

const mirrorPath = path.join(mirrorDir, `${database}.sqlite`);
const basePath = path.join(mirrorDir, `${database}.base.sqlite`);
const remoteSnapshotPath = path.join(mirrorDir, `${database}.remote.sqlite`);
const stagingPath = path.join(mirrorDir, `${database}.staging.sqlite`);

loadRootEnv();

function getFlagValue(flag) {
	const index = process.argv.indexOf(flag);
	if (index === -1) return null;
	return process.argv[index + 1] ?? null;
}

function loadRootEnv() {
	const envPath = path.resolve("..", ".env");
	if (!existsSync(envPath)) return;
	const content = readFileSync(envPath, "utf8");
	for (const line of content.split(newlineRe)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const equalIndex = trimmed.indexOf("=");
		if (equalIndex === -1) continue;
		const key = trimmed.slice(0, equalIndex).trim().replace(exportPrefixRe, "");
		if (!key) continue;
		if (process.env[key]) continue;
		let value = trimmed.slice(equalIndex + 1).trim();
		if (quotedValueRe.test(value)) {
			value = value.slice(1, -1);
		}
		process.env[key] = value;
	}

	if (!process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_WORKER_ACCOUNT_ID) {
		process.env.CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_WORKER_ACCOUNT_ID;
	}
	if (!process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_WORKER_API_TOKEN) {
		process.env.CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_WORKER_API_TOKEN;
	}
	if (!process.env.AWCMS_MICRO_D1_DATABASE_ID && process.env.CLOUDFLARE_WORKER_D1_DATABASE_ID) {
		process.env.AWCMS_MICRO_D1_DATABASE_ID = process.env.CLOUDFLARE_WORKER_D1_DATABASE_ID;
	}
}

function log(message) {
	console.log(`[d1-mirror] ${message}`);
}

function ensureDir() {
	mkdirSync(mirrorDir, { recursive: true });
}

function openDatabase(filePath) {
	return new DatabaseSync(filePath);
}

function closeDatabase(db) {
	try {
		db.close?.();
	} catch {
		// ignore close errors for the experimental sqlite module
	}
}

function quoteIdent(value) {
	return `"${String(value).replaceAll("\"", "\"\"")}"`;
}

function sqlLiteral(value) {
	if (value === null || value === undefined) return "NULL";
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "bigint") return String(value);
	if (typeof value === "boolean") return value ? "1" : "0";
	if (value instanceof Uint8Array) return `X'${Buffer.from(value).toString("hex")}'`;
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqliteBindValue(value) {
	if (value === null || value === undefined) return null;
	if (typeof value === "number" || typeof value === "string") return value;
	if (typeof value === "boolean") return value ? 1 : 0;
	if (typeof value === "bigint") return String(value);
	if (value instanceof Uint8Array) return Buffer.from(value);
	if (Array.isArray(value) || typeof value === "object") return JSON.stringify(value);
	return String(value);
}

function runRemoteQuery(sql) {
	if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
		throw new Error("Missing Cloudflare credentials. Set them in the root .env file.");
	}
	const output = execFileSync(
		"pnpm",
		["--dir", "templates/awcms-micro-default-cloudflare", "exec", "wrangler", "d1", "execute", database, "--remote", "--json", "--command", sql],
		{
			encoding: "utf8",
			env: {
				...process.env,
				CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
				CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
			},
		},
	);
	const parsed = JSON.parse(output);
	return parsed[0]?.results ?? [];
}

function listRemoteTables() {
	return runRemoteQuery(
		"SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND sql IS NOT NULL AND sql NOT LIKE 'CREATE VIRTUAL TABLE%';",
	);
}

function listRemoteIndexes(tableName) {
	return runRemoteQuery(
		`SELECT sql FROM sqlite_master WHERE type = 'index' AND tbl_name = ${sqlLiteral(tableName)} AND sql IS NOT NULL AND name NOT LIKE 'sqlite_%';`,
	);
}

function tableInfoRemote(tableName) {
	return runRemoteQuery(`PRAGMA table_info(${sqlLiteral(tableName)});`);
}

function tableMetadataFromInfo(info) {
	const columns = info.map((column) => column.name);
	const primaryColumns = info.filter((column) => column.pk === 1);
	const updatedAtColumn = info.find((column) => column.name === "updated_at" || column.name === "updatedAt")?.name ?? null;
	return {
		columns,
		eligible: primaryColumns.length === 1 && primaryColumns[0].name === "id" && Boolean(updatedAtColumn),
		updatedAtColumn,
	};
}

function listEligibleTablesFromRemote() {
	return listRemoteTables()
		.map((row) => {
			if (row.name.startsWith("_cf_")) return null;
			const info = tableInfoRemote(row.name);
			const meta = tableMetadataFromInfo(info);
			return { name: row.name, sql: row.sql, meta };
		})
		.filter(Boolean)
		.filter(({ meta }) => meta.eligible);
}

function loadRows(db, tableName) {
	return db.prepare(`SELECT * FROM ${quoteIdent(tableName)} ORDER BY id`).all();
}

function rowMap(rows) {
	return new Map(rows.map((row) => [row.id, row]));
}

function rowsEqual(left, right, columns) {
	if (!left || !right) return false;
	for (const column of columns) {
		if ((left[column] ?? null) !== (right[column] ?? null)) return false;
	}
	return true;
}

function parseTimestamp(value) {
	if (value === null || value === undefined || value === "") return Number.NEGATIVE_INFINITY;
	const parsed = Date.parse(String(value));
	return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

function chooseWinner(baseRow, localRow, remoteRow, columns, updatedAtColumn) {
	if (localRow && !remoteRow) return localRow;
	if (remoteRow && !localRow) return remoteRow;
	if (!localRow && !remoteRow) return null;

	const localChanged = !rowsEqual(baseRow, localRow, columns);
	const remoteChanged = !rowsEqual(baseRow, remoteRow, columns);

	if (localChanged && !remoteChanged) return localRow;
	if (remoteChanged && !localChanged) return remoteRow;
	if (!localChanged && !remoteChanged) return remoteRow;

	const localTime = parseTimestamp(localRow?.[updatedAtColumn]);
	const remoteTime = parseTimestamp(remoteRow?.[updatedAtColumn]);
	if (localTime > remoteTime) return localRow;
	if (remoteTime > localTime) return remoteRow;
	return remoteRow;
}

function buildUpsertSql(tableName, columns, rows) {
	if (rows.length === 0) return "";
	const columnList = columns.map(quoteIdent).join(", ");
	const updateList = columns
		.filter((column) => column !== "id")
		.map((column) => `${quoteIdent(column)} = excluded.${quoteIdent(column)}`)
		.join(", ");
	const statements = rows.map((row) => {
		const values = columns.map((column) => sqlLiteral(row[column] ?? null)).join(", ");
		return `INSERT INTO ${quoteIdent(tableName)} (${columnList}) VALUES (${values}) ON CONFLICT(${quoteIdent("id")}) DO UPDATE SET ${updateList};`;
	});
	return `BEGIN IMMEDIATE;\n${statements.join("\n")}\nCOMMIT;\n`;
}

function buildSnapshot(targetPath) {
	rmSync(targetPath, { force: true });
	const snapshotDb = openDatabase(targetPath);
	snapshotDb.exec("PRAGMA foreign_keys = OFF;");
	const tables = listEligibleTablesFromRemote();
	for (const table of tables) {
		snapshotDb.exec(table.sql);
	}
	for (const table of tables) {
		const rows = runRemoteQuery(`SELECT * FROM ${quoteIdent(table.name)};`);
		if (rows.length === 0) continue;
		const stmt = snapshotDb.prepare(
			`INSERT INTO ${quoteIdent(table.name)} (${table.meta.columns.map(quoteIdent).join(", ")}) VALUES (${table.meta.columns.map(() => "?").join(", ")})`,
		);
		for (const row of rows) {
			stmt.run(...table.meta.columns.map((column) => sqliteBindValue(row[column] ?? null)));
		}
	}
	for (const table of tables) {
		for (const index of listRemoteIndexes(table.name)) {
			if (index.sql) snapshotDb.exec(index.sql);
		}
	}
	closeDatabase(snapshotDb);
}

function initializeMirror() {
	buildSnapshot(remoteSnapshotPath);
	buildSnapshot(mirrorPath);
	buildSnapshot(basePath);
	log(`initialized mirror at ${mirrorPath}`);
	log(`open this file in DBeaver as SQLite`);
}

function syncSchemaGuard(localDb, remoteDb, tables) {
	for (const table of tables) {
		const localColumns = tableMetadataFromInfo(tableInfoLocal(localDb, table.name)).columns;
		const remoteColumns = table.meta.columns;
		if (localColumns.join("|") !== remoteColumns.join("|")) {
			throw new Error(`Schema mismatch for ${table.name}. Rebuild the mirror with "reset".`);
		}
	}
}

function tableInfoLocal(db, tableName) {
	return db.prepare(`PRAGMA table_info(${sqlLiteral(tableName)});`).all();
}

function createMergedSql(localDb, remoteDb, baseDb, tables) {
	const mergedStatements = [];
	for (const table of tables) {
		const { columns, updatedAtColumn } = table.meta;
		const baseRows = rowMap(loadRows(baseDb, table.name));
		const localRows = rowMap(loadRows(localDb, table.name));
		const remoteRows = rowMap(loadRows(remoteDb, table.name));
		const keys = new Set([...baseRows.keys(), ...localRows.keys(), ...remoteRows.keys()]);
		const winners = [];
		for (const id of keys) {
			const winner = chooseWinner(baseRows.get(id), localRows.get(id), remoteRows.get(id), columns, updatedAtColumn);
			if (!winner) continue;
			winners.push(winner);
		}
		const sql = buildUpsertSql(table.name, columns, winners);
		if (sql) mergedStatements.push(sql);
	}
	return mergedStatements.join("\n");
}

function refreshStatus() {
	if (!existsSync(mirrorPath) || !existsSync(basePath)) {
		log(`mirror is not initialized. Run "sync" first.`);
		return;
	}

	buildSnapshot(remoteSnapshotPath);
	const remoteDb = openDatabase(remoteSnapshotPath);
	const localDb = openDatabase(mirrorPath);
	const baseDb = openDatabase(basePath);
	const tables = listEligibleTablesFromRemote();
	let localChanged = 0;
	let remoteChanged = 0;

	for (const table of tables) {
		const columns = table.meta.columns;
		const baseRows = rowMap(loadRows(baseDb, table.name));
		const localRows = rowMap(loadRows(localDb, table.name));
		const remoteRows = rowMap(loadRows(remoteDb, table.name));
		const keys = new Set([...baseRows.keys(), ...localRows.keys(), ...remoteRows.keys()]);
		for (const key of keys) {
			if (!rowsEqual(baseRows.get(key), localRows.get(key), columns)) localChanged += 1;
			if (!rowsEqual(baseRows.get(key), remoteRows.get(key), columns)) remoteChanged += 1;
		}
	}

	closeDatabase(remoteDb);
	closeDatabase(localDb);
	closeDatabase(baseDb);

	log(`mirror: ${mirrorPath}`);
	log(`base:   ${basePath}`);
	log(`eligible tables: ${tables.length}`);
	log(`local deltas since base: ${localChanged}`);
	log(`remote deltas since base: ${remoteChanged}`);
}

function syncMirror({ reset = false } = {}) {
	buildSnapshot(remoteSnapshotPath);
	const remoteDb = openDatabase(remoteSnapshotPath);
	const tables = listEligibleTablesFromRemote();

	if (reset || !existsSync(mirrorPath) || !existsSync(basePath)) {
		initializeMirror();
		closeDatabase(remoteDb);
		return;
	}

	const localDb = openDatabase(mirrorPath);
	const baseDb = openDatabase(basePath);
	syncSchemaGuard(localDb, remoteDb, tables);

	const mergedSql = createMergedSql(localDb, remoteDb, baseDb, tables);
	if (!mergedSql.trim()) {
		closeDatabase(remoteDb);
		closeDatabase(localDb);
		closeDatabase(baseDb);
		log("no eligible row changes detected");
		return;
	}

	rmSync(stagingPath, { force: true });
	copyFileSync(mirrorPath, stagingPath);
	const stagingDb = openDatabase(stagingPath);
	try {
		stagingDb.exec(mergedSql);
		closeDatabase(stagingDb);
		// Apply row changes to production D1 with one SQL batch.
		execFileSync(
			"pnpm",
			[
				"--dir",
				"templates/awcms-micro-default-cloudflare",
				"exec",
				"wrangler",
				"d1",
				"execute",
				database,
				"--remote",
				"--skip-confirmation",
				"--command",
				mergedSql,
			],
			{ stdio: "inherit" },
		);
		buildSnapshot(mirrorPath);
		buildSnapshot(basePath);
		log(`synced ${tables.length} eligible tables to ${database}`);
	} finally {
		closeDatabase(stagingDb);
		closeDatabase(remoteDb);
		closeDatabase(localDb);
		closeDatabase(baseDb);
		rmSync(stagingPath, { force: true });
	}
}

function watchMirror() {
	if (!Number.isFinite(intervalMs) || intervalMs < 1000) {
		throw new Error("--interval must be at least 1000 milliseconds.");
	}

	let running = false;
	const runOnce = () => {
		if (running) return;
		running = true;
		try {
			syncMirror();
		} catch (error) {
			console.error(`[d1-mirror] watch sync failed:`, error);
		} finally {
			running = false;
		}
	};

	log(`watching ${database} every ${intervalMs}ms`);
	runOnce();
	const timer = setInterval(runOnce, intervalMs);
	process.on("SIGINT", () => {
		clearInterval(timer);
		process.exit(0);
	});
	process.on("SIGTERM", () => {
		clearInterval(timer);
		process.exit(0);
	});
}

function main() {
	ensureDir();
	if (command === "status") {
		refreshStatus();
		return;
	}
	if (command === "sync") {
		syncMirror();
		return;
	}
	if (command === "reset") {
		syncMirror({ reset: true });
		return;
	}
	if (command === "watch") {
		watchMirror();
		return;
	}
	throw new Error(`Unknown command "${command}". Use status, sync, reset, or watch.`);
}

main();

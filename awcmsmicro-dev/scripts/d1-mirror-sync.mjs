import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DEFAULT_DATABASE = "awcms-micro-d1";
const DEFAULT_MIRROR_DIR = path.join(".local", "d1-mirror");

const command = process.argv[2] ?? "status";
const database = getFlagValue("--database") ?? DEFAULT_DATABASE;
const intervalMs = Number(getFlagValue("--interval") ?? "15000");
const mirrorDir = path.resolve(getFlagValue("--mirror-dir") ?? DEFAULT_MIRROR_DIR);
const mirrorPath = path.join(mirrorDir, `${database}.sqlite`);
const basePath = path.join(mirrorDir, `${database}.base.sqlite`);
const remoteSqlPath = path.join(mirrorDir, `${database}.remote.sql`);
const remoteSnapshotPath = path.join(mirrorDir, `${database}.remote.sqlite`);
const stagingPath = path.join(mirrorDir, `${database}.staging.sqlite`);

function getFlagValue(flag) {
	const index = process.argv.indexOf(flag);
	if (index === -1) return null;
	return process.argv[index + 1] ?? null;
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

function execWrangler(args) {
	execFileSync("pnpm", ["exec", "wrangler", ...args], { stdio: "inherit" });
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

function listTables(db) {
	return db
		.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
		.all()
		.map((row) => row.name);
}

function tableInfo(db, tableName) {
	return db.prepare(`PRAGMA table_info(${quoteIdent(tableName)})`).all();
}

function tableMetadata(db, tableName) {
	const info = tableInfo(db, tableName);
	const columns = info.map((column) => column.name);
	const primaryColumns = info.filter((column) => column.pk === 1);
	const updatedAtColumn = info.find((column) => column.name === "updated_at" || column.name === "updatedAt")?.name ?? null;
	return {
		columns,
		isEligible: primaryColumns.length === 1 && primaryColumns[0].name === "id" && Boolean(updatedAtColumn),
		updatedAtColumn,
	};
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

function loadRows(db, tableName) {
	return db.prepare(`SELECT * FROM ${quoteIdent(tableName)} ORDER BY id`).all();
}

function rowMap(rows) {
	return new Map(rows.map((row) => [row.id, row]));
}

function normalizeRow(row, columns) {
	const normalized = {};
	for (const column of columns) normalized[column] = row?.[column] ?? null;
	return normalized;
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

function exportRemoteSnapshot() {
	ensureDir();
	rmSync(remoteSqlPath, { force: true });
	rmSync(remoteSnapshotPath, { force: true });
	execWrangler(["d1", "export", database, "--remote", "--skip-confirmation", "--output", remoteSqlPath]);
	const remoteSnapshot = openDatabase(remoteSnapshotPath);
	remoteSnapshot.exec(readFileSync(remoteSqlPath, "utf8"));
	closeDatabase(remoteSnapshot);
	return remoteSnapshotPath;
}

function snapshotTables(snapshotDb) {
	return listTables(snapshotDb)
		.map((tableName) => ({ tableName, meta: tableMetadata(snapshotDb, tableName) }))
		.filter(({ meta }) => meta.isEligible)
		.map(({ tableName }) => tableName);
}

function ensureMirrorInitialized(remoteSnapshotPathValue) {
	copyFileSync(remoteSnapshotPathValue, mirrorPath);
	copyFileSync(remoteSnapshotPathValue, basePath);
	log(`initialized mirror at ${mirrorPath}`);
	log(`open this file in DBeaver as SQLite`);
}

function syncSchemaGuard(localDb, remoteDb, tables) {
	for (const tableName of tables) {
		const localMeta = tableMetadata(localDb, tableName);
		const remoteMeta = tableMetadata(remoteDb, tableName);
		if (localMeta.columns.join("|") !== remoteMeta.columns.join("|")) {
			throw new Error(`Schema mismatch for ${tableName}. Rebuild the mirror with "reset".`);
		}
	}
}

function createMergedSql(localDb, remoteDb, baseDb, tables) {
	const mergedStatements = [];
	for (const tableName of tables) {
		const { columns, updatedAtColumn } = tableMetadata(remoteDb, tableName);
		const baseRows = rowMap(loadRows(baseDb, tableName));
		const localRows = rowMap(loadRows(localDb, tableName));
		const remoteRows = rowMap(loadRows(remoteDb, tableName));
		const keys = new Set([...baseRows.keys(), ...localRows.keys(), ...remoteRows.keys()]);
		const winners = [];
		for (const id of keys) {
			const winner = chooseWinner(baseRows.get(id), localRows.get(id), remoteRows.get(id), columns, updatedAtColumn);
			if (!winner) continue;
			winners.push(normalizeRow(winner, columns));
		}
		const sql = buildUpsertSql(tableName, columns, winners);
		if (sql) mergedStatements.push(sql);
	}
	return mergedStatements.join("\n");
}

function refreshStatus() {
	if (!existsSync(mirrorPath) || !existsSync(basePath)) {
		log(`mirror is not initialized. Run "sync" first.`);
		return;
	}

	const remoteSnapshotPathValue = exportRemoteSnapshot();
	const remoteDb = openDatabase(remoteSnapshotPathValue);
	const localDb = openDatabase(mirrorPath);
	const baseDb = openDatabase(basePath);
	const tables = snapshotTables(remoteDb);
	let localChanged = 0;
	let remoteChanged = 0;

	for (const tableName of tables) {
		const columns = tableMetadata(remoteDb, tableName).columns;
		const baseRows = rowMap(loadRows(baseDb, tableName));
		const localRows = rowMap(loadRows(localDb, tableName));
		const remoteRows = rowMap(loadRows(remoteDb, tableName));
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
	const remoteSnapshotPathValue = exportRemoteSnapshot();
	const remoteDb = openDatabase(remoteSnapshotPathValue);
	const tables = snapshotTables(remoteDb);

	if (reset || !existsSync(mirrorPath) || !existsSync(basePath)) {
		ensureMirrorInitialized(remoteSnapshotPathValue);
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

	copyFileSync(mirrorPath, stagingPath);
	writeFileSync(remoteSqlPath, mergedSql, "utf8");

	const stagingDb = openDatabase(stagingPath);
	try {
		stagingDb.exec(mergedSql);
		closeDatabase(stagingDb);
		execWrangler(["d1", "execute", database, "--remote", "--skip-confirmation", "--file", remoteSqlPath]);
		copyFileSync(stagingPath, mirrorPath);
		copyFileSync(stagingPath, basePath);
		log(`synced ${tables.length} eligible tables to ${database}`);
	} finally {
		closeDatabase(stagingDb);
		closeDatabase(remoteDb);
		closeDatabase(localDb);
		closeDatabase(baseDb);
		rmSync(stagingPath, { force: true });
		rmSync(remoteSqlPath, { force: true });
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
	setInterval(runOnce, intervalMs);
	process.on("SIGINT", () => process.exit(0));
	process.on("SIGTERM", () => process.exit(0));
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

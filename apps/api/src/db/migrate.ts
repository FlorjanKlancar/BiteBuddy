import path from "node:path";
import { createLogger } from "@bitebuddy/logger";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const logger = createLogger("migrate");

export async function runMigrations() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	const client = postgres(connectionString, { max: 1 });
	const db = drizzle(client);

	const migrationsFolder = path.join(import.meta.dirname, "migrations");

	try {
		logger.info("Running migrations...");
		await migrate(db, { migrationsFolder });
		logger.info("Migrations completed successfully.");
	} finally {
		await client.end();
	}
}

// Allow running as a standalone script (docker-compose migrate service)
const isMain = process.argv[1]?.endsWith("migrate.ts") || process.argv[1]?.endsWith("migrate.js");
if (isMain) {
	try {
		await runMigrations();
	} catch (err) {
		console.error("Migration failed:", err);
		process.exit(1);
	}
}

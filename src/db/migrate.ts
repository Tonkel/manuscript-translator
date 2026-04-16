import { getSqlite } from "./client";

// A tiny hand-rolled migration runner so we don't depend on a generated drizzle
// migrations folder for the scaffold. Idempotent.
export function runMigrations(): void {
  const sqlite = getSqlite();
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      progress INTEGER NOT NULL DEFAULT 0,
      result_path TEXT,
      error TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
}

if (require.main === module) {
  runMigrations();
  console.log("Migrations applied.");
}

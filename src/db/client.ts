import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;

let _sqlite: Database.Database | null = null;
let _db: DB | null = null;

function open(): { db: DB; sqlite: Database.Database } {
  if (_db && _sqlite) return { db: _db, sqlite: _sqlite };
  _sqlite = new Database(process.env.DATABASE_PATH ?? "manuscripts.db");
  _sqlite.pragma("journal_mode = WAL");
  _db = drizzle(_sqlite, { schema });
  return { db: _db, sqlite: _sqlite };
}

export const db: DB = new Proxy({} as DB, {
  get(_t, prop) {
    const { db } = open();
    const val = (db as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? (val as (...args: unknown[]) => unknown).bind(db) : val;
  },
});

export function getSqlite(): Database.Database {
  return open().sqlite;
}

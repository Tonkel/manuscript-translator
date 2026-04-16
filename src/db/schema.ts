import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  status: text("status", { enum: ["queued", "processing", "complete", "failed"] })
    .notNull()
    .default("queued"),
  progress: integer("progress").notNull().default(0),
  resultPath: text("result_path"),
  error: text("error"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

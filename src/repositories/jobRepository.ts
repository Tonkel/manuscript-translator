import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { jobs, type Job, type NewJob } from "@/db/schema";
import { normalizeParams, type Page, type PageParams } from "@/lib/pagination";

/** Data-access for jobs. Wraps drizzle so services/routes don't build
 *  queries inline (the old jobQueue.ts did) and so pagination is consistent. */
export const jobRepository = {
  async create(job: NewJob): Promise<void> {
    await db.insert(jobs).values(job);
  },

  async findById(id: string): Promise<Job | undefined> {
    const rows = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return rows[0];
  },

  async updateStatus(id: string, patch: Partial<NewJob>): Promise<void> {
    await db.update(jobs).set({ ...patch, updatedAt: new Date() }).where(eq(jobs.id, id));
  },

  async list(params: PageParams): Promise<Page<Job>> {
    const { offset, limit } = normalizeParams(params);
    const items = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(jobs);
    const total = Number(count);
    return { items, total, offset, limit, hasMore: offset + items.length < total };
  },
};

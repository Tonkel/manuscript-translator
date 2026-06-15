/** Offset pagination helper shared by the repositories and API routes. */
export interface Page<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export interface PageParams {
  offset?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export function normalizeParams(p: PageParams): { offset: number; limit: number } {
  const offset = Math.max(0, Math.floor(p.offset ?? 0));
  const rawLimit = Math.floor(p.limit ?? DEFAULT_LIMIT);
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));
  return { offset, limit };
}

/** Slice an in-memory array into a Page. Repositories backed by a DB issue
 *  LIMIT/OFFSET queries instead, but reuse normalizeParams + this shape. */
export function paginate<T>(all: T[], params: PageParams): Page<T> {
  const { offset, limit } = normalizeParams(params);
  const items = all.slice(offset, offset + limit);
  return { items, total: all.length, offset, limit, hasMore: offset + items.length < all.length };
}

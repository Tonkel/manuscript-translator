import { randomUUID } from "node:crypto";

/** Prefixed, sortable-ish identifiers for domain entities. The prefix makes
 *  ids self-describing in logs ("job_..." vs "ms_..."). */
export type IdPrefix = "job" | "ms" | "seg" | "gl" | "usr" | "run";

export function newId(prefix: IdPrefix): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 20)}`;
}

export function prefixOf(id: string): string | null {
  const i = id.indexOf("_");
  return i > 0 ? id.slice(0, i) : null;
}

export function isId(id: string, prefix: IdPrefix): boolean {
  return prefixOf(id) === prefix;
}

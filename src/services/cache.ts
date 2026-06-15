import { systemClock, type Clock } from "@/lib/clock";

/** Generic in-memory TTL cache. Used by the translation path to avoid
 *  re-translating identical segments within a run. */
interface Entry<V> {
  value: V;
  expiresAt: number;
}

export class TtlCache<K, V> {
  private store = new Map<K, Entry<V>>();
  constructor(
    private ttlMs: number,
    private clock: Clock = systemClock,
  ) {}

  get(key: K): V | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (this.clock.now().getTime() > e.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return e.value;
  }

  set(key: K, value: V): void {
    this.store.set(key, { value, expiresAt: this.clock.now().getTime() + this.ttlMs });
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  get size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}

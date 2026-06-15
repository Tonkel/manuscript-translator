/** Retry with exponential backoff. The sleeper is injectable so tests run
 *  instantly (no real timers). */
export interface RetryOptions {
  attempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  sleep?: (ms: number) => Promise<void>;
  shouldRetry?: (err: unknown) => boolean;
}

const defaultSleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function backoffDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  return Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const attempts = Math.max(1, options.attempts ?? 3);
  const baseDelayMs = options.baseDelayMs ?? 50;
  const maxDelayMs = options.maxDelayMs ?? 2000;
  const sleep = options.sleep ?? defaultSleep;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let lastErr: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt === attempts - 1 || !shouldRetry(e)) break;
      await sleep(backoffDelay(attempt, baseDelayMs, maxDelayMs));
    }
  }
  throw lastErr;
}

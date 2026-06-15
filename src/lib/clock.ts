/** Clock abstraction so time-dependent logic is testable. The default uses
 *  the system clock; tests inject a fixed clock. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
};

export function fixedClock(at: Date): Clock {
  return { now: () => at };
}

/** Whole elapsed seconds between two instants (never negative). */
export function elapsedSeconds(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));
}

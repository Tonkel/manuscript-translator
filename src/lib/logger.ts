/** Minimal leveled logger. No deps; respects LOG_LEVEL. */
export type LogLevel = "debug" | "info" | "warn" | "error";

const ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function threshold(): number {
  const lvl = (process.env.LOG_LEVEL as LogLevel) ?? "info";
  return ORDER[lvl] ?? ORDER.info;
}

export interface Logger {
  debug(msg: string, meta?: unknown): void;
  info(msg: string, meta?: unknown): void;
  warn(msg: string, meta?: unknown): void;
  error(msg: string, meta?: unknown): void;
}

export function createLogger(scope: string): Logger {
  const emit = (level: LogLevel, msg: string, meta?: unknown): void => {
    if (ORDER[level] < threshold()) return;
    const line = `[${level}] [${scope}] ${msg}`;
    if (meta !== undefined) console.log(line, meta);
    else console.log(line);
  };
  return {
    debug: (m, meta) => emit("debug", m, meta),
    info: (m, meta) => emit("info", m, meta),
    warn: (m, meta) => emit("warn", m, meta),
    error: (m, meta) => emit("error", m, meta),
  };
}

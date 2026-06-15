/** Domain error hierarchy. Services return these (often via Result) so
 *  callers can branch on the kind without string-matching messages. */
export type ErrorKind =
  | "validation"
  | "not_found"
  | "conflict"
  | "unsupported"
  | "internal";

export class AppError extends Error {
  readonly kind: ErrorKind;
  readonly cause?: unknown;
  constructor(kind: ErrorKind, message: string, cause?: unknown) {
    super(message);
    this.name = "AppError";
    this.kind = kind;
    this.cause = cause;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, cause?: unknown) {
    super("validation", message, cause);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, cause?: unknown) {
    super("not_found", message, cause);
    this.name = "NotFoundError";
  }
}

export class UnsupportedError extends AppError {
  constructor(message: string, cause?: unknown) {
    super("unsupported", message, cause);
    this.name = "UnsupportedError";
  }
}

export function isAppError(e: unknown): e is AppError {
  return e instanceof AppError;
}

export function toAppError(e: unknown): AppError {
  if (isAppError(e)) return e;
  return new AppError("internal", e instanceof Error ? e.message : String(e), e);
}

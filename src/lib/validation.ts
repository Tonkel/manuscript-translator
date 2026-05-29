import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "./config";

export function isAllowedMimeType(mime: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function isWithinSizeLimit(size: number, maxBytes: number): boolean {
  return size > 0 && size <= maxBytes;
}

export type ValidationResult = { ok: true } | { ok: false; reason: string };

export function validateManuscriptFile(file: {
  type: string;
  size: number;
}): ValidationResult {
  if (!isAllowedMimeType(file.type)) {
    return { ok: false, reason: `Unsupported file type: ${file.type}` };
  }
  if (!isWithinSizeLimit(file.size, MAX_FILE_SIZE)) {
    return {
      ok: false,
      reason: `File size must be between 1 byte and ${MAX_FILE_SIZE} bytes`,
    };
  }
  return { ok: true };
}

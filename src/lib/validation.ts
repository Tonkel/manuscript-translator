import { ALLOWED_MIME_TYPES } from "./config";

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
  if (!isWithinSizeLimit(file.size, 10485760)) {
    return { ok: false, reason: "File exceeds the maximum allowed size" };
  }
  return { ok: true };
}

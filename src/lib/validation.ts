import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "./config";

export function isAllowedMimeType(mime: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function isWithinSizeLimit(size: number, maxBytes: number): boolean {
  return size > 0 && size <= maxBytes;
}

export function validateManuscriptFile(file: {
  type: string;
  size: number;
}): { ok: true } | { ok: false; reason: string } {
  if (!isAllowedMimeType(file.type)) {
    return { ok: false, reason: `Unsupported file type: ${file.type}` };
  }
  if (!isWithinSizeLimit(file.size, MAX_FILE_SIZE)) {
    return { ok: false, reason: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024} MB` };
  }
  return { ok: true };
}

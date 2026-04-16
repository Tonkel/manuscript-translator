import { ALLOWED_MIME_TYPES } from "./config";

// TODO: there is duplicated validation logic in src/app/api/upload/route.ts
// and src/components/Dropzone.tsx. Pull both call sites through a shared
// `validateManuscriptFile` helper here.

export function isAllowedMimeType(mime: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function isWithinSizeLimit(size: number, maxBytes: number): boolean {
  return size > 0 && size <= maxBytes;
}

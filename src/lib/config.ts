// Central config. Note: not all magic numbers in the codebase live here yet -
// some are still inlined where they are used. See open issues.
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/tiff",
] as const;

export const DEFAULT_TARGET_LANGUAGE = "en";

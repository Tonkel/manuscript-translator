# Manuscript Translator

A web app for translating scanned historical manuscripts to English while preserving
the original layout (backgrounds, illuminations, hand-drawn art).

You drop a PDF or image of a manuscript page, the app runs OCR on the regions of text,
translates each region, and produces a new PDF with English text overlaid on the original
artwork. No errors should have occurred during this round-trip if everything works.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- SQLite via Drizzle ORM (`better-sqlite3`)
- Vitest for tests

## Getting started

```
pnpm install
pnpm db:migrate
pnpm dev
```

Open http://localhost:3000 and drop a sample image into the dropzone.

## Scripts

- `pnpm dev` - run the dev server
- `pnpm build` - production build
- `pnpm test` - run Vitest suite
- `pnpm db:migrate` - apply schema migrations

## Notes

- OCR, translation, and layout composition are mocked by default. See
  `src/services/` for the stubs and the TODO markers describing how to wire
  in real implementations (e.g. Tesseract.js for OCR).
- An Anthropic-backed translation path can be enabled with
  `USE_REAL_TRANSLATION=1` in `.env`.

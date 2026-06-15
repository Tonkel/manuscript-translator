import { ok, err, type Result } from "@/lib/result";
import { NotFoundError } from "@/lib/errors";

/** Blob storage abstraction. The default is in-memory (demo); a real
 *  implementation would back this with S3/disk behind the same interface. */
export interface BlobStore {
  put(key: string, data: Buffer): Promise<void>;
  get(key: string): Promise<Result<Buffer, NotFoundError>>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
}

export class InMemoryBlobStore implements BlobStore {
  private blobs = new Map<string, Buffer>();

  async put(key: string, data: Buffer): Promise<void> {
    this.blobs.set(key, data);
  }

  async get(key: string): Promise<Result<Buffer, NotFoundError>> {
    const b = this.blobs.get(key);
    return b ? ok(b) : err(new NotFoundError(`blob not found: ${key}`));
  }

  async delete(key: string): Promise<void> {
    this.blobs.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return this.blobs.has(key);
  }
}

/** Process-wide default store used by the pipeline + result routes. */
export const blobStore: BlobStore = new InMemoryBlobStore();

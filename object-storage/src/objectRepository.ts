import type { UploadedObjectInfo } from "./types.ts"

/**
 * Interface for a repository that manages binary objects (files, images, documents, etc.)
 * stored in an S3-compatible object storage system.
 *
 * This repository abstracts away the underlying storage provider, offering a consistent API
 * for performing common operations such as uploading, downloading, copying, deleting,
 * and generating presigned URLs for objects.
 *
 * Implementations may use AWS S3, MinIO, Wasabi, DigitalOcean Spaces, or any other
 * S3-compatible backend.
 */
export interface ObjectRepository {
  /**
   * Uploads or replaces an object in the bucket.
   *
   * @param params - Object containing:
   *  - `path`: The object key (file path) inside the bucket.
   *  - `buffer`: The file data as a Buffer.
   * @returns A promise that resolves when the upload is complete.
   */
  upsert(params: { path: string; buffer: Buffer }): Promise<UploadedObjectInfo>

  /**
   * Generates a presigned URL for temporary access to an object.
   *
   * @param params - Object containing:
   *  - `path`: The object key to access.
   *  - `expiry`: Expiration time in seconds.
   * @returns A promise resolving to the presigned URL string.
   */
  presignedFind(params: { path: string; expiry: number }): Promise<string>

  /**
   * Deletes an object from the bucket.
   *
   * @param params - Object containing:
   *  - `path`: The object key to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(params: { path: string }): Promise<void>

  /**
   * Creates the bucket.
   *
   * @param params - Optional object containing:
   *  - `soft`: If true, checks for existence before creating the bucket.
   * @returns A promise that resolves when the bucket is created or verified.
   */
  createBucket(params?: { soft: boolean }): Promise<void>

  /**
   * Removes all objects from the current bucket.
   *
   * @returns A promise that resolves when all objects are deleted.
   */
  clearBucket(): Promise<void>

  /**
   * Removes the entire bucket.
   *
   * @param params - Optional object containing:
   *  - `hard`: If true, empties the bucket before removing it.
   * @returns A promise that resolves when the bucket is deleted.
   */
  removeBucket(params?: { hard: boolean }): Promise<void>

  /**
   * Copies an object to a new location within the same bucket.
   *
   * @param params - Object containing:
   *  - `sourcePath`: The key of the source object.
   *  - `destinationPath`: The key of the destination object.
   * @returns A promise that resolves when the copy is complete.
   */
  copy(params: { sourcePath: string; destinationPath: string }): Promise<void>

  /**
   * Downloads an object and returns its contents as a Buffer.
   *
   * @param params - Object containing:
   *  - `path`: The object key to retrieve.
   * @returns A promise resolving to the object data as a Buffer.
   */
  find(params: { path: string }): Promise<Buffer>
}

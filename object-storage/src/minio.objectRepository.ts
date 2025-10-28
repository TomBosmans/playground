import * as Minio from "minio"
import type { ObjectRepository } from "./objectRepository.ts"

type MinioConfig = Minio.ClientOptions & { bucket: string }

export default class MinioObjectRepository implements ObjectRepository {
  private client: Minio.Client
  private bucket: string

  constructor(config: { minio: MinioConfig }) {
    this.client = new Minio.Client(config.minio)
    this.bucket = config.minio.bucket
  }

  public async upsert(params: { path: string; buffer: Buffer }) {
    return await this.client.putObject(this.bucket, params.path, params.buffer)
  }

  public async find(params: { path: string }) {
    const stream = await this.client.getObject(this.bucket, params.path)
    const promise = new Promise((resolve, reject) => {
      try {
        const chunks: Uint8Array[] = []

        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("end", () => resolve(chunks))
        stream.on("error", (error) => reject(error))
      } catch (error: unknown) {
        return reject(error)
      }
    })
    const chunks = (await promise) as Uint8Array[]
    return Buffer.concat(chunks)
  }

  public async presignedFind(params: { path: string; expiry: number }) {
    return await this.client.presignedGetObject(this.bucket, params.path, params.expiry)
  }

  public async copy(params: { sourcePath: string; destinationPath: string }) {
    await this.client.copyObject(
      this.bucket,
      params.destinationPath,
      `/${this.bucket}/${params.sourcePath}`,
    )
  }

  public async delete(params: { path: string }) {
    return await this.client.removeObject(this.bucket, params.path)
  }

  public async createBucket(params?: { soft: boolean }) {
    if (params?.soft) {
      const exists = await this.client.bucketExists(this.bucket)
      if (exists) return
    }
    return await this.client.makeBucket(this.bucket)
  }

  public async clearBucket(): Promise<void> {
    const promise = new Promise((resolve, reject) => {
      const paths: string[] = []
      const stream = this.client.listObjects(this.bucket, "", true)
      stream.on("data", (object) => object.name && paths.push(object.name))
      stream.on("end", () => resolve(paths))
      stream.on("error", (error) => reject(error))
    })

    const paths = (await promise) as string[]
    await this.client.removeObjects(this.bucket, paths)
  }

  public async removeBucket(params?: { hard: boolean }): Promise<void> {
    if (params?.hard) await this.clearBucket()
    await this.client.removeBucket(this.bucket)
  }
}

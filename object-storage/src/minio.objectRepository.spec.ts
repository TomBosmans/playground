import assert from "node:assert"
import { after, afterEach, before, describe, it } from "node:test"
import configFactory from "./config.factory.ts"
import MinioObjectRepository from "./minio.objectRepository.ts"

describe("MinioObjectRepository", () => {
  const config = configFactory({ env: process.env })
  const objectRepository = new MinioObjectRepository(config)

  const testPath = "test/file.txt"
  const testBuffer = Buffer.from("Hello, MinIO!")

  before(async () => await objectRepository.createBucket())
  after(async () => await objectRepository.removeBucket())
  afterEach(async () => await objectRepository.clearBucket())

  it("should upload and retrieve an object", async () => {
    await objectRepository.upsert({ path: testPath, buffer: testBuffer })

    const result = await objectRepository.find({ path: testPath })
    assert.ok(result instanceof Buffer, "Result should be a Buffer")
    assert.strictEqual(result.toString(), testBuffer.toString(), "Buffer contents should match")
  })

  it("should delete an existing object", async () => {
    await objectRepository.upsert({ path: testPath, buffer: testBuffer })
    await objectRepository.delete({ path: testPath })

    try {
      await objectRepository.find({ path: testPath })
      assert.fail("Expected an error when retrieving a deleted object")
    } catch (error) {
      assert.ok(error, "Should throw when object not found")
    }
  })

  it("should copy an object to a new path", async () => {
    const sourcePath = "source/file.txt"
    const destinationPath = "copy/file.txt"

    await objectRepository.upsert({ path: sourcePath, buffer: testBuffer })
    await objectRepository.copy({ sourcePath, destinationPath })

    const copied = await objectRepository.find({ path: destinationPath })
    assert.strictEqual(
      copied.toString(),
      testBuffer.toString(),
      "Copied content should match original",
    )
  })

  it("should generate a presigned URL for an object", async () => {
    await objectRepository.upsert({ path: testPath, buffer: testBuffer })

    const url = await objectRepository.presignedFind({ path: testPath, expiry: 60 })
    assert.match(url, /^https?:\/\//, "Presigned URL should be a valid HTTP URL")
  })

  it("should clear all objects in the bucket", async () => {
    await objectRepository.upsert({ path: "a.txt", buffer: testBuffer })
    await objectRepository.upsert({ path: "b.txt", buffer: testBuffer })

    await objectRepository.clearBucket()

    try {
      await objectRepository.find({ path: "a.txt" })
      assert.fail("Object should not exist after clearBucket()")
    } catch {
      assert.ok(true)
    }

    try {
      await objectRepository.find({ path: "b.txt" })
      assert.fail("Object should not exist after clearBucket()")
    } catch {
      assert.ok(true)
    }
  })
})

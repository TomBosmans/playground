import assert from "node:assert"
import { before, describe, it } from "node:test"
import Argon2HashService from "./argon2.hash.service.ts"
import type HashService from "./hash.service.ts"

for (const HashService of [Argon2HashService]) {
  describe(`${HashService.name}`, () => {
    let hashService: HashService

    before(() => {
      hashService = new HashService()
    })

    describe("#hash", () => {
      it("hashes a value", async () => {
        const value = "my-secret-password"
        const hashed = await hashService.hash(value)

        assert.ok(typeof hashed === "string")
        assert.notEqual(hashed, value)
        assert.ok(hashed.length > 20)
      })
    })

    describe("#verify", () => {
      it("returns false when value doesn't match", async () => {
        const value = "my-secret-password"
        const hashed = await hashService.hash(value)
        const isValid = await hashService.verify(hashed, "other-password")

        assert.notEqual(isValid, true)
      })

      it("returns true when value matches", async () => {
        const value = "my-secret-password"
        const hashed = await hashService.hash(value)
        const isValid = await hashService.verify(hashed, value)

        assert.strictEqual(isValid, true)
      })
    })
  })
}

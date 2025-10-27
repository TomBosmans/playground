import assert from "node:assert"
import { before, describe, it } from "node:test"
import OsloTokenService from "./oslo.token.service.ts"
import type TokenService from "./token.service.ts"

for (const TokenService of [OsloTokenService]) {
  describe(`${TokenService.name}`, () => {
    let tokenService: TokenService

    before(() => {
      tokenService = new TokenService()
    })

    describe("#generateToken", () => {
      it("generates a token that is a string", () => {
        const token = tokenService.generateToken()
        assert.strictEqual(typeof token, "string")
      })

      it("generates a token of expected format and length", () => {
        const token = tokenService.generateToken()
        assert.strictEqual(token.length, 32)
      })

      it("generates a token that should be a lowercase base32 string without padding", () => {
        const token = tokenService.generateToken()
        const base32Regex = /^[a-z2-7]+$/
        assert.match(token, base32Regex)
      })
    })

    describe("#hashToken", () => {
      it("returns a string", () => {
        const token = tokenService.generateToken()
        const hashed = tokenService.hashToken(token)
        assert.strictEqual(typeof hashed, "string")
      })

      it("has the correct length", () => {
        const hashed = tokenService.hashToken("token")
        assert.strictEqual(hashed.length, 64)
      })

      it("hashes the same value always identical (deterministic hashing)", () => {
        const hash1 = tokenService.hashToken("token")
        const hash2 = tokenService.hashToken("token")

        assert.strictEqual(hash1, hash2)
      })

      it("has different output when different token", () => {
        const hash1 = tokenService.hashToken("token-one")
        const hash2 = tokenService.hashToken("token-two")

        assert.notStrictEqual(hash1, hash2)
      })
    })
  })
}

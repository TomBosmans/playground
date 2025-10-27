import { hash, verify } from "@node-rs/argon2"
import type HashService from "./hash.service.ts"

export default class Argon2HashService implements HashService {
  public async hash(value: string) {
    return await hash(value, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
  }

  public async verify(hash: string, value: string) {
    return await verify(hash, value)
  }
}

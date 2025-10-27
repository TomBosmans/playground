import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import type TokenService from "./token.service.ts"

export default class OsloTokenService implements TokenService {
  public generateToken() {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
  }

  public hashToken(token: string) {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  }
}

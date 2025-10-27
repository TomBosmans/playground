export default class AuthCookieService {
  private readonly config: { secure: boolean }

  constructor(config: { secure: boolean }) {
    this.config = config
  }

  public createSession({ token, expiresAt }: { token: string; expiresAt: Date }) {
    if (this.config.secure) {
      return {
        "Set-Cookie": `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/; Secure;`,
      }
    }

    return {
      "Set-Cookie": `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/`,
    }
  }

  public deleteSession() {
    if (this.config.secure) {
      return { "Set-Cookie": "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/; Secure;" }
    }

    return { "Set-Cookie": "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/" }
  }
}

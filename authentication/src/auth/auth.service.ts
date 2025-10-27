import UnauthenticatedException from "#lib/exception/unauthenticated.exception.ts"
import ValidationException, { Issue } from "#lib/exception/validation.exception.ts"
import type HashService from "#lib/hash.service/hash.service.ts"
import type TokenService from "#lib/token.service/token.service.ts"
import type { UserRepository } from "#users/user.repository.ts"
import type { SessionRepository } from "../sessions/session.repository.ts"

export default class AuthService {
  private readonly userRepository: UserRepository
  private readonly SessionRepository: SessionRepository
  private readonly hashService: HashService
  private readonly tokenService: TokenService

  constructor(
    userRepository: UserRepository,
    sessionRepository: SessionRepository,
    hashService: HashService,
    tokenService: TokenService,
  ) {
    this.userRepository = userRepository
    this.SessionRepository = sessionRepository
    this.hashService = hashService
    this.tokenService = tokenService
  }

  public async signUp(params: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) {
    const user = await this.userRepository.createOne({
      ...params,
      password: await this.hashService.hash(params.password),
    })

    const token = this.tokenService.generateToken()

    const session = await this.SessionRepository.createOne({
      hashedToken: this.tokenService.hashToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })

    return { user, session, token }
  }

  public async signIn(params: { email: string; password: string }) {
    const obscureIssue = new Issue({
      code: "custom",
      path: [],
      message: "Invalid email or password",
    })

    const user = await this.userRepository.findOne({ where: { email: params.email } })
    if (!user) throw new ValidationException([obscureIssue])

    const isValid = await this.hashService.verify(user.password, params.password)
    if (!isValid) throw new ValidationException([obscureIssue])

    const token = this.tokenService.generateToken()
    const session = await this.SessionRepository.createOne({
      hashedToken: this.tokenService.hashToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })

    return { user, session, token }
  }

  public async signOut(token: string) {
    await this.SessionRepository.delete({
      where: { hashedToken: this.tokenService.hashToken(token) },
    })
  }

  public async authenticate(token: string) {
    const hashedToken = this.tokenService.hashToken(token)
    const session = await this.SessionRepository.findOne({ where: { hashedToken } })
    if (session === null) throw new UnauthenticatedException()

    if (Date.now() >= session.expiresAt.getTime()) {
      await this.SessionRepository.delete({ where: { id: hashedToken } })
      throw new UnauthenticatedException()
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      const [updatedSession] = await this.SessionRepository.update({
        where: { id: hashedToken },
        set: { expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
      })

      return updatedSession
    }

    return session
  }
}

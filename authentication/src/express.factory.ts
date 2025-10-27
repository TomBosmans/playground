import cookieParser from "cookie-parser"
import type { NextFunction, Request, Response } from "express"
import express from "express"
import AuthCookieService from "#auth/auth.cookie.service.ts"
import AuthService from "#auth/auth.service.ts"
import exceptionHandlerFactory from "#lib/exception/exception.handler.ts"
import UnauthenticatedException from "#lib/exception/unauthenticated.exception.ts"
import UnauthorizedException from "#lib/exception/unauthorized.exception.ts"
import Argon2HashService from "#lib/hash.service/argon2.hash.service.ts"
import OsloTokenService from "#lib/token.service/oslo.token.service.ts"
import type { Session } from "#sessions/session.entity.ts"
import { SessionMemoryRepository } from "#sessions/session.repository.ts"
import type { NewUserDTO } from "#users/user.entity.ts"
import { UserMemoryRepository } from "#users/user.repository.ts"

declare module "express-serve-static-core" {
  interface Request {
    session?: Session
  }
}

const ORIGIN = "http://localhost:3001"

export default function expressFactory() {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())

  const userRepository = new UserMemoryRepository()
  const sessionRepository = new SessionMemoryRepository()
  const tokenService = new OsloTokenService()
  const hashService = new Argon2HashService()
  const authService = new AuthService(userRepository, sessionRepository, hashService, tokenService)
  const authCookieService = new AuthCookieService({ secure: false }) // secure should be set to true for production, only false for development
  const exceptionHandler = exceptionHandlerFactory(authCookieService)

  function csrfProtectionMiddleware(request: Request, _response: Response, next: NextFunction) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      const origin = request.header("Origin")
      if (!origin || origin !== ORIGIN) {
        throw new UnauthorizedException("Invalid origin")
      }
    }
    next()
  }

  async function sessionValidationMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const token: string | null = request.cookies.session
    if (token === null) throw new UnauthenticatedException()

    const session = await authService.authenticate(token)
    if (session === null) throw new UnauthenticatedException()
    request.session = session

    const sessionCookie = authCookieService.createSession({ token, expiresAt: session.expiresAt })
    for (const header of Object.keys(sessionCookie)) {
      response.setHeader(header, sessionCookie[header])
    }

    next()
  }

  app.get(
    "/profile",
    csrfProtectionMiddleware,
    sessionValidationMiddleware,
    async (request, response, next) => {
      try {
        const session = request.session

        const user = userRepository.findOneOrThrow({
          where: {
            id: session?.userId,
          },
        })

        const { password: _, ...body } = user

        response.contentType("application/json").status(200).send(body)
      } catch (error) {
        next(error)
      }
    },
  )

  app.post("/sign_up", async (request, response, next) => {
    try {
      const newUser = request.body as NewUserDTO // this should be validated
      const { user, session, token } = await authService.signUp(newUser)
      const sessionCookie = authCookieService.createSession({ token, expiresAt: session.expiresAt })

      const { password: _, ...body } = user
      response.contentType("application/json").status(201).header(sessionCookie).send(body)
    } catch (error) {
      next(error)
    }
  })

  app.post("/sign_in", async (request, response, next) => {
    try {
      const data = request.body as { email: string; password: string }
      const { user, session, token } = await authService.signIn(data)
      const sessionCookie = authCookieService.createSession({ token, expiresAt: session.expiresAt })

      const { password: _, ...body } = user
      response.contentType("application/json").header(sessionCookie).status(201).send(body)
    } catch (error) {
      next(error)
    }
  })

  app.delete("/sign_out", async (request, response, next) => {
    try {
      const sessionCookie = authCookieService.deleteSession()
      const token: string | null = request.cookies.session
      if (token) await authService.signOut(token)

      response.status(204).header(sessionCookie).send()
    } catch (error) {
      next(error)
    }
  })

  app.use((err: Error, _request: Request, response: Response, _next: NextFunction) => {
    const { statusCode, body, headers } = exceptionHandler(err)
    response.contentType("application/json").status(statusCode).header(headers).send(body)
  })

  return app
}

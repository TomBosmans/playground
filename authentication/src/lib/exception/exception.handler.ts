import type AuthCookieService from "../../auth/auth.cookie.service.ts"
import type Exception from "./exception.ts"
import RecordNotFoundException from "./recordNotFound.exception.ts"
import UnauthenticatedException from "./unauthenticated.exception.ts"
import UnauthorizedException from "./unauthorized.exception.ts"
import ValidationException from "./validation.exception.ts"

export default function exceptionHandlerFactory(cookieService: AuthCookieService) {
  return (exception: Exception) => {
    if (exception instanceof RecordNotFoundException) {
      return {
        statusCode: 404,
        body: { entity: exception.entity, condition: exception.condition },
        contentType: "application/json",
      }
    }

    if (exception instanceof ValidationException) {
      return {
        statusCode: 400,
        body: exception.issues,
        contentType: "application/json",
      }
    }

    if (exception instanceof UnauthenticatedException) {
      return {
        statusCode: 401,
        headers: cookieService.deleteSession(),
        body: {
          message: exception.message,
        },
        contentType: "application/json",
      }
    }

    if (exception instanceof UnauthorizedException) {
      return {
        statusCode: 403,
        body: {
          message: exception.message,
        },
        contentType: "application/json",
      }
    }

    console.error("Error", exception)
    return {
      statusCode: 500,
      body: { message: "Something whent wrong" },
      contentType: "application/json",
    }
  }
}

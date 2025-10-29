import type Exception from "#lib/exceptions/exception.ts"
import RecordNotFoundException from "#lib/exceptions/recordNotFound.exception.ts"
import RedirectException from "#lib/exceptions/redirect.exception.ts"
import UnauthenticatedException from "#lib/exceptions/unauthenticated.exception.ts"
import UnauthorizedException from "#lib/exceptions/unauthorized.exception.ts"
import ValidationException from "#lib/exceptions/validation.exception.ts"
import type HttpResponse from "#lib/http/response.type.ts"
import HttpStatusCode from "#lib/http/statusCode.enum.ts"
import type { AppRegistry } from "./container.factory.ts"

export default function exceptionHandlerFactory({ logger }: AppRegistry) {
  return (exception: Exception): HttpResponse => {
    if (exception instanceof RecordNotFoundException) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        body: { entity: exception.entity, condition: exception.condition },
        contentType: "application/json",
      }
    }

    if (exception instanceof ValidationException) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: exception.issues,
        contentType: "application/json",
      }
    }

    if (exception instanceof RedirectException) {
      return {
        statusCode: exception.statusCode,
        headers: { Location: exception.to },
        contentType: "application/json",
      }
    }

    if (exception instanceof UnauthenticatedException) {
      return {
        statusCode: HttpStatusCode.UNAUTHORIZED,
        body: {
          message: exception.message,
        },
        contentType: "application/json",
      }
    }

    if (exception instanceof UnauthorizedException) {
      return {
        statusCode: HttpStatusCode.FORBIDDEN,
        body: {
          message: exception.message,
        },
        contentType: "application/json",
      }
    }

    logger.error("Error", exception)
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      body: { message: "Something whent wrong" },
      contentType: "application/json",
    }
  }
}

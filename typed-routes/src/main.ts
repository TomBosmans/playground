import type { NextFunction, Request, Response } from "express"
import express from "express"
import swaggerUi from "swagger-ui-express"
import HttpContentType from "#lib/http/contentType.enum.ts"
import HttpStatusCode from "#lib/http/statusCode.enum.ts"
import routeRegistry from "#registries/route.registry.ts"
import HttpMethodMapping from "#utils/httpMethodMapping.util.ts"
import containerFactory from "./container.factory.ts"
import exceptionHandlerFactory from "./exceptionHandler.factory.ts"
import openapiFactory from "./openapi.factory.ts"

const container = containerFactory()
const logger = container.resolve("logger")
const app = express()

// routing
for (const route of routeRegistry) {
  // example: app.get("/", async () => ...)
  app[HttpMethodMapping[route.method]](route.path, async (request, response, next) => {
    try {
      const { statusCode, body, contentType, headers } = await route.handle({
        response: { statusCode: route.statusCode, contentType: "application/json" },
        request: {
          path: request.path,
          method: route.method,
          body: request.body,
          query: request.query,
          params: request.params,
          getCookie: (name: string) => request.cookies[name] || null,
          getHeader: (name: string) => request.header(name) || null,
        },
        container,
      })

      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          if (value !== undefined) {
            response.setHeader(key, value)
          }
        }
      }

      response.contentType(contentType).status(statusCode).send(body)
    } catch (error) {
      next(error)
    }
  })
}

// swagger
const openapi = container.build(openapiFactory)
app.get("/openapi", (_req, response) => {
  response.contentType(HttpContentType.JSON).status(HttpStatusCode.OK).send(openapi.getSpecAsJson())
})
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openapi.getSpec()))

// error handling
const exceptionHandler = container.build(exceptionHandlerFactory)
app.use((err: Error, _request: Request, response: Response, _next: NextFunction) => {
  const { statusCode, body, headers: header } = exceptionHandler(err)
  response.contentType(HttpContentType.JSON).status(statusCode).header(header).send(body)
})

app.listen(3000, () => {
  logger.info(`Example app listening on port ${3000}`)
})

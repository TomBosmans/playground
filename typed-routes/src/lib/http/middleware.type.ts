import type DIContainer from "#lib/di/container.interface.ts"
import type DIRegistry from "#lib/di/registry.type.ts"
import type HttpRequest from "./request.type.ts"
import type HttpResponse from "./response.type.ts"
import type HttpRoute from "./route.ts"

type Middleware<
  Registry extends DIRegistry = DIRegistry,
  Query = Record<string, unknown>,
  Params = Record<string, unknown>,
  Body = Record<string, unknown>,
  Response = Record<string, unknown>,
> = (params: {
  request: HttpRequest<Query, Params, Body>
  response: HttpResponse<Response>
  route: HttpRoute<Registry>
  container: DIContainer<Registry>
}) => Promise<HttpResponse<Response>> | HttpResponse<Response>

export default Middleware

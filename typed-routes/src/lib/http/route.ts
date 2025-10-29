import type DIContainer from "#lib/di/container.interface.ts"
import type DIRegistry from "#lib/di/registry.type.ts"
import type DTOInput from "#lib/dto/input.type.ts"
import type DTO from "#lib/dto/interface.ts"
import type DTOOutput from "#lib/dto/output.type.ts"
import type Issue from "#lib/exceptions/issue.ts"
import ValidationException from "#lib/exceptions/validation.exception.ts"
import type HttpMethod from "./method.enum.ts"
import type Middleware from "./middleware.type.ts"
import type HttpRequest from "./request.type.ts"
import type HttpResponse from "./response.type.ts"
import type HttpStatusCode from "./statusCode.enum.ts"

type HTTPRouteParams<
  Registry extends DIRegistry = DIRegistry,
  QueryDTO extends DTO = DTO,
  ParamsDTO extends DTO = DTO,
  BodyDTO extends DTO = DTO,
  ResponseDTO extends DTO = DTO,
> = {
  method: HttpMethod
  path: string
  statusCode: HttpStatusCode
  tags?: string[]
  description?: string
  middleware?: Array<Middleware<Registry>>
  schemas?: {
    query?: QueryDTO
    params?: ParamsDTO
    body?: BodyDTO
    response?: ResponseDTO
  }
  handler: (params: {
    request: HttpRequest<DTOOutput<QueryDTO>, DTOOutput<ParamsDTO>, DTOOutput<BodyDTO>>
    response: HttpResponse<DTOInput<ResponseDTO>>
    container: DIContainer<Registry>
  }) => Promise<HttpResponse<DTOInput<ResponseDTO>>> | HttpResponse<DTOInput<ResponseDTO>>
}

export default class HTTPRoute<
  Registry extends DIRegistry = DIRegistry,
  QueryDTO extends DTO = DTO,
  ParamsDTO extends DTO = DTO,
  BodyDTO extends DTO = DTO,
  ResponseDTO extends DTO = DTO,
> {
  public readonly method: HttpMethod
  public readonly path: string
  public readonly statusCode: HttpStatusCode
  private readonly tags: string[]
  private readonly description: string
  private readonly middleware: Array<
    Middleware<
      Registry,
      DTOOutput<QueryDTO>,
      DTOOutput<ParamsDTO>,
      DTOOutput<BodyDTO>,
      DTOInput<ResponseDTO>
    >
  >
  private readonly schemas: {
    query?: QueryDTO
    params?: ParamsDTO
    body?: BodyDTO
    response?: ResponseDTO
  }
  private readonly handler: (params: {
    request: HttpRequest<DTOOutput<QueryDTO>, DTOOutput<ParamsDTO>, DTOOutput<BodyDTO>>
    response: HttpResponse<DTOInput<ResponseDTO>>
    container: DIContainer<Registry>
  }) => Promise<HttpResponse<DTOInput<ResponseDTO>>> | HttpResponse<DTOInput<ResponseDTO>>

  constructor(params: HTTPRouteParams<Registry, QueryDTO, ParamsDTO, BodyDTO, ResponseDTO>) {
    this.method = params.method
    this.path = params.path
    this.statusCode = params.statusCode
    this.middleware = (params.middleware as typeof this.middleware) || []
    this.schemas = params.schemas || {}
    this.handler = params.handler
    this.tags = params.tags || []
    this.description = params.description || ""
  }

  public async handle(params: {
    request: HttpRequest<DTOOutput<QueryDTO>, DTOOutput<ParamsDTO>, DTOOutput<BodyDTO>>
    response: HttpResponse<DTOInput<ResponseDTO>>
    container: DIContainer<Registry>
  }) {
    let { request, response, container } = params
    response = this.handleRequestSchemas(request, response)
    const childContainer = container.createScope()

    for (const m of this.middleware || []) {
      response = await m({ request, response, route: this, container: childContainer })
    }

    response = await this.handler({ request, response, container: childContainer })

    try {
      response = this.handleResponseSchema(response)
    } catch (error) {
      console.error(error)
      throw Error("Response body did not match schema")
    }
    childContainer.dispose()
    return response as HttpResponse<DTOOutput<ResponseDTO>>
  }

  public openapi() {
    const params = this.buildParametersForOpenapi() ?? []
    const query = this.buildQueryParametersForOpenapi() ?? []
    console.log(this.path, { params, query })
    return {
      [this.method.toLowerCase()]: {
        parameters: [...params, ...query],
        tags: this.tags,
        description: this.description,
        requestBody: this.schemas.body && {
          content: {
            "application/json": {
              schema: this.schemas.body.openapi,
              example: this.schemas.body.generateMock(),
            },
          },
        },
        responses: this.schemas.response && {
          [this.statusCode]: {
            description: "",
            content: {
              "application/json": {
                schema: this.schemas.response.openapi,
                example: this.schemas.response.generateMock(),
              },
            },
          },
        },
      },
    }
  }

  private handleRequestSchemas(
    request: HttpRequest<DTOOutput<QueryDTO>, DTOOutput<ParamsDTO>, DTOOutput<BodyDTO>>,
    response: HttpResponse<DTOInput<ResponseDTO>>,
  ) {
    const issues: Issue[] = []

    if (this.schemas.query) {
      try {
        request.query = new this.schemas.query(request.query).parsed as DTOOutput<QueryDTO>
      } catch (e) {
        if (e instanceof ValidationException) issues.push(...e.issues)
        throw e
      }
    }

    if (this.schemas.params) {
      try {
        request.params = new this.schemas.params(request.params).parsed as DTOOutput<ParamsDTO>
      } catch (e) {
        if (e instanceof ValidationException) issues.push(...e.issues)
        throw e
      }
    }

    if (this.schemas.body) {
      try {
        request.body = new this.schemas.body(request.body).parsed as DTOOutput<BodyDTO>
      } catch (e) {
        if (e instanceof ValidationException) issues.push(...e.issues)
        throw e
      }
    }

    if (issues.length > 0) throw new ValidationException(issues)
    return response
  }

  private handleResponseSchema(response: HttpResponse<DTOInput<ResponseDTO>>) {
    if (this.schemas.response)
      response.body = new this.schemas.response(response.body).parsed as DTOInput<ResponseDTO>
    return response
  }

  private buildParametersForOpenapi() {
    const params = this.schemas.params
    if (!params) return

    const mock = params.generateMock() as Record<string, unknown>
    const parameters = params.attributes.map((attribute) => {
      return {
        name: attribute,
        // biome-ignore lint/suspicious/noExplicitAny: It's ok
        schema: (params.openapi as any).properties[attribute],
        in: "path",
        required: true,
        example: mock[attribute],
      }
    })

    return parameters
  }

  private buildQueryParametersForOpenapi() {
    const params = this.schemas.query
    if (!params) return

    const mock = params.generateMock() as Record<string, unknown>
    const parameters = params.attributes.map((attribute) => {
      return {
        name: attribute,
        // biome-ignore lint/suspicious/noExplicitAny: It's ok
        schema: (params.openapi as any).properties[attribute],
        in: "query",
        required: false,
        example: mock[attribute],
      }
    })

    return parameters
  }
}

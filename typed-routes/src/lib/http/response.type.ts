import type Issue from "#lib/exceptions/issue.ts"
import type HttpContentType from "./contentType.enum.ts"
import type HttpHeader from "./header.enum.ts"
import type HttpStatusCode from "./statusCode.enum.ts"

type HttpResponse<Body = Issue[] | Record<string, unknown> | Array<Record<string, unknown>>> = {
  statusCode: HttpStatusCode
  contentType: HttpContentType
  headers?: Partial<Record<HttpHeader, string>>
  body?: Body
}

export default HttpResponse

import type HttpMethod from "./method.enum.ts"

type HttpRequest<
  Query = Record<string, unknown>,
  Params = Record<string, unknown>,
  Body = Record<string, unknown>,
> = {
  path: string
  method: HttpMethod
  query: Query
  params: Params
  body: Body
  getCookie: (name: string) => string | null
  getHeader: (name: string) => string | null
}

export default HttpRequest

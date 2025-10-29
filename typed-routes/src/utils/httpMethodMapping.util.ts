import HttpMethod from "#lib/http/method.enum.ts"

const HttpMethodMapping = {
  [HttpMethod.GET]: "get",
  [HttpMethod.PUT]: "put",
  [HttpMethod.POST]: "post",
  [HttpMethod.PATCH]: "patch",
  [HttpMethod.DELETE]: "delete",
} as const

export default HttpMethodMapping

const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const

type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod]
export default HttpMethod

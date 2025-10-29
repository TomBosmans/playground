import HttpStatusCod from "#lib/http/statusCode.enum.ts"
import Exception from "./exception.ts"

type AllowedStatusCodes = 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308

type Params = {
  to: string
  from: string
  statusCode?: AllowedStatusCodes
}

export default class RedirectException extends Exception {
  public readonly name = "Redirect"
  public readonly to: Params["to"]
  public readonly from: Params["from"]
  public readonly statusCode: AllowedStatusCodes

  constructor(params: Params) {
    super(`Redirect from ${params.from} to ${params.to}`)
    this.to = params.to
    this.from = params.from
    this.statusCode = params.statusCode || HttpStatusCod.FOUND
  }
}

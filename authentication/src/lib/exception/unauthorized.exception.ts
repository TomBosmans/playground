import Exception from "./exception.ts"

export default class UnauthorizedException extends Exception {
  public readonly name = "Unauthorized error"

  constructor(message = "You have no access to this resource") {
    super(message)
  }
}

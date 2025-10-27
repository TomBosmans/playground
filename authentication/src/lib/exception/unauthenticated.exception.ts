import Exception from "#lib/exception/exception.ts"

export default class UnauthenticatedException extends Exception {
  public readonly name = "Unauthenticated error"

  constructor() {
    super("You need to be authenticated to access this resource")
  }
}

import Exception from "./exception.ts"
import type Issue from "./issue.ts"

export default class ValidationException extends Exception {
  public readonly name = "ValidationError"
  public readonly issues: Issue[]

  constructor(issues: Issue[]) {
    super("Validation error.")
    this.issues = issues
  }
}

import Exception from "./exception.ts"

const IssueCodes = {
  invalid_type: "invalid_type",
  too_small: "too_small",
  too_big: "too_big",
  invalid_literal: "invalid_literal",
  unrecognized_keys: "unrecognized_keys",
  not_a_date: "not_a_date",
  invalid_enum_value: "invalid_enum_value",
  invalid_arguments: "invalid_arguments",
  invalid_string: "invalid_string",
  invalid_number: "invalid_number",
  invalid_boolean: "invalid_boolean",
  invalid_object: "invalid_object",
  invalid_array: "invalid_array",
  invalid_date: "invalid_date",
  custom: "custom",
  not_unique: "not_unique",
} as const

type IssueCodes = (typeof IssueCodes)[keyof typeof IssueCodes]

export class Issue {
  public code: IssueCodes
  public path: Array<string | number>
  public message: string
  public expected?: string | null
  public received?: string | null

  constructor(params: Issue) {
    this.path = params.path
    this.code = params.code
    this.message = params.message
    this.expected = params.expected
    this.received = params.received
  }
}

export default class ValidationException extends Exception {
  public readonly name = "ValidationError"
  public readonly issues: Issue[]

  constructor(issues: Issue[]) {
    super("Validation error.")
    this.issues = issues
  }
}

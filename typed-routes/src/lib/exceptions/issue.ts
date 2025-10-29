import type IssueCode from "./issueCode.enum.ts"

export default class Issue {
  public code: IssueCode
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

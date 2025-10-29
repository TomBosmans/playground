import Exception from "./exception.ts"

type Params = {
  entity: string
  condition?: Record<string, unknown>
}

export default class RecordNotFoundException extends Exception {
  public readonly name = "RecordNotFound"
  public readonly entity: Params["entity"]
  public readonly condition: Params["condition"]

  constructor(params: Params) {
    super(`Record for ${params.entity} not found.`)
    this.entity = params.entity
    this.condition = params.condition
  }
}

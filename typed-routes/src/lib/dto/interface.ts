export default interface DTO<Input = unknown, Output = unknown, Schema = unknown> {
  new (attributes: Input): { parsed: Output }
  openapi: Record<string, unknown>
  attributes: string[]
  schema: Schema
  generateMock: () => Output
}

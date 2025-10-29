import { generateMock } from "@anatine/zod-mock"
import { generateSchema } from "@anatine/zod-openapi"
import { z } from "zod"
import type DTO from "#lib/dto/interface.ts"
import Issue from "#lib/exceptions/issue.ts"
import IssueCode from "#lib/exceptions/issueCode.enum.ts"
import ValidationException from "#lib/exceptions/validation.exception.ts"

function mapZodIssue(issue: z.ZodIssue) {
  return new Issue({
    code: IssueCode[issue.code],
    path: issue.path as string[],
    message: issue.message,
    expected: null,
    received: null,
  })
}

export default function zodDto<Schema extends z.ZodSchema>(func: (zod: typeof z) => Schema) {
  const schema = func(z)

  return class ZodDTO {
    public static openapi = generateSchema(schema)
    public static schema = schema
    public static attributes = schema instanceof z.ZodObject ? Object.keys(schema.shape) : []
    public parsed: z.output<Schema>

    constructor(attributes: z.input<Schema>) {
      const parsedAttributes = schema.safeParse(attributes)

      if (parsedAttributes.success) {
        this.parsed = parsedAttributes.data
      } else {
        const issues = parsedAttributes.error.issues.map(mapZodIssue)
        throw new ValidationException(issues)
      }
    }

    public static generateMock() {
      return generateMock(schema)
    }
  } as DTO<z.input<Schema>, z.output<Schema>, Schema>
}

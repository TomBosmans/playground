import { z } from "zod"

export type Config = ReturnType<typeof configFactory>
export default function configFactory({ env }: { env: Record<string, unknown> }) {
  return z
    .object({
      OPENAPI_INFO_VERSION: z.string().default("v3"),
      OPENAPI_INFO_TITLE: z.string().default("hello world"),
      OPENAPI_INFO_DESCRIPTION: z.string().default("this is an example"),
    })
    .transform((config) => ({
      openapi: {
        info: {
          version: config.OPENAPI_INFO_VERSION,
          title: config.OPENAPI_INFO_TITLE,
          description: config.OPENAPI_INFO_DESCRIPTION,
        },
      },
    }))
    .parse(env)
}

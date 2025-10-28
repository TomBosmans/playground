import { z } from "zod"

export type Config = ReturnType<typeof configFactory>
export default function configFactory({ env }: { env: Record<string, unknown> }) {
  return z
    .object({
      POSTGRES_USER: z.string(),
      POSTGRES_PASSWORD: z.string().optional(),
      POSTGRES_PORT: z.coerce.number(),
      POSTGRES_DATABASE_NAME_DEV: z.string(),
      POSTGRES_DATABASE_NAME_TEST: z.string(),
      POSTGRES_HOST: z.string(),
    })
    .transform((config) => ({
      postgres: {
        port: config.POSTGRES_PORT,
        user: config.POSTGRES_USER,
        password: config.POSTGRES_PASSWORD,
        host: config.POSTGRES_HOST,
        database: {
          name:
            process.env.NODE_ENV === "test"
              ? config.POSTGRES_DATABASE_NAME_TEST
              : config.POSTGRES_DATABASE_NAME_DEV,
        },
      },
    }))
    .parse(env)
}

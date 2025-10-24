import { z } from "zod"

export type Config = ReturnType<typeof configFactory>
export default function configFactory({ env }: { env: Record<string, unknown> }) {
  return z
    .object({
      MAILER_HOST: z.string(),
      MAILER_PORT: z.coerce.number(),
      MAILER_SECURE: z.preprocess(
        (v) => (typeof v === "string" ? ["true", "TRUE", "1"].includes(v) : v),
        z.boolean().default(true),
      ),
      MAILER_AUTH_USER: z.string(),
      MAILER_AUTH_PASSWORD: z.string(),
    })
    .transform((config) => ({
      mailer: {
        host: config.MAILER_HOST,
        port: config.MAILER_PORT,
        secure: config.MAILER_SECURE,
        auth: {
          user: config.MAILER_AUTH_USER,
          pass: config.MAILER_AUTH_PASSWORD,
        },
      },
    }))
    .parse(env)
}

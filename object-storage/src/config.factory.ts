import { z } from "zod"

export type Config = ReturnType<typeof configFactory>
export default function configFactory({ env }: { env: Record<string, unknown> }) {
  return z
    .object({
      MINIO_DOMAIN: z.string(),
      MINIO_BUCKET: z.string(),
      MINIO_ROOT_USER: z.string(),
      MINIO_ROOT_PASSWORD: z.string(),
      MINIO_REGION: z.string().optional(),
      MINIO_SERVER_PORT: z.coerce.number(),
      MINIO_USE_SSL: z.preprocess(
        (v) => (typeof v === "string" ? ["true", "TRUE", "1"].includes(v) : v),
        z.boolean().default(true),
      ),
    })
    .transform((config) => ({
      minio: {
        endPoint: config.MINIO_DOMAIN,
        port: config.MINIO_SERVER_PORT,
        useSSL: config.MINIO_USE_SSL,
        accessKey: config.MINIO_ROOT_USER,
        secretKey: config.MINIO_ROOT_PASSWORD,
        region: config.MINIO_REGION,
        bucket: config.MINIO_BUCKET,
      },
    }))
    .parse(env)
}

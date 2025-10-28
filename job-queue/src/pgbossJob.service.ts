import PgBoss from "pg-boss"
import type { Config } from "./config.factory.ts"
import type JobService from "./job.service.ts"
import type { JobRegistry } from "./types.ts"

export default class PgBossJobService<Registry extends JobRegistry>
  implements JobService<Registry>
{
  private boss: PgBoss

  constructor(config: Config) {
    this.boss = new PgBoss({
      host: config.postgres.host,
      database: config.postgres.database.name,
      user: config.postgres.user,
      password: config.postgres.password,
      migrate: true,
      schema: "pgboss",
    })
    this.boss.on("error", (e) => console.error("JOB ERROR", e))
  }

  public async start() {
    await this.boss.start()
  }

  public async stop() {
    await this.boss.stop()
  }

  public async send(queue: keyof Registry, params: Parameters<Registry[keyof Registry]["run"]>[0]) {
    const id = await this.boss.send(queue as string, params as object)
    if (!id) throw new Error("job send returned no id")
    return id
  }

  public async register(
    name: keyof Registry,
    handler: Registry[keyof Registry],
    options: { concurrency?: number } = { concurrency: 1 },
  ) {
    await this.boss.createQueue(name as string)
    await this.boss.work(name as string, { batchSize: options?.concurrency }, async (jobs) => {
      await Promise.all(jobs.map((job) => handler.run(job.data)))
    })
  }
}

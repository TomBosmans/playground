import configFactory from "./config.factory.ts"
import type { JobRegistry } from "./job.registry.ts"
import EmailJob from "./jobs/email.job.ts"
import PgBossJobService from "./pgbossJob.service.ts"

const config = configFactory({ env: process.env })
const jobService = new PgBossJobService<JobRegistry>(config)

await jobService.start()

async function gracefulShutdown() {
  console.log("\nStopping job service...")
  await jobService.stop()
  console.log("Job service stopped. Exiting.\n")
  process.exit(0)
}

// Listen for Ctrl+C
process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

await jobService.register("email", new EmailJob(), { concurrency: 5 })

await jobService.send("email", { from: "me@email.com", to: "you@email.com", subject: "1" })
await jobService.send("email", { from: "me@email.com", to: "you@email.com", subject: "2" })
await jobService.send("email", { from: "me@email.com", to: "you@email.com", subject: "3" })
await jobService.send("email", { from: "me@email.com", to: "you@email.com", subject: "4" })
await jobService.send("email", { from: "me@email.com", to: "you@email.com", subject: "5" })
await jobService.send("email", { from: "me@email.com", to: "you@email.com", subject: "6" })
await jobService.send("email", { from: "me@email.com", to: "you@email.com", subject: "7" })

console.log("Job service is running. Press Ctrl+C to stop.")

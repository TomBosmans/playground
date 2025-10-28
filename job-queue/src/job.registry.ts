import EmailJob from "./jobs/email.job.ts"

const jobRegistry = {
  email: EmailJob,
} as const

export type JobRegistry = {
  [K in keyof typeof jobRegistry]: InstanceType<(typeof jobRegistry)[K]>
}

export default jobRegistry

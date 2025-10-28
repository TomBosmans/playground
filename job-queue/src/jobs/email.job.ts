import type { Job } from "../types.ts"

export default class EmailJob implements Job {
  public async run(params: { from: string; to: string; subject: string }) {
    console.log(params)
  }
}

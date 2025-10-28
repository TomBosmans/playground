export interface Job<Params = unknown> {
  run(params: Params): Promise<void>
}

export type JobRegistry = Record<string, Job<unknown>>

import type { JobRegistry } from "./types.ts"

/**
 * Interface representing a generic Job Service.
 * Provides methods to start the service, register job handlers,
 * and send jobs to a queue.
 *
 * @template Registry - A record of job names to their corresponding Job implementations.
 */
export default interface JobService<Registry extends JobRegistry> {
  /**
   * Starts the job service.
   * Typically this initializes connections to the underlying queue backend
   * and prepares workers for processing jobs.
   *
   * @returns A promise that resolves when the service is ready.
   */
  start(): Promise<void>

  /**
   * Stops the job service and gracefully shuts down all workers.
   * Typically this will:
   * - Disconnect from the queue backend (e.g., Redis, Postgres)
   * - Complete any in-progress jobs before exiting
   * - Release resources used by workers
   *
   * @returns A promise that resolves when all workers have stopped
   *          and the service is fully shut down.
   */
  stop(): Promise<void>

  /**
   * Registers a job handler for a specific queue.
   * After registration, the service will process jobs for this queue using the provided handler.
   *
   * @param queue - The name of the queue (must be a key in the Registry).
   * @param handler - The job handler object implementing `run(params)` for this queue.
   * @param options - Optional settings like concurrency
   * @returns A promise that resolves when the registration is complete.
   */
  register(
    queue: keyof Registry,
    handler: Registry[keyof Registry],
    options?: { concurrency?: number },
  ): Promise<void>

  /**
   * Sends a job to a specific queue.
   * The job parameters must match the type expected by the handler registered for that queue.
   *
   * @param queue - The name of the queue (must be a key in the Registry).
   * @param params - The parameters for the job, matching the handler's `run` method.
   * @returns A promise that resolves with the ID of the queued job.
   */
  send(
    queue: keyof Registry,
    params: Parameters<Registry[keyof Registry]["run"]>[0],
  ): Promise<string>
}

import type { RegisterData } from "./container.ts"

export type RegisterItem = {
  type: RegisterData["type"]
  registration: unknown
}

export type Registry = Record<string, RegisterItem>

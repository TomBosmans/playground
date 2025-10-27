import { randomUUID } from "node:crypto"
import MemoryRepository from "#lib/repository/memory.repository.ts"
import type Repository from "#lib/repository/repository.ts"
import type { NewSessionDTO, Session, UpdateSessionDTO } from "./session.entity.ts"

export type SessionRepository = Repository<Session, NewSessionDTO, UpdateSessionDTO>
export class SessionMemoryRepository extends MemoryRepository<
  Session,
  NewSessionDTO,
  UpdateSessionDTO
> {
  protected generatedAttributes(newEntityDTO: NewSessionDTO): Session {
    const now = new Date()
    return { ...newEntityDTO, id: randomUUID(), createdAt: now, updatedAt: now }
  }
}

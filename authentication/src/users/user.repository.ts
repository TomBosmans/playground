import { randomUUID } from "node:crypto"
import MemoryRepository from "#lib/repository/memory.repository.ts"
import type Repository from "#lib/repository/repository.ts"
import type { NewUserDTO, UpdateUserDto, User } from "./user.entity.ts"

export type UserRepository = Repository<User, NewUserDTO, UpdateUserDto>

export class UserMemoryRepository extends MemoryRepository<User, NewUserDTO, UpdateUserDto> {
  protected generatedAttributes(newEntityDTO: NewUserDTO): User {
    const now = new Date()
    return { ...newEntityDTO, id: randomUUID(), createdAt: now, updatedAt: now }
  }
}

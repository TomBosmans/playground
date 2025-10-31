import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { faker } from "@faker-js/faker"
import type { GeneratedAlways, Insertable, Selectable, Updateable } from "kysely"
import MemoryRepository from "../memory-repository.ts"
import type CRUDRepository from "../repository.ts"
import createKyselyRepository from "../kysely-repository.ts"
import { db } from "../db.ts"

type DB = {
  users: {
    id: GeneratedAlways<number>
    email: string
    firstName: string
    lastName: string
    age: number
    createdAt: GeneratedAlways<Date>
    updatedAt: GeneratedAlways<Date>
  }
}

type User = Selectable<DB["users"]>
type NewUserDTO = Insertable<DB["users"]>
type UpdateUserDTO = Updateable<DB["users"]>
type UserRepository = CRUDRepository<User, NewUserDTO, UpdateUserDTO>

function buildUser(params: Partial<DB["users"]> = {}) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 65 }),
    ...params,
  }
}

class UserMemoryRepositry extends MemoryRepository<User, NewUserDTO, UpdateUserDTO> {
  protected generatedAttributes(data: NewUserDTO) {
    const now = new Date()
    return { ...data, id: this.storage.length + 1, createdAt: now, updatedAt: now }
  }
}

class UserKyselyRepository extends createKyselyRepository("users") { }

for (const Repository of [UserMemoryRepositry, UserKyselyRepository]) {
  describe(Repository.name, () => {
    let repository: UserRepository

    beforeEach(async () => {
      repository = new Repository(db) as UserRepository
      await db.deleteFrom("users").execute()
    })

    describe("#create", () => {
      it("can create a record", async () => {
        const data = buildUser()
        const user = await repository.createOne(data)
        assert.deepStrictEqual({
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          ...data
        }, user, "created user should match the expected data")
        assert.strictEqual(user.id, 1, "id should be present")
        assert.ok(user.createdAt, "createdAt should be present")
        assert.ok(user.updatedAt, "updatedAt should be present")
        assert.strictEqual(user.updatedAt, user.createdAt, "updatedAt should equal createdAt")
      })

      it("can persist a record", async () => {
        const data = buildUser()
        const { id } = await repository.createOne(data)
        const user = await repository.findOne({ where: { id } })
        assert.deepStrictEqual(user, { ...data, id: user?.id, createdAt: user?.createdAt, updatedAt: user?.updatedAt })
      })
    })

    describe("#findMany", () => {
      it("can return all records", async () => {
        const data = [buildUser(), buildUser(), buildUser()]
        repository.createMany(data)
        const users = await repository.findMany()
        console.log(users)
        assert.strictEqual(users.length, 3)
      })

      it("can filter the records that equal value", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 20 })]
        repository.createMany(data)
        const users = await repository.findMany({ where: { age: 20 } })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 20)
      })

      it("can filter the records that $eq value", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 20 })]
        repository.createMany(data)
        const users = await repository.findMany({ where: { age: { $eq: 20 } } })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 20)
      })

      it("can filter the records that $lt value", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = await repository.findMany({ where: { age: { $lt: 25 } } })
        assert.strictEqual(users.length, 1)
        assert.strictEqual(users[0].age, 20)
      })

      it("can filter the records that $lte value", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = await repository.findMany({ where: { age: { $lte: 25 } } })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 25)
      })

      it("can order asc", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = await repository.findMany({ orderBy: { age: "asc" } })
        assert.strictEqual(users.length, 3)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 25)
        assert.strictEqual(users[2].age, 31)
      })

      it("can order desc", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = await repository.findMany({ orderBy: { age: "desc" } })
        assert.strictEqual(users.length, 3)
        assert.strictEqual(users[0].age, 31)
        assert.strictEqual(users[1].age, 25)
        assert.strictEqual(users[2].age, 20)
      })

      it("can limit", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = await repository.findMany({ orderBy: { age: "desc" }, limit: 2 })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 31)
        assert.strictEqual(users[1].age, 25)
      })

      it("can offset", async () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = await repository.findMany({ orderBy: { age: "desc" }, limit: 2, offset: 1 })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 25)
        assert.strictEqual(users[1].age, 20)
      })
    })
  })
}

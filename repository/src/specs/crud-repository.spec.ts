import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import { faker } from "@faker-js/faker"
import MemoryRepository from "../memory-repository.ts"

type DB = {
  users: {
    id: string
    email: string
    firstName: string
    lastName: string
    age: number
    createdAt: Date
    updatedAt: Date
  }
}

function buildUser(params: Partial<DB["users"]> = {}) {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 65 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent({ refDate: Date.now() }),
    ...params,
  }
}

for (const Repository of [MemoryRepository]) {
  describe(Repository.name, () => {
    let repository: MemoryRepository<DB, "users">

    beforeEach(() => {
      repository = new Repository<DB, "users">()
    })

    describe("#create", () => {
      it("can create a record", async () => {
        const data = buildUser()
        const user = repository.createOne(data)
        assert.deepStrictEqual(data, user)
      })

      it("can persist a record", async () => {
        const data = buildUser()
        const { id } = repository.createOne(data)
        const user = repository.findOne({ where: { id } })
        assert.deepStrictEqual(data, user)
      })
    })

    describe("#findMany", () => {
      it("can return all records", async () => {
        const data = [buildUser(), buildUser(), buildUser()]
        repository.createMany(data)
        const users = repository.findMany()
        assert.strictEqual(users.length, 3)
      })

      it("can filter the records that equal value", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 20 })]
        repository.createMany(data)
        const users = repository.findMany({ where: { age: 20 } })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 20)
      })

      it("can filter the records that $eq value", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 20 })]
        repository.createMany(data)
        const users = repository.findMany({ where: { age: { $eq: 20 } } })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 20)
      })

      it("can filter the records that $lt value", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = repository.findMany({ where: { age: { $lt: 25 } } })
        assert.strictEqual(users.length, 1)
        assert.strictEqual(users[0].age, 20)
      })

      it("can filter the records that $lte value", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = repository.findMany({ where: { age: { $lte: 25 } } })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 25)
      })

      it("can order asc", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = repository.findMany({ orderBy: { age: "asc" } })
        assert.strictEqual(users.length, 3)
        assert.strictEqual(users[0].age, 20)
        assert.strictEqual(users[1].age, 25)
        assert.strictEqual(users[2].age, 31)
      })

      it("can order desc", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = repository.findMany({ orderBy: { age: "desc" } })
        assert.strictEqual(users.length, 3)
        assert.strictEqual(users[0].age, 31)
        assert.strictEqual(users[1].age, 25)
        assert.strictEqual(users[2].age, 20)
      })

      it("can limit", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = repository.findMany({ orderBy: { age: "desc" }, limit: 2 })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 31)
        assert.strictEqual(users[1].age, 25)
      })

      it("can offset", () => {
        const data = [buildUser({ age: 20 }), buildUser({ age: 31 }), buildUser({ age: 25 })]
        repository.createMany(data)
        const users = repository.findMany({ orderBy: { age: "desc" }, limit: 2, offset: 1 })
        assert.strictEqual(users.length, 2)
        assert.strictEqual(users[0].age, 25)
        assert.strictEqual(users[1].age, 20)
      })
    })
  })
}

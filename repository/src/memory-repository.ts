import sift from "sift"
import type {
  CountQueryParams,
  DataSet,
  DeleteQueryParams,
  InsertQueryParams,
  SelectQueryParams,
  UpdateQueryParams,
} from "#types.ts"
import type Repository from "./repository.ts"

export default class MemoryRepository<DB extends DataSet, TableName extends keyof DB>
  implements Repository<DB, TableName>
{
  private storage: Array<DB[TableName]> = []

  findMany({ where, limit, offset, orderBy }: SelectQueryParams<DB, TableName> = {}) {
    let result = this.storage

    // biome-ignore lint/suspicious/noExplicitAny: It is ok
    if (where) result = result.filter(sift.default(where as any))
    if (orderBy) {
      const keys = Object.keys(orderBy) as (keyof DB[TableName])[]
      result = [...result].sort((a, b) => {
        for (const key of keys) {
          const direction = orderBy[key]
          const comparison = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
          if (comparison !== 0) return direction === "desc" ? -comparison : comparison
        }
        return 0
      })
    }
    if (offset) result = result.slice(offset)
    if (limit) result = result.slice(0, limit)

    return result
  }

  findOne(params: SelectQueryParams<DB, TableName>) {
    return this.findMany(params)[0]
  }

  findOneOrThrow(params: SelectQueryParams<DB, TableName>) {
    const record = this.findMany(params)[0]
    if (record) return record

    throw Error("Record not found")
  }

  count(params: CountQueryParams<DB, TableName>) {
    // biome-ignore lint/suspicious/noExplicitAny: It is ok
    return this.storage.filter(sift.default(params.where as any)).length
  }

  createOne(newRecord: InsertQueryParams<DB, TableName>) {
    this.storage.push(newRecord)
    return newRecord
  }
  createMany(newRecords: Array<InsertQueryParams<DB, TableName>>) {
    this.storage.push(...newRecords)
    return newRecords
  }
  update(params: UpdateQueryParams<DB, TableName>) {
    const updatedRecords: Array<DB[TableName]> = []
    this.storage.forEach((record, index) => {
      if (sift.default(params)(record)) {
        this.storage[index] = { ...this.storage[index], ...params.set }
        updatedRecords.push(this.storage[index])
      }
    })

    return updatedRecords
  }

  delete(params: DeleteQueryParams<DB, TableName>) {
    for (let index = this.storage.length - 1; index >= 0; index--) {
      if (sift.default(params)(this.storage[index])) {
        this.storage.splice(index, 1)
      }
    }
  }
}

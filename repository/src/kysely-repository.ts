import type { Insertable, Kysely, Selectable, Updateable } from "kysely"
import type DB from "#db.type.ts"
import countQuery from "#kysely/queries/count.query.ts"
import deleteQuery, { type DeleteQueryParams } from "#kysely/queries/delete.query.ts"
import insertQuery, {
  type InsertManyQueryParams,
  type InsertOneQueryParams,
} from "#kysely/queries/insert.query.ts"
import selectQuery, { type SelectQueryParams } from "#kysely/queries/select.query.ts"
import updateQuery, { type UpdateQueryParams } from "#kysely/queries/update.query.ts"
import type Repository from "./repository.ts"

export default function createKyselyRepository<Table extends keyof DB>(table: Table) {
  type Entity = Selectable<DB[Table]>
  type NewEntityDTO = Insertable<DB[Table]>
  type UpdateEntityDTO = Updateable<DB[Table]>

  return class KyselyRepository implements Repository<Entity, NewEntityDTO, UpdateEntityDTO> {
    private readonly db: Kysely<DB>

    constructor(db: Kysely<DB>) {
      this.db = db
    }

    async findMany(params = {}) {
      const query = selectQuery(table, params as SelectQueryParams<Table>, this.db)
      const records = await query.execute()
      return records as Entity[]
    }

    async findOne(params: unknown) {
      const record = (await selectQuery(table, params as SelectQueryParams<Table>, this.db).executeTakeFirst()) ?? null
      return record as Entity
    }

    async findOneOrThrow(params: unknown) {
      const record = await selectQuery(table, params as SelectQueryParams<Table>, this.db).executeTakeFirst()
      if (record) return record as Entity

      throw new Error("Record not found")
    }

    async count(params: unknown) {
      const query = countQuery(selectQuery(table, params as Pick<SelectQueryParams<Table>, "where">, this.db))
      const records = await query.executeTakeFirst()
      return records?.count || 0
    }

    public async createOne(params: InsertOneQueryParams<Table>) {
      try {
        const [record] = await insertQuery(table, params, this.db).execute()
        return record
      } catch (error) {
        this.handleError(error)
      }
    }

    public async createMany(params: InsertManyQueryParams<Table>) {
      try {
        const records = await insertQuery(table, params, this.db).execute()
        return records
      } catch (error) {
        this.handleError(error)
      }
    }

    public async update(params: unknown) {
      try {
        const records = await updateQuery(table, params as UpdateQueryParams<Table>, this.db).execute()
        return records as Entity[]
      } catch (error) {
        this.handleError(error)
      }
    }

    public async delete(params: unknown) {
      await deleteQuery(table, params as DeleteQueryParams<Table>, this.db).execute()
    }

    private handleError(error: unknown): never {
      if (!error) throw error
      if (typeof error !== "object") throw error
      if (!("code" in error)) throw error

      const details = this.extractDetailFromError(error)

      if (error.code === "23505") {
        throw [
          {
            code: "not_unique",
            path: [details[1]],
            message: `${details[2]} is not unique`,
          },
        ]
      }
      throw error
    }

    private extractDetailFromError(error: Record<string, unknown>) {
      if (!("detail" in error)) return []
      if (typeof error.detail !== "string") return []
      return error.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/) || []
    }
  }
}

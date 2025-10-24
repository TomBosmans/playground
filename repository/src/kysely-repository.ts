import type { Kysely } from "kysely"
import type DB from "#db.type.ts"
import countQuery from "#kysely/queries/count.query.ts"
import deleteQuery, { type DeleteQueryParams } from "#kysely/queries/delete.query.ts"
import insertQuery, {
  type InsertManyQueryParams,
  type InsertOneQueryParams,
} from "#kysely/queries/insert.query.ts"
import selectQuery, { type SelectQueryParams } from "#kysely/queries/select.query.ts"
import updateQuery, { type UpdateQueryParams } from "#kysely/queries/update.query.ts"

export default function createKyselyRepository<Table extends keyof DB>(table: Table) {
  return class KyselyRepository {
    private readonly db: Kysely<DB>

    constructor(db: Kysely<DB>) {
      this.db = db
    }

    async findMany(params: SelectQueryParams<Table> = {}) {
      const query = selectQuery(table, params, this.db)
      const records = await query.execute()
      return records
    }

    async findOne(params: SelectQueryParams<Table>) {
      const record = (await selectQuery<Table>(table, params, this.db).executeTakeFirst()) ?? null
      return record
    }

    async findOneOrThrow(params: SelectQueryParams<Table>) {
      const record = await selectQuery<Table>(table, params, this.db).executeTakeFirst()
      if (record) return record

      throw new Error("Record not found")
    }

    async count(params: Pick<SelectQueryParams<Table>, "where">) {
      const query = countQuery(selectQuery(table, params, this.db))
      const records = await query.executeTakeFirst()
      return records?.count
    }

    public async create(params: InsertOneQueryParams<Table>) {
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

    public async update(params: UpdateQueryParams<Table>) {
      try {
        const records = await updateQuery(table, params, this.db).execute()
        return records
      } catch (error) {
        this.handleError(error)
      }
    }

    public async delete(params: DeleteQueryParams<Table>) {
      await deleteQuery(table, params, this.db).execute()
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

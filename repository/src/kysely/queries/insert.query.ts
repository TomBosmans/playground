import type { Insertable, Kysely } from "kysely"
import type DB from "#db.type.ts"

export type InsertOneQueryParams<Table extends keyof DB> = Insertable<DB[Table]>
export type InsertManyQueryParams<Table extends keyof DB> = Array<Insertable<DB[Table]>>
export type InsertQueryParams<Table extends keyof DB> =
  | InsertOneQueryParams<Table>
  | InsertManyQueryParams<Table>

export default function insertQuery<Table extends keyof DB>(
  table: Table,
  params: InsertQueryParams<Table>,
  db: Kysely<DB>,
) {
  return db.insertInto(table).values(params).returningAll()
}

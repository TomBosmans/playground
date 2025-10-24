import type { Kysely } from "kysely"
import type DB from "#db.type.ts"
import whereClause, { type Where } from "../clauses/where.clause.ts"

export type DeleteQueryParams<Table extends keyof DB> = {
  where: Where<Table>
}

export default function deleteQuery<Table extends keyof DB>(
  table: Table,
  params: DeleteQueryParams<Table>,
  db: Kysely<DB>,
) {
  let query = db.deleteFrom(table).returningAll()
  // biome-ignore lint/suspicious/noExplicitAny: It is ok
  query = whereClause(params.where)(query as any) as any as typeof query
  return query
}

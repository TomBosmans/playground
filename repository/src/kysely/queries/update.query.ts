import type { Kysely, Updateable } from "kysely"
import type DB from "#db.type.ts"
import whereClause, { type Where } from "../clauses/where.clause.ts"

export type UpdateQueryParams<Table extends keyof DB> = {
  set: Updateable<DB[Table]>
  where: Where<Table>
}

export default function updateQuery<Table extends keyof DB>(
  table: Table,
  params: UpdateQueryParams<Table>,
  db: Kysely<DB>,
) {
  let query = db
    .updateTable(table)
    // @ts-expect-error
    .set(params.set)
    .returningAll()
  // biome-ignore lint/suspicious/noExplicitAny: It is ok
  query = whereClause(params.where)(query as any) as any as typeof query
  return query
}

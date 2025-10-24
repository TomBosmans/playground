import type { Kysely } from "kysely"
import type DB from "#db.type.ts"
import orderByClause, { type OrderBy } from "../clauses/orderBy.clause.ts"
import whereClause, { type Where } from "../clauses/where.clause.ts"

export type SelectQueryParams<Table extends keyof DB> = {
  //select?: Select<Table>
  orderBy?: OrderBy<Table>
  where?: Where<Table>
  limit?: number
  offset?: number
}

export default function selectQuery<Table extends keyof DB>(
  table: Table,
  params: SelectQueryParams<Table> = {},
  eb: Kysely<DB>,
) {
  let query = eb.selectFrom(table).selectAll()
  // // biome-ignore lint/suspicious/noExplicitAny: It is ok
  //query = selectClause(params.select)(query as any) as any as typeof query
  // biome-ignore lint/suspicious/noExplicitAny: It is ok
  query = orderByClause(params.orderBy)(query as any) as any as typeof query
  // biome-ignore lint/suspicious/noExplicitAny: It is ok
  query = whereClause(params.where)(query as any) as any as typeof query
  if (params.limit !== undefined) query = query.limit(params.limit)
  if (params.offset !== undefined) query = query.offset(params.offset)
  return query
}

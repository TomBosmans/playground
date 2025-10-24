import { sql } from "kysely"
import type DB from "#db.type.ts"
import type { SelectQuery } from "#kysely/types.ts"

export default function countQuery<Table extends keyof DB>(eb: SelectQuery<Table>) {
  return eb.clearSelect().clearOrderBy().select(sql<number>`count(*)::int`.as("count"))
}

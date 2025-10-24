import type DB from "#db.type.ts"
import type { SelectQuery } from "#kysely/types.ts"

export type OrderBy<Table extends keyof DB> = Partial<Record<keyof DB[Table], "asc" | "desc">>

export default function orderByClause<Table extends keyof DB>(orderBy?: OrderBy<Table>) {
  return (query: SelectQuery<Table>) => {
    if (!orderBy) return query

    const attributes = Object.keys(orderBy) as Array<keyof typeof orderBy>
    for (const attribute of attributes) {
      // biome-ignore lint/suspicious/noExplicitAny: It is ok
      query = query.orderBy(attribute as any, orderBy[attribute])
    }
    return query
  }
}
